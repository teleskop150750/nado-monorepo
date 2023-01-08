import { isObject, toRawType } from '@vue/shared'
import { isClient } from '@vueuse/core'
import { debounce as lodashDebounce, get, isEqual } from 'lodash-unified'
import { computed, nextTick, reactive, ref, shallowRef, toRaw, triggerRef, watch } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../constants/event.js'
import { useFormItem, useNamespace, useSize } from '../../../hooks/index.js'
import { debugWarn, getComponentSize, isFunction, isNumber, isString, scrollIntoView } from '../../../utils/index.js'

export function useSelectStates(props) {
  return reactive({
    options: new Map(),
    cachedOptions: new Map(),
    createdLabel: null,
    createdSelected: false,
    selected: props.multiple ? [] : {},
    inputLength: 20,
    inputWidth: 0,
    optionsCount: 0,
    filteredOptionsCount: 0,
    visible: false,
    softFocus: false,
    selectedLabel: '',
    hoverIndex: -1,
    query: '',
    previousQuery: null,
    inputHovering: false,
    cachedPlaceHolder: '',
    currentPlaceholder: 'Выбрать',
    menuVisibleOnFocus: false,
    // isOnComposition: false,
    isSilentBlur: false,
    prefixWidth: 11,
    tagInMultiLine: false,
    mouseEnter: false,
  })
}

/**
 * @typedef {ReturnType<typeof useSelectStates>} States
 */

/**
 * @param {States} states
 */
