import { computed } from 'vue'

import { createComponent, hSlot } from '../../../utils/index.js'
import { visualHiddenProps } from './visualHiddenProps.js'

export const NVisuallyHidden = createComponent({
  name: 'NVisuallyHidden',
  props: visualHiddenProps,
  setup(props, { slots }) {
    const computedStyle = computed(() => [
      props.style,
      {
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      },
    ])

    return () => <span style={computedStyle.value}>{hSlot(slots.default)}</span>
  },
})
