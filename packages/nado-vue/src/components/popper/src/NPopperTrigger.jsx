import { unrefElement } from '@vueuse/core'
import { isElement, isNil } from 'lodash-unified'
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'

import { useForwardRef } from '../../../hooks/index.js'
import { POPPER_INJECTION_KEY } from '../../../tokens/index.js'
import { createComponent, hSlot } from '../../../utils/index.js'
import { NOnlyChild } from '../../only-child/index.js'
import { popperTriggerProps } from './popperTriggerProps.js'

export const NPopperTrigger = createComponent({
  name: 'NPopperTrigger',
  inheritAttrs: false,
  props: popperTriggerProps,
  setup(props, { slots, expose, attrs }) {
    const { role, triggerRef } = inject(POPPER_INJECTION_KEY)

    useForwardRef(triggerRef)
    const ariaDescribedby = computed(() => {
      if (role && role.value === 'tooltip') {
        return props.open && props.id ? props.id : undefined
      }

      return null
    })

    const ariaHaspopup = computed(() => {
      if (role && role.value !== 'tooltip') {
        return role.value
      }

      return null
    })

    const ariaControls = computed(() => (ariaHaspopup.value ? props.id : undefined))
    const ariaExpanded = computed(() => (ariaHaspopup.value ? `${props.open}` : undefined))

    let virtualTriggerAriaStopWatch

    onMounted(() => {
      watch(
        () => props.virtualRef,
        (virtualEl) => {
          if (virtualEl) {
            // @ts-ignore
            triggerRef.value = unrefElement(virtualEl)
          }
        },
        {
          immediate: true,
        },
      )

      watch(
        triggerRef,
        (element, prevEl) => {
          virtualTriggerAriaStopWatch?.()
          virtualTriggerAriaStopWatch = undefined

          if (isElement(element)) {
            ;['onMouseenter', 'onMouseleave', 'onClick', 'onKeydown', 'onFocus', 'onBlur', 'onContextmenu'].forEach(
              (eventName) => {
                const handler = props[eventName]

                if (handler) {
                  // @ts-ignore
                  element.addEventListener(eventName.slice(2).toLowerCase(), handler)
                  // @ts-ignore
                  prevEl?.removeEventListener?.(eventName.slice(2).toLowerCase(), handler)
                }
              },
            )
            virtualTriggerAriaStopWatch = watch(
              [ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded],
              (watches) => {
                ;['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach((key, idx) => {
                  // @ts-ignore
                  isNil(watches[idx]) ? element.removeAttribute(key) : element.setAttribute(key, watches[idx])
                })
              },
              { immediate: true },
            )
          }

          if (isElement(prevEl)) {
            ;['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach((key) =>
              // @ts-ignore
              prevEl.removeAttribute(key),
            )
          }
        },
        {
          immediate: true,
        },
      )
    })

    onBeforeUnmount(() => {
      virtualTriggerAriaStopWatch?.()
      virtualTriggerAriaStopWatch = undefined
    })

    expose({
      /**
       * @description trigger element
       */
      triggerRef,
    })

    return () =>
      !props.virtualTriggering && (
        <NOnlyChild
          {...attrs}
          aria-controls={ariaControls.value}
          aria-describedby={ariaDescribedby.value}
          aria-expanded={ariaExpanded.value}
          aria-haspopup={ariaHaspopup.value}
        >
          {hSlot(slots.default)}
        </NOnlyChild>
      )
  },
})
