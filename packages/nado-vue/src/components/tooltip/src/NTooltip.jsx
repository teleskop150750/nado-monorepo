import { computed, onDeactivated, provide, readonly, ref, toRef, unref, watch } from 'vue'

import { useDelayedToggle, useId, usePopperContainer } from '../../../hooks/index.js'
import { TOOLTIP_INJECTION_KEY } from '../../../tokens/index.js'
import { createComponent, hSlot, isBoolean } from '../../../utils/index.js'
import { NPopper, NPopperArrow } from '../../popper/index.js'
import { NTooltipContent } from './NTooltipContent.jsx'
import { NTooltipTrigger } from './NTooltipTrigger.jsx'
import { tooltipEmits, useTooltipModelToggle, useTooltipProps } from './tooltipProps.js'

const COMPONENT_NAME = 'NTooltip'

export const NTooltip = createComponent({
  name: COMPONENT_NAME,
  props: useTooltipProps,
  emits: tooltipEmits,
  setup(props, { slots, emit, expose }) {
    usePopperContainer()
    const compatShowAfter = computed(() => props.showAfter)

    const compatShowArrow = computed(() => props.showArrow)

    const id = useId()
    // TODO any is temporary, replace with `InstanceType<typeof NPopper> | null` later
    const popperRef = ref()
    // TODO any is temporary, replace with `InstanceType<typeof NTooltipContent> | null` later
    const contentRef = ref()

    const updatePopper = () => {
      const popperComponent = unref(popperRef)

      if (popperComponent) {
        popperComponent.popperInstanceRef?.update()
      }
    }
    const open = ref(false)
    const toggleReason = ref()

    const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
      indicator: open,
      toggleReason,
    })

    const { onOpen, onClose } = useDelayedToggle({
      showAfter: compatShowAfter,
      hideAfter: toRef(props, 'hideAfter'),
      open: show,
      close: hide,
    })

    const controlled = computed(() => isBoolean(props.visible) && !hasUpdateHandler.value)

    provide(TOOLTIP_INJECTION_KEY, {
      controlled,
      id,
      open: readonly(open),
      trigger: toRef(props, 'trigger'),
      /**
       * @param {?Event} evt
       */
      onOpen: (evt) => {
        onOpen(evt)
      },
      /**
       * @param {?Event} evt
       */
      onClose: (evt) => {
        onClose(evt)
      },
      /**
       * @param {?Event} evt
       */
      onToggle: (evt) => {
        if (unref(open)) {
          onClose(evt)
        } else {
          onOpen(evt)
        }
      },
      onShow: () => {
        emit('show', toggleReason.value)
      },
      onHide: () => {
        emit('hide', toggleReason.value)
      },
      onBeforeShow: () => {
        emit('before-show', toggleReason.value)
      },
      onBeforeHide: () => {
        emit('before-hide', toggleReason.value)
      },
      updatePopper,
    })

    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled && open.value) {
          open.value = false
        }
      },
    )

    const isFocusInsideContent = () => {
      const popperContent = contentRef.value?.contentRef?.popperContentRef

      return popperContent && popperContent.contains(document.activeElement)
    }

    onDeactivated(() => open.value && hide())

    expose({
      /**
       * @description el-popper component instance
       */
      popperRef,
      /**
       * @description el-tooltip-content component instance
       */
      contentRef,
      /**
       * @description validate current focus event is trigger inside el-tooltip-content
       */
      isFocusInsideContent,
      /**
       * @description update el-popper component instance
       */
      updatePopper,
      /**
       * @description expose onOpen function to mange el-tooltip open state
       */
      onOpen,
      /**
       * @description expose onOpen function to mange el-tooltip open state
       */
      onClose,
      /**
       * @description expose hide function
       */
      hide,
    })

    return () => (
      <NPopper ref={popperRef} role={props.role}>
        <NTooltipTrigger
          disabled={props.disabled}
          trigger={props.trigger}
          trigger-keys={props.triggerKeys}
          virtual-ref={props.virtualRef}
          virtual-triggering={props.virtualTriggering}
        >
          {hSlot(slots.default)}
        </NTooltipTrigger>
        <NTooltipContent
          ref={contentRef}
          aria-label={props.ariaLabel}
          boundaries-padding={props.boundariesPadding}
          content={props.content}
          disabled={props.disabled}
          effect={props.effect}
          enterable={props.enterable}
          fallback-placements={props.fallbackPlacements}
          hide-after={props.hideAfter}
          gpu-acceleration={props.gpuAcceleration}
          offset={props.offset}
          persistent={props.persistent}
          popper-class={props.popperClass}
          popper-style={props.popperStyle}
          placement={props.placement}
          popper-options={props.popperOptions}
          pure={props.pure}
          raw-content={props.rawContent}
          reference-el={props.referenceEl}
          trigger-target-el={props.triggerTargetEl}
          show-after={compatShowAfter.value}
          strategy={props.strategy}
          teleported={props.teleported}
          transition={props.transition}
          virtual-triggering={props.virtualTriggering}
          z-index={props.zIndex}
          append-to={props.appendTo}
        >
          {slots.content ? (
            slots.content()
          ) : props.rawContent ? (
            <span v-html={props.content} />
          ) : (
            <span>{props.content}</span>
          )}

          {compatShowArrow.value && <NPopperArrow arrow-offset={props.arrowOffset} />}
        </NTooltipContent>
      </NPopper>
    )
  },
})