export const useSelect = (props, states, ctx) => {
  const ns = useNamespace('select')

  /**
   * @type {import('vue').Ref<import('vue').ComponentPublicInstance<{
   *  focus: () => void
   *  blur: () => void
   *  input: HTMLInputElement
   *  }>> | null
   * }
   */
  const referenceRef = ref(null)

  /** @type {import('vue').Ref<HTMLInputElement | null>} */
  const inputRef = ref(null)
  /** @type {import('vue').Ref<InstanceType<typeof import('../../tooltip/src/NTooltip.jsx').NTooltip> | null>} */
  const tooltipRef = ref(null)
  /** @type {import('vue').Ref<HTMLInputElement | null>} */
  const tagsRef = ref(null)
  /** @type {import('vue').Ref<HTMLInputElement | null>} */
  const selectWrapperRef = ref(null)
  /**
   * @type {import('vue').Ref<{
   *  handleScroll: () => void
   * }> | null}
   */
  const scrollbarRef = ref(null)
  // TODO:
  const hoverOption = ref(null)
  /** @type {import('vue').ShallowRef<import('../../../tokens/select.js').QueryChangeCtx>} */
  const queryChange = shallowRef({ query: '' })
  const groupQueryChange = shallowRef('')

  const { form, formItem } = useFormItem()

  const readonly = computed(() => !props.filterable || props.multiple || !states.visible)

  const selectDisabled = computed(() => Boolean(props.disabled) || Boolean(form?.disabled))

  const showClose = computed(() => {
    const hasValue = props.multiple
      ? Array.isArray(props.modelValue) && props.modelValue.length > 0
      : props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''

    const criteria = props.clearable && !selectDisabled.value && states.inputHovering && hasValue

    return criteria
  })

  const iconComponent = computed(() =>
    props.remote && props.filterable && !props.remoteShowSuffix ? '' : props.suffixIcon,
  )

  const iconReverse = computed(() => iconComponent.value && states.visible)

  const debounce = computed(() => (props.remote ? 300 : 0))

  const emptyText = computed(() => {
    if (props.loading) {
      return props.loadingText || 'Загрузка'
    }

    if (props.remote && states.query === '' && states.options.size === 0) {
      return false
    }

    if (props.filterable && states.query && states.options.size > 0 && states.filteredOptionsCount === 0) {
      return props.noMatchText || 'Совпадений не найдено'
    }

    if (states.options.size === 0) {
      return props.noDataText || 'Нет данных'
    }

    return null
  })

  const optionsArray = computed(() => [...states.options.values()])

  const cachedOptionsArray = computed(() => [...states.cachedOptions.values()])

  const showNewOption = computed(() => {
    const hasExistingOption = optionsArray.value
      .filter((option) => !option.created)
      .some((option) => option.currentLabel === states.query)

    return props.filterable && props.allowCreate && states.query !== '' && !hasExistingOption
  })

  const selectSize = useSize()

  const collapseTagSize = computed(() => (['small'].includes(selectSize.value) ? 'small' : 'default'))

  const dropMenuVisible = computed({
    get() {
      return states.visible && emptyText.value !== false
    },
    set(val) {
      states.visible = val
    },
  })

  // watch
  watch([() => selectDisabled.value, () => selectSize.value, () => form?.size], () => {
    nextTick(() => {
      resetInputHeight()
    })
  })

  watch(
    () => props.placeholder,
    (val) => {
      states.currentPlaceholder = val
      states.cachedPlaceHolder = val
    },
  )

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (props.multiple) {
        resetInputHeight()

        // eslint-disable-next-line unicorn/prefer-ternary
        if ((val && val.length > 0) || (inputRef.value && states.query !== '')) {
          states.currentPlaceholder = ''
        } else {
          states.currentPlaceholder = states.cachedPlaceHolder
        }

        if (props.filterable && !props.reserveKeyword) {
          states.query = ''
          handleQueryChange(states.query)
        }
      }

      setSelected()

      if (props.filterable && !props.multiple) {
        states.inputLength = 20
      }

      if (!isEqual(val, oldVal) && props.validateEvent) {
        formItem?.validate('change').catch((error) => debugWarn(error))
      }
    },
    {
      flush: 'post',
      deep: true,
    },
  )

  watch(
    () => states.visible,
    (val) => {
      if (!val) {
        if (props.filterable) {
          if (isFunction(props.filterMethod)) {
            props.filterMethod('')
          }

          if (isFunction(props.remoteMethod)) {
            props.remoteMethod('')
          }
        }

        inputRef.value && inputRef.value.blur()
        states.query = ''
        states.previousQuery = null
        states.selectedLabel = ''
        states.inputLength = 20
        states.menuVisibleOnFocus = false
        resetHoverIndex()
        nextTick(() => {
          if (inputRef.value && inputRef.value.value === '' && states.selected.length === 0) {
            states.currentPlaceholder = states.cachedPlaceHolder
          }
        })

        if (!props.multiple) {
          if (states.selected) {
            // eslint-disable-next-line unicorn/prefer-ternary
            if (props.filterable && props.allowCreate && states.createdSelected && states.createdLabel) {
              states.selectedLabel = states.createdLabel
            } else {
              states.selectedLabel = states.selected.currentLabel
            }

            if (props.filterable) {
              states.query = states.selectedLabel
            }
          }

          if (props.filterable) {
            states.currentPlaceholder = states.cachedPlaceHolder
          }
        }
      } else {
        tooltipRef.value?.updatePopper?.()

        if (props.filterable) {
          states.filteredOptionsCount = states.optionsCount
          states.query = props.remote ? '' : states.selectedLabel

          if (props.multiple) {
            inputRef.value?.focus()
          } else if (states.selectedLabel) {
            states.currentPlaceholder = `${states.selectedLabel}`
            states.selectedLabel = ''
          }

          handleQueryChange(states.query)

          if (!props.multiple && !props.remote) {
            queryChange.value.query = ''

            triggerRef(queryChange)
            triggerRef(groupQueryChange)
          }
        }
      }

      ctx.emit('visible-change', val)
    },
  )

  watch(
    // fix `Array.prototype.push/splice/..` cannot trigger non-deep watcher
    // https://github.com/vuejs/vue-next/issues/2116
    () => states.options.entries(),
    () => {
      if (!isClient) {
        return
      }

      tooltipRef.value?.updatePopper?.()

      if (props.multiple) {
        resetInputHeight()
      }

      const inputs = selectWrapperRef.value?.querySelectorAll('input') || []

      // @ts-ignore
      if (![...inputs].includes(document.activeElement)) {
        setSelected()
      }

      if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
        checkDefaultFirstOption()
      }
    },
    {
      flush: 'post',
    },
  )

  watch(
    () => states.hoverIndex,
    (val) => {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (isNumber(val) && val > -1) {
        hoverOption.value = optionsArray.value[val] || {}
      } else {
        // TODO: Понять что происходит
        // @ts-ignore
        hoverOption.value = {}
      }

      optionsArray.value.forEach((option) => {
        option.hover = hoverOption.value === option
      })
    },
  )

  // methods
  function resetInputHeight() {
    if (props.collapseTags && !props.filterable) {
      return
    }

    nextTick(() => {
      if (!referenceRef.value) {
        return
      }

      const $input = referenceRef.value.$el.querySelector('input')

      const $tags = tagsRef.value
      const sizeInMap = getComponentSize(selectSize.value || form?.size)

      // it's an inner input so reduce it by 2px.
      $input.style.height = `${
        (states.selected.length === 0
          ? sizeInMap
          : Math.max($tags ? $tags.clientHeight + ($tags.clientHeight > sizeInMap ? 6 : 0) : 0, sizeInMap)) - 2
      }px`

      states.tagInMultiLine = Number.parseFloat($input.style.height) >= sizeInMap

      if (states.visible && emptyText.value !== false) {
        tooltipRef.value?.updatePopper?.()
      }
    })
  }

  async function handleQueryChange(val) {
    if (states.previousQuery === val) {
      return
    }

    if (states.previousQuery === null && (isFunction(props.filterMethod) || isFunction(props.remoteMethod))) {
      states.previousQuery = val

      return
    }

    states.previousQuery = val

    nextTick(() => {
      if (states.visible) {
        tooltipRef.value?.updatePopper?.()
      }
    })

    states.hoverIndex = -1

    if (props.multiple && props.filterable) {
      nextTick(() => {
        const length = inputRef.value.value.length * 15 + 20

        states.inputLength = props.collapseTags ? Math.min(50, length) : length
        managePlaceholder()
        resetInputHeight()
      })
    }

    if (props.remote && isFunction(props.remoteMethod)) {
      states.hoverIndex = -1
      props.remoteMethod(val)
    } else if (isFunction(props.filterMethod)) {
      props.filterMethod(val)
      triggerRef(groupQueryChange)
    } else {
      states.filteredOptionsCount = states.optionsCount
      queryChange.value.query = val

      triggerRef(queryChange)
      triggerRef(groupQueryChange)
    }

    if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
      await nextTick()
      checkDefaultFirstOption()
    }
  }

  function managePlaceholder() {
    if (states.currentPlaceholder !== '') {
      states.currentPlaceholder = inputRef.value.value ? '' : states.cachedPlaceHolder
    }
  }

  /**
   * find and highlight first option as default selected
   * @remark
   * - if the first option in dropdown list is user-created,
   *   it would be at the end of the optionsArray
   *   so find it and set hover.
   *   (NOTE: there must be only one user-created option in dropdown list with query)
   * - if there's no user-created option in list, just find the first one as usual
   *   (NOTE: exclude options that are disabled or in disabled-group)
   */
  function checkDefaultFirstOption() {
    const optionsInDropdown = optionsArray.value.filter(
      (option) => option.visible && !option.disabled && !option.states.groupDisabled,
    )
    const userCreatedOption = optionsInDropdown.find((option) => option.created)
    const firstOriginOption = optionsInDropdown[0]

    states.hoverIndex = getValueIndex(optionsArray.value, userCreatedOption || firstOriginOption)
  }

  function setSelected() {
    if (!props.multiple) {
      const option = getOption(props.modelValue)

      if (option.props?.created) {
        states.createdLabel = option.props.value
        states.createdSelected = true
      } else {
        states.createdSelected = false
      }

      states.selectedLabel = option.currentLabel
      states.selected = option

      if (props.filterable) {
        states.query = states.selectedLabel
      }

      return
    }

    states.selectedLabel = ''

    const result = []

    if (Array.isArray(props.modelValue)) {
      props.modelValue.forEach((value) => {
        result.push(getOption(value))
      })
    }

    states.selected = result

    nextTick(() => {
      resetInputHeight()
    })
  }

  function getOption(val) {
    let option
    const isObjectValue = toRawType(val).toLowerCase() === 'object'
    const isNull = toRawType(val).toLowerCase() === 'null'
    const isUndefined = toRawType(val).toLowerCase() === 'undefined'

    for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
      const cachedOption = cachedOptionsArray.value[i]

      const isEqualValue = isObjectValue
        ? get(cachedOption.value, props.valueKey) === get(val, props.valueKey)
        : cachedOption.value === val

      if (isEqualValue) {
        option = {
          value: val,
          currentLabel: cachedOption.currentLabel,
          isDisabled: cachedOption.isDisabled,
        }
        break
      }
    }

    if (option) {
      return option
    }

    const label = isObjectValue ? val.label : !isNull && !isUndefined ? val : ''
    const newOption = {
      value: val,
      currentLabel: label,
    }

    if (props.multiple) {
      newOption.hitState = false
    }

    return newOption
  }

  function resetHoverIndex() {
    setTimeout(() => {
      // eslint-disable-next-line prefer-destructuring
      const valueKey = props.valueKey

      if (!props.multiple) {
        states.hoverIndex = optionsArray.value.findIndex((item) => getValueKey(item) === getValueKey(states.selected))
      } else if (states.selected.length > 0) {
        states.hoverIndex = Math.min.apply(
          null,
          states.selected.map((selected) =>
            optionsArray.value.findIndex((item) => get(item, valueKey) === get(selected, valueKey)),
          ),
        )
      } else {
        states.hoverIndex = -1
      }
    }, 300)
  }

  function handleResize() {
    resetInputWidth()
    tooltipRef.value?.updatePopper?.()

    if (props.multiple && !props.filterable) {
      resetInputHeight()
    }
  }

  function resetInputWidth() {
    states.inputWidth = referenceRef.value?.$el.getBoundingClientRect().width
  }

  function onInputChange() {
    if (props.filterable && states.query !== states.selectedLabel) {
      states.query = states.selectedLabel
      handleQueryChange(states.query)
    }
  }

  const debouncedOnInputChange = lodashDebounce(() => {
    onInputChange()
  }, debounce.value)

  const debouncedQueryChange = lodashDebounce((evt) => {
    handleQueryChange(evt.target.value)
  }, debounce.value)

  function emitChange(val) {
    if (!isEqual(props.modelValue, val)) {
      ctx.emit(CHANGE_EVENT, val)
    }
  }

  function deletePrevTag(evt) {
    if (evt.target.value.length <= 0 && !toggleLastOptionHitState()) {
      const value = [...props.modelValue]

      value.pop()
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
    }

    if (evt.target.value.length === 1 && props.modelValue.length === 0) {
      states.currentPlaceholder = states.cachedPlaceHolder
    }
  }

  function deleteTag(evt, tag) {
    const index = states.selected.indexOf(tag)

    if (index > -1 && !selectDisabled.value) {
      const value = [...props.modelValue]

      value.splice(index, 1)
      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)
      ctx.emit('remove-tag', tag.value)
    }

    evt.stopPropagation()
  }

  function deleteSelected(evt) {
    evt.stopPropagation()
    const value = props.multiple ? [] : ''

    if (!isString(value)) {
      // @ts-ignore
      for (const item of states.selected) {
        if (item.isDisabled) {
          value.push(item.value)
        }
      }
    }

    ctx.emit(UPDATE_MODEL_EVENT, value)
    emitChange(value)
    states.hoverIndex = -1
    states.visible = false
    ctx.emit('clear')
  }

  function handleOptionSelect(option, byClick) {
    if (props.multiple) {
      const value = [...(props.modelValue || [])]
      const optionIndex = getValueIndex(value, option.value)

      if (optionIndex > -1) {
        value.splice(optionIndex, 1)
      } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
        value.push(option.value)
      }

      ctx.emit(UPDATE_MODEL_EVENT, value)
      emitChange(value)

      if (option.created) {
        states.query = ''
        handleQueryChange('')
        states.inputLength = 20
      }

      if (props.filterable) {
        inputRef.value?.focus()
      }
    } else {
      ctx.emit(UPDATE_MODEL_EVENT, option.value)
      emitChange(option.value)
      states.visible = false
    }

    states.isSilentBlur = byClick
    setSoftFocus()

    if (states.visible) {
      return
    }

    nextTick(() => {
      scrollToOption(option)
    })
  }

  function getValueIndex(arr = [], value = undefined) {
    if (!isObject(value)) {
      return arr.indexOf(value)
    }

    const { valueKey } = props
    let index = -1

    arr.some((item, i) => {
      if (toRaw(get(item, valueKey)) === get(value, valueKey)) {
        index = i

        return true
      }

      return false
    })

    return index
  }

  function setSoftFocus() {
    states.softFocus = true
    const $input = inputRef.value || referenceRef.value

    if ($input) {
      $input?.focus()
    }
  }

  function scrollToOption(option) {
    const targetOption = Array.isArray(option) ? option[0] : option
    let target = null

    if (targetOption?.value) {
      const options = optionsArray.value.filter((item) => item.value === targetOption.value)

      if (options.length > 0) {
        target = options[0].$el
      }
    }

    if (tooltipRef.value && target) {
      const menu = tooltipRef.value?.popperRef?.contentRef?.querySelector?.(`.${ns.be('dropdown', 'wrap')}`)

      if (menu) {
        scrollIntoView(menu, target)
      }
    }

    scrollbarRef.value?.handleScroll()
  }

  function onOptionCreate(vm) {
    states.optionsCount += 1
    states.filteredOptionsCount += 1
    states.options.set(vm.value, vm)
    states.cachedOptions.set(vm.value, vm)
  }

  function onOptionDestroy(key, vm) {
    if (states.options.get(key) === vm) {
      states.optionsCount -= 1
      states.filteredOptionsCount -= 1
      states.options.delete(key)
    }
  }

  /**
   * @param {KeyboardEvent} evt
   */
  function resetInputState(evt) {
    if (evt.code !== EVENT_CODE.backspace) {
      toggleLastOptionHitState(false)
    }

    states.inputLength = inputRef.value.value.length * 15 + 20
    resetInputHeight()
  }

  /**
   * @param {boolean} [hit]
   */
  function toggleLastOptionHitState(hit) {
    if (!Array.isArray(states.selected)) {
      return
    }

    const option = states.selected.at(-1)

    if (!option) {
      return
    }

    if (hit === true || hit === false) {
      option.hitState = hit

      return hit
    }

    option.hitState = !option.hitState

    return option.hitState
  }

  // function handleComposition(event) {
  //   const text = event.target.value

  //   if (event.type === 'compositionend') {
  //     states.isOnComposition = false
  //     nextTick(() => handleQueryChange(text))
  //   } else {
  //     // const lastCharacter = text.at(-1) || ''
  //     // states.isOnComposition = !isKorean(lastCharacter)
  //   }
  // }

  function handleMenuEnter() {
    nextTick(() => scrollToOption(states.selected))
  }

  /**
   * @param {FocusEvent} evt
   */
  function handleFocus(evt) {
    if (!states.softFocus) {
      if (props.automaticDropdown || props.filterable) {
        if (props.filterable && !states.visible) {
          states.menuVisibleOnFocus = true
        }

        states.visible = true
      }

      ctx.emit('focus', evt)
    } else {
      states.softFocus = false
    }
  }

  function blur() {
    states.visible = false
    referenceRef.value?.blur()
  }

  /**
   * @param {FocusEvent} evt
   */
  function handleBlur(evt) {
    // https://github.com/ElemeFE/element/pull/10822
    nextTick(() => {
      if (states.isSilentBlur) {
        states.isSilentBlur = false
      } else {
        ctx.emit('blur', evt)
      }
    })
    states.softFocus = false
  }

  /**
   * @param {Event} evt
   */
  function handleClearClick(evt) {
    deleteSelected(evt)
  }

  function handleClose() {
    states.visible = false
  }

  /**
   * @param {KeyboardEvent} evt
   */
  function handleKeydownEscape(evt) {
    if (states.visible) {
      evt.preventDefault()
      evt.stopPropagation()
      states.visible = false
    }
  }

  /**
   * @param {PointerEvent} [evt]
   */
  function toggleMenu(evt) {
    if (evt && !states.mouseEnter) {
      return
    }

    if (!selectDisabled.value) {
      if (states.menuVisibleOnFocus) {
        states.menuVisibleOnFocus = false
      } else if (!tooltipRef.value || !tooltipRef.value.isFocusInsideContent()) {
        states.visible = !states.visible
      }

      if (states.visible) {
        ;(inputRef.value || referenceRef.value)?.focus()
      }
    }
  }

  function selectOption() {
    if (!states.visible) {
      toggleMenu()
    } else if (optionsArray.value[states.hoverIndex]) {
      handleOptionSelect(optionsArray.value[states.hoverIndex], undefined)
    }
  }

  function getValueKey(item) {
    return isObject(item.value) ? get(item.value, props.valueKey) : item.value
  }

  const optionsAllDisabled = computed(() =>
    optionsArray.value.filter((option) => option.visible).every((option) => option.disabled),
  )

  function navigateOptions(direction) {
    if (!states.visible) {
      states.visible = true

      return
    }

    if (states.options.size === 0 || states.filteredOptionsCount === 0) {
      return
    }

    if (optionsAllDisabled.value) {
      return
    }

    if (direction === 'next') {
      states.hoverIndex += 1

      if (states.hoverIndex === states.options.size) {
        states.hoverIndex = 0
      }
    } else if (direction === 'prev') {
      states.hoverIndex -= 1

      if (states.hoverIndex < 0) {
        states.hoverIndex = states.options.size - 1
      }
    }

    const option = optionsArray.value[states.hoverIndex]

    if (option.disabled === true || option.states.groupDisabled === true || !option.visible) {
      navigateOptions(direction)
    }

    nextTick(() => scrollToOption(hoverOption.value))
  }

  function handleMouseEnter() {
    states.mouseEnter = true
  }

  function handleMouseLeave() {
    states.mouseEnter = false
  }

  return {
    optionsArray,
    selectSize,
    handleResize,
    debouncedOnInputChange,
    debouncedQueryChange,
    deletePrevTag,
    deleteTag,
    deleteSelected,
    handleOptionSelect,
    scrollToOption,
    readonly,
    resetInputHeight,
    showClose,
    iconComponent,
    iconReverse,
    showNewOption,
    collapseTagSize,
    setSelected,
    managePlaceholder,
    selectDisabled,
    emptyText,
    toggleLastOptionHitState,
    resetInputState,
    // handleComposition,.
    onOptionCreate,
    onOptionDestroy,
    handleMenuEnter,
    handleFocus,
    blur,
    handleBlur,
    handleClearClick,
    handleClose,
    handleKeydownEscape,
    toggleMenu,
    selectOption,
    getValueKey,
    navigateOptions,
    dropMenuVisible,
    queryChange,
    groupQueryChange,

    // DOM ref
    referenceRef,
    inputRef,
    tooltipRef,
    tagsRef,
    selectWrapperRef,
    scrollbarRef,

    // Mouser Event
    handleMouseEnter,
    handleMouseLeave,
  }
}
