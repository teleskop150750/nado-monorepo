import { computed, ref } from 'vue'

import { useFormInject } from '../../../composables/private/useForm.js'
import { useDisabled, useNamespace } from '../../../hooks/index.js'
import { hMergeSlot, hSlot, stopAndPrevent } from '../../../utils/index.js'
import { useCheckboxStatus } from './composables/useCheckboxStatus.js'

/**
 * @param {string} type
 * @param {import('vue').ExtractPropTypes<typeof import('./checkboxProps.js').checkboxProps>} props
 */
export function useCheckbox(type, props, { slots, emit, expose }, getInner) {
  const ns = useNamespace(type)
  const disabled = useDisabled()

  const rootRef = ref(null)

  const { isTrue, isFalse, isIndeterminate, index, modelIsArray } = useCheckboxStatus(props)

  const tabindex = computed(() => (disabled.value === true ? -1 : props.tabindex))

  const classes = computed(() => [ns.b(), ns.is('disabled', disabled.value), ns.is('reverse', props.leftLabel)])

  const innerClass = computed(() => {
    const state = isTrue.value === true ? 'truthy' : isFalse.value === true ? 'falsy' : 'indet'

    return [ns.e('inner'), ns.em('inner', state)]
  })

  const formAttrs = computed(() => {
    const prop = {
      type: 'checkbox',
    }

    props.name !== undefined &&
      Object.assign(prop, {
        '^checked': isTrue.value === true ? 'checked' : undefined,
        name: props.name,
        value: modelIsArray.value === true ? props.val : props.trueValue,
      })

    return prop
  })

  const injectFormInput = useFormInject(formAttrs)

  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: type === 'toggle' ? 'switch' : 'checkbox',
      ariaLabel: props.ariaLabel || props.label,
      ariaChecked: isIndeterminate.value === true ? 'mixed' : isTrue.value === true ? 'true' : 'false',
    }

    if (disabled.value === true) {
      attrs.ariaDisabled = 'true'
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
   * @param {Event} evt
   */
  function handleClick(evt) {
    if (evt !== undefined) {
      stopAndPrevent(evt)
      // refocusTarget(event)
    }

    if (disabled.value !== true) {
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

  const getInnerContent = getInner()

  // Expose public methods
  expose({
    toggle: handleClick,
    ref: rootRef,
  })

  return () => {
    const inner = getInnerContent()

    disabled.value !== true && injectFormInput(inner, 'unshift', ns.e('native'))

    const child = [
      <div class={innerClass.value} aria-hidden={true}>
        {inner}
      </div>,
    ]

    const label = props.label ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default)

    Boolean(label) && child.push(<div class={ns.e('label')}>{label}</div>)

    return (
      <div
        ref={rootRef}
        class={classes.value}
        {...attributes.value}
        onClick={handleClick}
        onKeydown={handleKeydown}
        onKeyup={handleKeyup}
      >
        {child}
      </div>
    )
  }
}
