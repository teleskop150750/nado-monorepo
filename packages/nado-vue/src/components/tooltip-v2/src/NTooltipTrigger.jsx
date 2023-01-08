import { inject, onBeforeUnmount, watch } from 'vue'

import { tooltipV2RootKey } from '../../../tokens/index.js'
import { composeEventHandlers, createComponent, hSlot } from '../../../utils/index.js'
import { tooltipCommonProps } from './common.js'
import { NTooltipForwardRef } from './NTooltipForwardRef.jsx'
import { tooltipTriggerProps } from './triggerProps.js'

export const NTooltipTrigger = createComponent({
  name: 'NTooltipTrigger',
  props: {
    ...tooltipCommonProps,
    ...tooltipTriggerProps,
  },
  setup(props, { slots, attrs }) {
    /**
     * onOpen мгновенно открывает всплывающую подсказку, onTrigger действует немного иначе,
     * он проверит, установлено ли значение delayDuration больше 0, и на основе этого результата,
     * если true, всплывающая подсказка открывается после delayDuration, в противном случае она открывается мгновенно.
     */
    const { onClose, onOpen, onDelayOpen, triggerRef, contentId } = inject(tooltipV2RootKey)
    let isMousedown = false

    /**
     * @param {HTMLElement|null} el
     */
    const setTriggerRef = (el = null) => {
      triggerRef.value = el
    }

    const handleMouseup = () => {
      isMousedown = false
    }

    // @ts-ignore
    const handleMouseenter = composeEventHandlers(props.onMouseEnter, onDelayOpen)

    // @ts-ignore
    const handleMouseleave = composeEventHandlers(props.onMouseLeave, onClose)

    // @ts-ignore
    const handleMousedown = composeEventHandlers(props.onMouseDown, () => {
      onClose()
      isMousedown = true
      document.addEventListener('mouseup', handleMouseup, { once: true })
    })

    // @ts-ignore
    const handleFocus = composeEventHandlers(props.onFocus, () => {
      if (!isMousedown) {
        onOpen()
      }
    })

    // @ts-ignore
    const handleBlur = composeEventHandlers(props.onBlur, onClose)

    // @ts-ignore
    const handleClick = composeEventHandlers(props.onClick, (evt) => {
      // @ts-ignore
      if (evt.detail === 0) {
        onClose()
      }
    })

    const events = {
      blur: handleBlur,
      click: handleClick,
      focus: handleFocus,
      mousedown: handleMousedown,
      mouseenter: handleMouseenter,
      mouseleave: handleMouseleave,
    }

    /**
     * @param {HTMLElement|null|undefined} el
     * @param {Record<string, EventListenerOrEventListenerObject>} eventList
     * @param {'addEventListener' | 'removeEventListener'} type
     */
    const setEvents = (el, eventList, type) => {
      if (el) {
        Object.entries(eventList).forEach(([name, handler]) => {
          el[type](name, handler)
        })
      }
    }

    watch(triggerRef, (triggerEl, previousTriggerEl) => {
      // @ts-ignore
      setEvents(triggerEl, events, 'addEventListener')
      // @ts-ignore
      setEvents(previousTriggerEl, events, 'removeEventListener')

      if (triggerEl) {
        triggerEl.setAttribute('aria-describedby', contentId.value)
      }
    })

    onBeforeUnmount(() => {
      setEvents(triggerRef.value, events, 'removeEventListener')
      document.removeEventListener('mouseup', handleMouseup)
    })

    return () =>
      props.nowrap ? (
        <NTooltipForwardRef setRef={setTriggerRef} onlyChild>
          {hSlot(slots.default)}
        </NTooltipForwardRef>
      ) : (
        <button ref={triggerRef} {...attrs}>
          {hSlot(slots.default)}
        </button>
      )
  },
})
