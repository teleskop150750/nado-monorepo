import { onClickOutside } from '@vueuse/core'
import { computed, inject, onBeforeUnmount, ref, Transition, unref, watch } from 'vue'

import { TOOLTIP_INJECTION_KEY } from '../../../tokens/index.js'
import { composeEventHandlers, createComponent, hSlot } from '../../../utils/index.js'
import { NPopperContent } from '../../popper/index.js'
import { NPortal } from '../../portal/index.js'
import { useTooltipContentProps } from './tooltipContentProps.js'

export const NTooltipContent = createComponent({
  name: 'NTooltipContent',
  inheritAttrs: false,
  props: useTooltipContentProps,
  setup(props, { slots, expose, attrs }) {
    const contentRef = ref(null)
    const destroyed = ref(false)

    const { controlled, id, open, trigger, onClose, onOpen, onShow, onHide, onBeforeShow, onBeforeHide } =
      inject(TOOLTIP_INJECTION_KEY)

    const persistentRef = computed(() => {
      // For testing, we would always want the content to be rendered
      // to the DOM, so we need to return true here.
      // @ts-ignore
      if (process.env.NODE_ENV === 'test') {
        return true
      }

      return props.persistent
    })

    onBeforeUnmount(() => {
      destroyed.value = true
    })

    const shouldRender = computed(() => (unref(persistentRef) ? true : unref(open)))

    const shouldShow = computed(() => (props.disabled ? false : unref(open)))

    const contentStyle = computed(() => props.style ?? {})

    const ariaHidden = computed(() => !unref(open))

    function handleTransitionLeave() {
      onHide()
    }

    function stopWhenControlled() {
      if (unref(controlled)) {
        return true
      }
    }

    const handleContentEnter = composeEventHandlers(stopWhenControlled, () => {
      if (props.enterable && unref(trigger) === 'hover') {
        onOpen()
      }
    })

    const handleContentLeave = composeEventHandlers(stopWhenControlled, () => {
      if (unref(trigger) === 'hover') {
        onClose()
      }
    })

    function handleBeforeEnter() {
      contentRef.value?.updatePopper?.()
      onBeforeShow?.()
    }

    function handleBeforeLeave() {
      onBeforeHide?.()
    }

    let stopHandle

    function handleAfterShow() {
      onShow()
      stopHandle = onClickOutside(
        computed(() => contentRef.value?.popperContentRef),
        () => {
          if (unref(controlled)) {
            return
          }

          const $trigger = unref(trigger)

          if ($trigger !== 'hover') {
            onClose()
          }
        },
      )
    }

    function handleBlur() {
      if (!props.virtualTriggering) {
        onClose()
      }
    }

    watch(
      () => unref(open),
      (val) => {
        if (!val) {
          stopHandle?.()
        }
      },
      {
        flush: 'post',
      },
    )

    watch(
      () => props.content,
      () => {
        contentRef.value?.updatePopper?.()
      },
    )

    expose({
      /**
       * @description el-popper-content component instance
       */
      contentRef,
    })

    return () => (
      <NPortal disabled={!props.teleported} to={props.appendTo}>
        <Transition
          name={props.transition}
          onAfterLeave={handleTransitionLeave}
          onBeforeEnter={handleBeforeEnter}
          onAfterEnter={handleAfterShow}
          onBeforeLeave={handleBeforeLeave}
        >
          {shouldRender.value && (
            <NPopperContent
              v-show={shouldShow.value}
              id={id.value}
              ref={contentRef}
              {...attrs}
              aria-label={props.ariaLabel}
              aria-hidden={ariaHidden.value}
              boundaries-padding={props.boundariesPadding}
              fallback-placements={props.fallbackPlacements}
              gpu-acceleration={props.gpuAcceleration}
              offset={props.offset}
              placement={props.placement}
              popper-options={props.popperOptions}
              strategy={props.strategy}
              effect={props.effect}
              enterable={props.enterable}
              pure={props.pure}
              popper-class={props.popperClass}
              popper-style={[props.popperStyle, contentStyle.value]}
              reference-el={props.referenceEl}
              trigger-target-el={props.triggerTargetEl}
              visible={shouldShow.value}
              z-index={props.zIndex}
              onMouseenter={handleContentEnter}
              onMouseleave={handleContentLeave}
              onBlur={handleBlur}
              onClose={onClose}
            >
              {!destroyed.value && hSlot(slots.default)}
            </NPopperContent>
          )}
        </Transition>
      </NPortal>
    )
  },
})
