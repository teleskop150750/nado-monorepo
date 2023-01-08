import { useNamespace } from '../../../hooks/index.js'
import { createComponent } from '../../../utils/index.js'
import { checkboxProps } from '../../checkbox/src/checkboxProps.js'
import { useCheckbox } from '../../checkbox/src/useCheckbox.jsx'

export const NToggle = createComponent({
  name: 'NToggle',
  props: checkboxProps,
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const ns = useNamespace('toggle')

    function getInner() {
      return () => [<div class={ns.e('track')} />]
    }

    return useCheckbox('toggle', props, ctx, getInner)
  },
})
