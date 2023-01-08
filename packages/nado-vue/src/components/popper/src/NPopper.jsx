import { computed, provide, ref } from 'vue'

import { POPPER_INJECTION_KEY } from '../../../tokens/index.js'
import { createComponent, hSlot } from '../../../utils/index.js'
import { popperProps } from './popperProps.js'

export const NPopper = createComponent({
  name: 'NPopper',
  inheritAttrs: false,
  props: popperProps,
  setup(props, { slots, expose }) {
    const triggerRef = ref()
    const popperInstanceRef = ref()
    const contentRef = ref()
    const referenceRef = ref()
    const role = computed(() => props.role)

    const popperProvides = {
      /**
       * @description trigger element
       */
      triggerRef,
      /**
       * @description popperjs instance
       */
      popperInstanceRef,
      /**
       * @description popper content element
       */
      contentRef,
      /**
       * @description popper reference element
       */
      referenceRef,
      /**
       * @description role determines how aria attributes are distributed
       */
      role,
    }

    expose(popperProvides)

    provide(POPPER_INJECTION_KEY, popperProvides)

    return () => hSlot(slots.default)
  },
})
