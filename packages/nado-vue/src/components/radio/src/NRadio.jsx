import { computed, nextTick, ref, toRaw } from 'vue'

import { useDisabled, useNamespace } from '../../../hooks/index.js'
import { createComponent, hMergeSlot, hSlot, stop } from '../../../utils/index.js'
import { radioProps } from './radioProps.js'

export const NRadio = createComponent({
  name: 'NRadio',
  props: radioProps,
  emits: ['update:modelValue'],
  setup(props, { slots, emit, expose }) {
    const ns = useNamespace('radio')
    const disabled = useDisabled()
    const rootRef = ref(null)
    const inputRef = ref(null)
    const focus = ref(false)

    const isTrue = computed(() => toRaw(props.modelValue) === toRaw(props.val))

    const containerClasses = computed(() => [
      ns.b(),
      ns.is('disabled', disabled.value),
      ns.is('focused', focus.value),
      ns.is('reverse', props.leftLabel),
    ])

    const innerClass = computed(() => {
      const state = isTrue.value === true ? 'truthy' : 'falsy'

      return [ns.e('inner'), ns.em('inner', state)]
    })

    const tabindex = computed(() => (disabled.value ? -1 : props.tabindex || 0))

    const formAttrs = computed(() => {
      const prop = {
        type: 'radio',
        tabindex: tabindex.value,
        disabled: disabled.value,
        class: [ns.e('native')],
      }

      props.name !== undefined &&
        Object.assign(prop, {
          checked: isTrue.value === true ? 'checked' : undefined,
          name: props.name,
          value: props.val,
        })

      return prop
    })

    /**
     * @param {MouseEvent} evt
     */
    function handleClick(evt) {
      if (evt !== undefined) {
        stop(evt)
      }

      if (disabled.value !== true) {
        inputRef.value.focus()
        emit('update:modelValue', props.val, evt)
      }
    }

    /**
     * @param {Event} evt
     */
    function handleChange(evt) {
      if (disabled.value !== true && isTrue.value !== true) {
        nextTick(() => emit('update:modelValue', props.val, evt))
      }
    }

    function handleFocus() {
      focus.value = true
    }

    function handleBlur() {
      focus.value = false
    }

    // expose public methods
    // Object.assign(proxy, { set: handleClick })
    expose({
      set: handleClick,
    })

    return () => {
      const label = props.label ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default)

      return (
        <div ref={rootRef} class={containerClasses.value} onClick={handleClick}>
          <div class={innerClass.value}>
            <input
              key="radio"
              {...formAttrs.value}
              ref={inputRef}
              onChange={handleChange}
              onKeyup={handleFocus}
              // onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <svg
              class={ns.e('icon')}
              width={21}
              height={21}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" stroke="currentColor" />
              <circle class={ns.e('check')} cx="10" cy="10" r="4.6" fill="currentColor" />
            </svg>
          </div>
          {Boolean(label) && <div class={ns.e('label')}>{label}</div>}
        </div>
      )
    }
  },
})
