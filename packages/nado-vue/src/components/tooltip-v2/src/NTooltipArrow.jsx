import { computed, inject } from 'vue'

import { tooltipV2ContentKey, tooltipV2RootKey } from '../../../tokens/index.js'
import { createComponent } from '../../../utils/index.js'
import { tooltipArrowProps, tooltipArrowSpecialProps } from './arrowProps.js'

export const NTooltipArrow = createComponent({
  name: 'NTooltipArrow',
  props: {
    ...tooltipArrowProps,
    ...tooltipArrowSpecialProps,
  },
  setup(props) {
    const { ns } = inject(tooltipV2RootKey)
    const { arrowRef } = inject(tooltipV2ContentKey)

    const arrowStyle = computed(() => {
      const { style, width, height } = props
      const namespace = ns.namespace.value

      return {
        [`--${namespace}-comp-tooltip-v2-arrow-width`]: `${width}px`,
        [`--${namespace}-comp-tooltip-v2-arrow-height`]: `${height}px`,
        [`--${namespace}-comp-tooltip-v2-arrow-border-width`]: `${width / 2}px`,
        [`--${namespace}-comp-tooltip-v2-arrow-cover-width`]: width / 2 - 1,
        ...style,
      }
    })

    return () => <span ref={arrowRef} style={arrowStyle.value} class={ns.e('arrow')} />
  },
})
