import { computed, toRaw } from 'vue'

import { stopAndPrevent } from '../../../utils/index.js'

export function useToggle(props, emit) {
  const modelIsArray = computed(() => props.val !== undefined && Array.isArray(props.modelValue))

  const index = computed(() => {
    const val = toRaw(props.val)

    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1
  })

  const isTrue = computed(() =>
    modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue),
  )

  const isFalse = computed(() =>
    modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue),
  )

  const isIndeterminate = computed(() => isTrue.value === false && isFalse.value === false)

  const tabindex = computed(() => (props.disabled === true ? -1 : props.tabindex))

  const formAttrs = computed(() => {
    const prop = {
      type: 'checkbox',
      tabindex: -1,
      disabled: props.disabled,
    }

    props.name !== undefined &&
      Object.assign(prop, {
        '^checked': isTrue.value === true ? 'checked' : undefined,
        name: props.name,
        value: modelIsArray.value === true ? props.val : props.trueValue,
      })

    return prop
  })

  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: 'switch',
      ariaLabel: props.label,
      ariaChecked: isIndeterminate.value === true ? 'mixed' : isTrue.value === true ? 'true' : 'false',
    }

    if (props.disabled === true) {
      attrs['aria-disabled'] = 'true'
    }

    return attrs
  })

  function getNextValue() {
    if (modelIsArray.value === true) {
      if (isTrue.value === true) {
        const val = [...props.modelValue]

        val.splice(index.value, 1)

        return val
      }

      return [...props.modelValue, props.val]
    }

    if (isTrue.value === true) {
      if (props.toggleOrder !== 'ft' || props.toggleIndeterminate === false) {
        return props.falseValue
      }
    } else if (isFalse.value === true) {
      if (props.toggleOrder === 'ft' || props.toggleIndeterminate === false) {
        return props.trueValue
      }
    } else {
      return props.toggleOrder !== 'ft' ? props.trueValue : props.falseValue
    }

    return props.indeterminateValue
  }

  /**
   * @param {any} evt
   */
  function handleClick(evt) {
    if (evt !== undefined) {
      stopAndPrevent(evt)
      // refocusTarget(event)
    }

    if (props.disabled !== true) {
      emit('update:modelValue', getNextValue(), evt)
    }
  }

  /**
   * @param {KeyboardEvent} evt
   */
  function handleKeydown(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      stopAndPrevent(evt)
    }
  }

  /**
   * @param {KeyboardEvent} evt
   */
  function handleKeyup(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      handleClick(evt)
    }
  }

  return {
    formAttrs,
    isTrue,
    isFalse,
    isIndeterminate,
    attributes,
    getNextValue,
    handleKeydown,
    handleKeyup,
  }
}
