import { computed, ref, unref } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { addUnit, createComponent, hSlot } from '../../../utils/index.js'
import { NTooltip } from '../../tooltip/index.js'
import { popoverEmits, popoverProps } from './popoverProps.js'

export const NPopover = createComponent({
  name: 'NPopover',
  props: popoverProps,
  emits: popoverEmits,
  setup(props, { slots, expose, emit, attrs }) {
    const updateEventKeyRaw = 'onUpdate:visible'

    const onUpdateVisible = computed(() => props[updateEventKeyRaw])

    const ns = useNamespace('popover')
    const tooltipRef = ref()
    const popperRef = computed(() => unref(tooltipRef)?.popperRef)

    const style = computed(() => [
      {
        width: addUnit(props.width),
      },
      props.popperStyle,
    ])

    const popperClasses = computed(() => [ns.b(), props.popperClass, { [ns.m('plain')]: !!props.content }])

    const gpuAcceleration = computed(() => props.transition === `${ns.namespace}-fade-in-linear`)

    const hide = () => {
      tooltipRef.value?.hide()
    }

    const beforeEnter = () => {
      emit('before-enter')
    }

    const beforeLeave = () => {
      emit('before-leave')
    }

    const afterEnter = () => {
      emit('after-enter')
    }

    const afterLeave = () => {
      emit('update:visible', false)
      emit('after-leave')
    }

    expose({
      /** @description popper ref */
      popperRef,
      /** @description hide popover */
      hide,
    })

    return () => (
      <NTooltip
        ref={tooltipRef}
        {...attrs}
        trigger={props.trigger}
        placement={props.placement}
        disabled={props.disabled}
        visible={props.visible}
        transition={props.transition}
        popper-options={props.popperOptions}
        tabindex={props.tabindex}
        content={props.content}
        offset={props.offset}
        show-after={props.showAfter}
        hide-after={props.hideAfter}
        auto-close={props.autoClose}
        show-arrow={props.showArrow}
        aria-label={props.title}
        effect={props.effect}
        enterable={props.enterable}
        popper-class={popperClasses.value}
        popper-style={style.value}
        teleported={props.teleported}
        persistent={props.persistent}
        gpu-acceleration={gpuAcceleration.value}
        onUpdate:visible={onUpdateVisible.value}
        onBefore-show={beforeEnter}
        onBefore-hide={beforeLeave}
        onShow={afterEnter}
        onHide={afterLeave}
      >
        {{
          default: () => slots.reference && slots.reference(),
          content: () => (
            <>
              {props.title && (
                <div class={ns.e('title')} role="title">
                  {props.title}
                </div>
              )}
              {hSlot(slots.default, props.content)}
            </>
          ),
        }}
      </NTooltip>
    )
  },
})
