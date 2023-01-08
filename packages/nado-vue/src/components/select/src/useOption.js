import { get } from 'lodash-unified'
import { computed, inject, toRaw, unref, watch } from 'vue'

import { getCurrentInstance } from '../../../hooks/index.js'
import { selectGroupKey, selectKey } from '../../../tokens/index.js'
import { escapeStringRegexp } from '../../../utils/index.js'

/**
 * @param {import('./optionProps.js').OptionProps} props
 * @param {import('./useOption.js').OptionStates} states
 */
export function useOption(props, states) {
  // inject
  const select = inject(selectKey)
  const selectGroup = inject(selectGroupKey, { disabled: false })

  // computed
  // TODO [object object]
  const isObject = computed(() => Object.prototype.toString.call(props.value).toLowerCase() === '[object object]')

  const itemSelected = computed(() => {
    if (!select.props.multiple) {
      return isEqual(props.value, select.props.modelValue)
    }

    // @ts-ignore
    return contains(select.props.modelValue, props.value)
  })

  const limitReached = computed(() => {
    if (select.props.multiple) {
      const modelValue = select.props.modelValue || []

      // @ts-ignore
      return !itemSelected.value && modelValue.length >= select.props.multipleLimit && select.props.multipleLimit > 0
    }

    return false
  })

  const currentLabel = computed(() => props.label || (isObject.value ? '' : props.value))

  const currentValue = computed(() => props.value || props.label || '')

  const isDisabled = computed(() => props.disabled || states.groupDisabled || limitReached.value)

  const instance = getCurrentInstance('useOption')

  function contains(arr = [], target = undefined) {
    if (!isObject.value) {
      return arr && arr.includes(target)
    }

    const { valueKey } = select.props

    return arr && arr.some((item) => toRaw(get(item, valueKey)) === get(target, valueKey))
  }

  function isEqual(a, b) {
    if (!isObject.value) {
      return a === b
    }

    const { valueKey } = select.props

    return get(a, valueKey) === get(b, valueKey)
  }

  const hoverItem = () => {
    if (!props.disabled && !selectGroup.disabled) {
      select.hoverIndex = select.optionsArray.indexOf(instance.proxy)
    }
  }

  watch(
    () => currentLabel.value,
    () => {
      if (!props.created && !select.props.remote) {
        select.setSelected()
      }
    },
  )

  watch(
    () => props.value,
    (val, oldVal) => {
      const { remote, valueKey } = select.props

      if (!Object.is(val, oldVal)) {
        // @ts-ignore
        select.onOptionDestroy(oldVal, instance.proxy)
        // @ts-ignore
        select.onOptionCreate(instance.proxy)
      }

      if (!props.created && !remote) {
        if (valueKey && typeof val === 'object' && typeof oldVal === 'object' && val[valueKey] === oldVal[valueKey]) {
          return
        }

        select.setSelected()
      }
    },
  )

  watch(
    () => selectGroup.disabled,
    () => {
      states.groupDisabled = selectGroup.disabled
    },
    { immediate: true },
  )

  const { queryChange } = toRaw(select)

  watch(queryChange, (changes) => {
    const { query } = unref(changes)

    // @ts-ignore
    const regexp = new RegExp(escapeStringRegexp(query), 'i')

    states.visible = regexp.test(currentLabel.value) || props.created

    if (!states.visible) {
      select.filteredOptionsCount -= 1
    }
  })

  return {
    select,
    currentLabel,
    currentValue,
    itemSelected,
    isDisabled,
    hoverItem,
  }
}
