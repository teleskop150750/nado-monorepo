import { inject, onBeforeUnmount, watch } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { POPPER_CONTENT_INJECTION_KEY } from '../../../tokens/index.js'
import { createComponent } from '../../../utils/index.js'
import { popperArrowProps } from './popperArrowPropers.js'

export const NPopperArrow = createComponent({
  name: 'NPopperArrow',
  inheritAttrs: false,
  props: popperArrowProps,
  setup(props, { expose }) {
    const ns = useNamespace('popper')
    const { arrowOffset, arrowRef } = inject(POPPER_CONTENT_INJECTION_KEY, null)

    watch(
      () => props.arrowOffset,
      (val) => {
        arrowOffset.value = val
      },
    )

    onBeforeUnmount(() => {
      arrowRef.value = undefined
    })

    expose({
      /**
       * @description Arrow element
       */
      arrowRef,
    })

    return () => <span ref={arrowRef} class={ns.e('arrow')} data-popper-arrow="" />
  },
})
