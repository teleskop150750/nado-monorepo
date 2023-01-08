/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable padding-line-between-statements */
/* eslint-disable unicorn/consistent-destructuring */
// @ts-nocheck
/* eslint-disable no-use-before-define */
import { isArray, isFunction, isObject } from '@vue/shared'
import { useResizeObserver } from '@vueuse/core'
import { debounce as lodashDebounce, get, isEqual, isNil } from 'lodash-unified'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../constants/index.js'
import { useFormItem, useNamespace, useSize } from '../../../hooks/index.js'
import { NIconChevronUp } from '../../../icons/index.js'
import { debugWarn } from '../../../utils/index.js'
import { useAllowCreate } from './useAllowCreate.js'
// import { useInput } from './useInput.js'
import { flattenOptions } from './util.js'

const DEFAULT_INPUT_PLACEHOLDER = ''
const MINIMUM_INPUT_WIDTH = 11
const TAG_BASE_WIDTH = {
  larget: 51,
  default: 42,
  small: 33,
}

/**
 * @param {import("vue").ExtractPropTypes<import("./selectProps.js").ISelectProps>} props
 * @param {*} emit
 * @returns
 */
const useSelect = (props, emit) => {
  // inject
  const nsSelectV2 = useNamespace('select-v2')
  const nsInput = useNamespace('input')
  const { form: elForm, formItem: elFormItem } = useFormItem()

  const states = reactive({
    inputValue: DEFAULT_INPUT_PLACEHOLDER,
    displayInputValue: DEFAULT_INPUT_PLACEHOLDER,
    calculatedWidth: 0,
    cachedPlaceholder: '',
    cachedOptions: [],
    createdOptions: [],
    createdLabel: '',
    createdSelected: false,
    currentPlaceholder: '',
    hoveringIndex: -1,
    comboBoxHovering: false,
    isOnComposition: false,
    isSilentBlur: false,
    isComposing: false,
    inputLength: 20,
    selectWidth: 200,
    initialInputHeight: 0,
    previousQuery: null,
    previousValue: undefined,
    query: '',
    selectedLabel: '',
    softFocus: false,
    tagInMultiLine: false,
  })

  // data refs
  const selectedIndex = ref(-1)
  const popperSize = ref(-1)

  // DOM & Component refs
  const controlRef = ref(null)
  const inputRef = ref(null) // el-input ref
  const menuRef = ref(null)
  const popper = ref(null)
  const selectRef = ref(null)
  const selectionRef = ref(null) // tags ref
  const calculatorRef = ref(null)

  // the controller of the expanded popup
  const expanded = ref(false)

  const selectDisabled = computed(() => Boolean(props.disabled) || Boolean(elForm?.disabled))

  // TODO: Доделать расчет размера при размера элемента по функции  props.itemHeight: () =>
  const popupHeight = computed(() => {
    const totalHeight = filteredOptions.value.length * props.itemHeight
    if (Number.isNaN(totalHeight)) {
      return props.height
    }
    return totalHeight > props.height ? props.height : totalHeight
  })

  const hasModelValue = computed(() => !isNil(props.modelValue))

  const showClearBtn = computed(() => {
    const hasValue = props.multiple
      ? Array.isArray(props.modelValue) && props.modelValue.length > 0
      : hasModelValue.value

    const criteria = props.clearable && !selectDisabled.value && states.comboBoxHovering && hasValue
    return criteria
  })

  const iconComponent = computed(() => (props.remote && props.filterable ? '' : NIconChevronUp))

  const isReverse = computed(() => iconComponent.value && expanded.value)

  const validateState = computed(() => elFormItem?.validateState || '')

  const debounce = computed(() => (props.remote ? 300 : 0))

  // filteredOptions includes flatten the data into one dimensional array.
  const emptyText = computed(() => {
    const options = filteredOptions.value

    if (props.loading) {
      return props.loadingText || 'loadingText'
    }

    if (props.remote && states.inputValue === '' && options.length === 0) {
      return false
    }

    if (props.filterable && states.inputValue && options.length > 0) {
      return props.noMatchText || 'noMatchText'
    }
    if (options.length === 0) {
      return props.noDataText || 'Нет данных'
    }

    return null
  })

  const filteredOptions = computed(() => {
    const isValidOption = (o) => {
      // fill the conditions here.
      const query = states.inputValue
      // when query was given, we should test on the label see whether the label contains the given query
      const containsQueryString = query ? o.label?.includes(query) : true
      return containsQueryString
    }
    if (props.loading) {
      return []
    }
    return flattenOptions(
      props.options
        // eslint-disable-next-line unicorn/prefer-spread
        .concat(states.createdOptions)
        .map((v) => {
          if (isArray(v.options)) {
            const filtered = v.options.filter(isValidOption)
            if (filtered.length > 0) {
              return {
                ...v,
                options: filtered,
              }
            }
          } else if (props.remote || isValidOption(v)) {
            return v
          }
          return null
        })
        .filter((v) => v !== null),
    )
  })

  const optionsAllDisabled = computed(() => filteredOptions.value.every((option) => option.disabled))

  const selectSize = useSize()

  const collapseTagSize = computed(() => (selectSize.value === 'small' ? 'small' : 'default'))

  const tagMaxWidth = computed(() => {
    const select = selectionRef.value
    const size = collapseTagSize.value || 'default'
    const paddingLeft = select ? Number.parseInt(getComputedStyle(select).paddingLeft) : 0
    const paddingRight = select ? Number.parseInt(getComputedStyle(select).paddingRight) : 0
    return states.selectWidth - paddingRight - paddingLeft - TAG_BASE_WIDTH[size]
  })

  const calculatePopperSize = () => {
    popperSize.value = selectRef.value?.offsetWidth || 200
  }

  const inputWrapperStyle = computed(() => ({
    width: `${
      states.calculatedWidth === 0 ? MINIMUM_INPUT_WIDTH : Math.ceil(states.calculatedWidth) + MINIMUM_INPUT_WIDTH
    }px`,
  }))

  const shouldShowPlaceholder = computed(() => {
    if (isArray(props.modelValue)) {
      return props.modelValue.length === 0 && !states.displayInputValue
    }

    // when it's not multiple mode, we only determine this flag based on filterable and expanded
    // when filterable flag is true, which means we have input box on the screen
    return props.filterable ? states.displayInputValue.length === 0 : true
  })

  const currentPlaceholder = computed(() => {
    const _placeholder = props.placeholder
    return props.multiple || isNil(props.modelValue) ? _placeholder : states.selectedLabel
  })

  // this obtains the actual popper DOM element.
  const popperRef = computed(() => popper.value?.popperRef?.contentRef)

  // the index with current value in options
  const indexRef = computed(() => {
    if (props.multiple) {
      const len = props.modelValue.length
      if (props.modelValue.length > 0) {
        return filteredOptions.value.findIndex((o) => o.value === props.modelValue[len - 1])
      }
    } else if (props.modelValue) {
      return filteredOptions.value.findIndex((o) => o.value === props.modelValue)
    }
    return -1
  })

  const dropdownMenuVisible = computed({
    get() {
      return expanded.value && emptyText.value !== false
    },
    set(val) {
      expanded.value = val
    },
  })

  // hooks
  const { createNewOption, removeNewOption, selectNewOption, clearAllNewOption } = useAllowCreate(props, states)
  // const { handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useInput((e) => onInput(e))

  // methods
  const focusAndUpdatePopup = () => {
    inputRef.value.focus?.()
    popper.value?.updatePopper()
  }

  const toggleMenu = () => {
    if (props.automaticDropdown) {
      return
    }
    if (!selectDisabled.value) {
      if (states.isComposing) {
        states.softFocus = true
      }
      return nextTick(() => {
        expanded.value = !expanded.value
        inputRef.value?.focus?.()
      })
    }
  }

  const onInputChange = () => {
    if (props.filterable && states.inputValue !== states.selectedLabel) {
      states.query = states.selectedLabel
    }
    handleQueryChange(states.inputValue)
    return nextTick(() => {
      createNewOption(states.inputValue)
    })
  }

  const debouncedOnInputChange = lodashDebounce(onInputChange, debounce.value)

  const handleQueryChange = (val) => {
    if (states.previousQuery === val) {
      return
    }
    states.previousQuery = val
    if (props.filterable && isFunction(props.filterMethod)) {
      props.filterMethod(val)
    } else if (props.filterable && props.remote && isFunction(props.remoteMethod)) {
      props.remoteMethod(val)
    }
  }

  const emitChange = (val) => {
    if (!isEqual(props.modelValue, val)) {
      emit(CHANGE_EVENT, val)
    }
  }

  const update = (val) => {
    emit(UPDATE_MODEL_EVENT, val)
    emitChange(val)
    states.previousValue = val?.toString()
  }

  const getValueIndex = (arr = [], value = undefined) => {
    if (!isObject(value)) {
      return arr.indexOf(value)
    }
    const valueKey = props.valueKey
    let index = -1
    arr.some((item, i) => {
      if (get(item, valueKey) === get(value, valueKey)) {
        index = i
        return true
      }
      return false
    })
    return index
  }

  const getValueKey = (item) => (isObject(item) ? get(item, props.valueKey) : item)

  // if the selected item is item then we get label via indexing
  // otherwise it should be string we simply return the item itself.
  const getLabel = (item) => (isObject(item) ? item.label : item)

  const resetInputHeight = () => {
    if (props.collapseTags && !props.filterable) {
      return
    }
    return nextTick(() => {
      if (!inputRef.value) {
        return
      }
      const selection = selectionRef.value

      selectRef.value.height = selection.offsetHeight
      if (expanded.value && emptyText.value !== false) {
        popper.value?.updatePopper?.()
      }
    })
  }

  const handleResize = () => {
    resetInputWidth()
    calculatePopperSize()
    popper.value?.updatePopper?.()
    if (props.multiple) {
      return resetInputHeight()
    }
  }

  const resetInputWidth = () => {
    const select = selectionRef.value
    if (select) {
      states.selectWidth = select.getBoundingClientRect().width
    }
  }

  const onSelect = (option, idx, byClick = true) => {
    if (props.multiple) {
      // eslint-disable-next-line unicorn/prefer-spread
      let selectedOptions = props.modelValue.slice()

      const index = getValueIndex(selectedOptions, getValueKey(option))
      if (index > -1) {
        selectedOptions = [...selectedOptions.slice(0, index), ...selectedOptions.slice(index + 1)]
        states.cachedOptions.splice(index, 1)
        removeNewOption(option)
      } else if (props.multipleLimit <= 0 || selectedOptions.length < props.multipleLimit) {
        selectedOptions = [...selectedOptions, getValueKey(option)]
        states.cachedOptions.push(option)
        selectNewOption(option)
        updateHoveringIndex(idx)
      }
      update(selectedOptions)
      if (option.created) {
        states.query = ''
        handleQueryChange('')
        states.inputLength = 20
      }
      if (props.filterable && !props.reserveKeyword) {
        inputRef.value.focus?.()
        onUpdateInputValue('')
      }
      if (props.filterable) {
        states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
      }
      resetInputHeight()
      setSoftFocus()
    } else {
      selectedIndex.value = idx
      states.selectedLabel = option.label
      update(getValueKey(option))
      expanded.value = false
      states.isComposing = false
      states.isSilentBlur = byClick
      selectNewOption(option)
      if (!option.created) {
        clearAllNewOption()
      }
      updateHoveringIndex(idx)
    }
  }

  const deleteTag = (event, tag) => {
    const { valueKey } = props
    const index = props.modelValue.indexOf(get(tag, valueKey))

    if (index > -1 && !selectDisabled.value) {
      const value = [...props.modelValue.slice(0, index), ...props.modelValue.slice(index + 1)]
      states.cachedOptions.splice(index, 1)
      update(value)
      emit('remove-tag', get(tag, valueKey))
      states.softFocus = true
      removeNewOption(tag)
      return nextTick(() => focusAndUpdatePopup())
    }
    event.stopPropagation()
  }

  const handleFocus = (event) => {
    const focused = states.isComposing
    states.isComposing = true
    if (!states.softFocus) {
      // If already in the focus state, shouldn't trigger event
      if (!focused) {
        emit('focus', event)
      }
    } else {
      states.softFocus = false
    }
  }

  const handleBlur = (event) => {
    states.softFocus = false

    // reset input value when blurred
    // https://github.com/ElemeFE/element/pull/10822
    return nextTick(() => {
      inputRef.value?.blur?.()
      if (calculatorRef.value) {
        states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
      }
      if (states.isSilentBlur) {
        states.isSilentBlur = false
      } else if (states.isComposing) {
        emit('blur', event)
      }
      states.isComposing = false
    })
  }

  // keyboard handlers
  const handleEsc = () => {
    if (states.displayInputValue.length > 0) {
      onUpdateInputValue('')
    } else {
      expanded.value = false
    }
  }

  const handleDel = (e) => {
    if (states.displayInputValue.length === 0) {
      e.preventDefault()
      const selected = [...props.modelValue]
      selected.pop()
      removeNewOption(states.cachedOptions.pop())
      update(selected)
    }
  }

  const handleClear = () => {
    let emptyValue
    if (isArray(props.modelValue)) {
      emptyValue = []
    } else {
      emptyValue = undefined
    }

    states.softFocus = true
    if (props.multiple) {
      states.cachedOptions = []
    } else {
      states.selectedLabel = ''
    }
    expanded.value = false
    update(emptyValue)
    emit('clear')
    clearAllNewOption()
    return nextTick(() => focusAndUpdatePopup())
  }

  const onUpdateInputValue = (val) => {
    states.displayInputValue = val
    states.inputValue = val
  }

  const onKeyboardNavigate = (direction, hoveringIndex) => {
    const options = filteredOptions.value
    if (
      !['forward', 'backward'].includes(direction) ||
      selectDisabled.value ||
      options.length <= 0 ||
      optionsAllDisabled.value
    ) {
      return
    }
    if (!expanded.value) {
      return toggleMenu()
    }
    if (hoveringIndex === undefined) {
      hoveringIndex = states.hoveringIndex
    }
    let newIndex = -1
    if (direction === 'forward') {
      newIndex = hoveringIndex + 1
      if (newIndex >= options.length) {
        // return to the first option
        newIndex = 0
      }
    } else if (direction === 'backward') {
      newIndex = hoveringIndex - 1
      if (newIndex < 0 || newIndex >= options.length) {
        // navigate to the last one
        newIndex = options.length - 1
      }
    }
    const option = options[newIndex]
    if (option.disabled || option.type === 'Group') {
      // prevent dispatching multiple nextTick callbacks.
      return onKeyboardNavigate(direction, newIndex)
    }
    updateHoveringIndex(newIndex)
    scrollToItem(newIndex)
  }

  const onKeyboardSelect = () => {
    if (!expanded.value) {
      return toggleMenu()
    }
    if (~states.hoveringIndex && filteredOptions.value[states.hoveringIndex]) {
      onSelect(filteredOptions.value[states.hoveringIndex], states.hoveringIndex, false)
    }
  }

  const updateHoveringIndex = (idx) => {
    states.hoveringIndex = idx
  }

  const resetHoveringIndex = () => {
    states.hoveringIndex = -1
  }

  const setSoftFocus = () => {
    const _input = inputRef.value
    if (_input) {
      _input.focus?.()
    }
  }

  const onInput = (event) => {
    const value = event.target.value
    onUpdateInputValue(value)
    if (states.displayInputValue.length > 0 && !expanded.value) {
      expanded.value = true
    }

    states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
    if (props.multiple) {
      resetInputHeight()
    }
    if (props.remote) {
      debouncedOnInputChange()
    } else {
      return onInputChange()
    }
  }

  const handleClickOutside = () => {
    expanded.value = false
    return handleBlur()
  }

  const handleMenuEnter = () => {
    states.inputValue = states.displayInputValue
    return nextTick(() => {
      if (~indexRef.value) {
        updateHoveringIndex(indexRef.value)
        scrollToItem(states.hoveringIndex)
      }
    })
  }

  const scrollToItem = (index) => {
    menuRef.value.scrollToItem(index)
  }

  const initStates = () => {
    resetHoveringIndex()
    if (props.multiple) {
      if (props.modelValue.length > 0) {
        let initHovering = false
        states.cachedOptions.length = 0
        states.previousValue = props.modelValue.toString()
        props.modelValue.forEach((selected) => {
          const itemIndex = filteredOptions.value.findIndex((option) => getValueKey(option) === selected)
          if (~itemIndex) {
            states.cachedOptions.push(filteredOptions.value[itemIndex])
            if (!initHovering) {
              updateHoveringIndex(itemIndex)
            }
            initHovering = true
          }
        })
      } else {
        states.cachedOptions = []
        states.previousValue = undefined
      }
    } else if (hasModelValue.value) {
      states.previousValue = props.modelValue
      const options = filteredOptions.value
      const selectedItemIndex = options.findIndex((option) => getValueKey(option) === getValueKey(props.modelValue))
      if (~selectedItemIndex) {
        states.selectedLabel = options[selectedItemIndex].label
        updateHoveringIndex(selectedItemIndex)
      } else {
        states.selectedLabel = `${props.modelValue}`
      }
    } else {
      states.selectedLabel = ''
      states.previousValue = undefined
    }
    clearAllNewOption()
    calculatePopperSize()
  }

  // in order to track these individually, we need to turn them into refs instead of watching the entire
  // reactive object which could cause perf penalty when unnecessary field gets changed the watch method will
  // be invoked.

  watch(expanded, (val) => {
    emit('visible-change', val)
    if (val) {
      popper.value.update?.()
      // the purpose of this function is to differ the blur event trigger mechanism
    } else {
      states.displayInputValue = ''
      states.previousQuery = null
      createNewOption('')
    }
  })

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (!val || val.toString() !== states.previousValue) {
        initStates()
      }
      if (!isEqual(val, oldVal) && props.validateEvent) {
        // eslint-disable-next-line unicorn/catch-error-name
        elFormItem?.validate?.('change').catch((err) => debugWarn(err))
      }
    },
    {
      deep: true,
    },
  )

  watch(
    () => props.options,
    () => {
      const input = inputRef.value
      // filter or remote-search scenarios are not initialized
      if (!input || (input && document.activeElement !== input)) {
        initStates()
      }
    },
    {
      deep: true,
    },
  )

  // fix the problem that scrollTop is not reset in filterable mode
  watch(filteredOptions, () => nextTick(menuRef.value.resetScrollTop))

  onMounted(() => {
    initStates()
  })
  useResizeObserver(selectRef, handleResize)

  return {
    // data exports
    collapseTagSize,
    currentPlaceholder,
    expanded,
    emptyText,
    popupHeight,
    debounce,
    filteredOptions,
    iconComponent,
    isReverse,
    inputWrapperStyle,
    popperSize,
    dropdownMenuVisible,
    hasModelValue,
    // readonly,
    shouldShowPlaceholder,
    selectDisabled,
    selectSize,
    showClearBtn,
    states,
    tagMaxWidth,
    nsSelectV2,
    nsInput,

    // refs items exports
    calculatorRef,
    controlRef,
    inputRef,
    menuRef,
    popper,
    selectRef,
    selectionRef,

    popperRef,

    validateState,

    // methods exports
    debouncedOnInputChange,
    deleteTag,
    getLabel,
    getValueKey,
    handleBlur,
    handleClear,
    handleClickOutside,
    handleDel,
    handleEsc,
    handleFocus,
    handleMenuEnter,
    handleResize,
    toggleMenu,
    scrollTo: scrollToItem,
    onInput,
    onKeyboardNavigate,
    onKeyboardSelect,
    onSelect,
    onHover: updateHoveringIndex,
    onUpdateInputValue,

    // handleCompositionStart,
    // handleCompositionEnd,
    // handleCompositionUpdate,
  }
}

export default useSelect
