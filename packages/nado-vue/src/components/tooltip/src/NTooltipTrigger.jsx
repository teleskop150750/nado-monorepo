import { inject, ref, toRef, unref } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { TOOLTIP_INJECTION_KEY } from '../../../tokens/index.js'
import { composeEventHandlers, createComponent, hSlot } from '../../../utils/index.js'
import { NPopperTrigger } from '../../popper/index.js'
import { useTooltipTriggerProps } from './tooltipTriggerProps.js'
import { whenTrigger } from './utils.js'

export const NTooltipTrigger = createComponent({
  name: 'NTooltipTrigger',
  props: useTooltipTriggerProps,
  setup(props, { slots, expose }) {
    const ns = useNamespace('tooltip')
    const { controlled, id, open, onOpen, onClose, onToggle } = inject(TOOLTIP_INJECTION_KEY)
    // TODO any is temporary, replace with `OnlyChildExpose | null` later
    const triggerRef = ref(null)

    const stopWhenControlledOrDisabled = () => {
      if (unref(controlled) || props.disabled) {
        return true
      }
    }
    const trigger = toRef(props, 'trigger')

    const handleMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, 'hover', onOpen))

    const handleMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, 'hover', onClose))

    const handleClick = composeEventHandlers(
      stopWhenControlledOrDisabled,
      whenTrigger(trigger, 'click', (/** @type {MouseEvent} */ evt) => {
        // различать щелчок левой кнопкой мыши
        if (evt.button === 0) {
          onToggle(evt)
        }
      }),
    )

    const handleFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, 'focus', onOpen))

    const handleBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, 'focus', onClose))

    const handleContextmenu = composeEventHandlers(
      stopWhenControlledOrDisabled,
      whenTrigger(trigger, 'contextmenu', (/** @type {Event} */ evt) => {
        evt.preventDefault()
        onToggle(evt)
      }),
    )

    const handleKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (/** @type {KeyboardEvent} */ evt) => {
      const { code } = evt

      if (props.triggerKeys.includes(code)) {
        evt.preventDefault()
        onToggle(evt)
      }
    })

    expose({
      /**
       * @description trigger element
       */
      triggerRef,
    })

    return () => (
      <NPopperTrigger
        id={id.value}
        virtual-ref={props.virtualRef}
        open={open.value}
        virtual-triggering={props.virtualTriggering}
        class={ns.e('trigger')}
        onBlur={handleBlur}
        onClick={handleClick}
        onContextmenu={handleContextmenu}
        onFocus={handleFocus}
        onMouseenter={handleMouseenter}
        onMouseleave={handleMouseleave}
        onKeydown={handleKeydown}
      >
        {hSlot(slots.default)}
      </NPopperTrigger>
    )
  },
})
