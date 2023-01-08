import { useNamespace } from '../../../hooks/index.js'
import { createComponent } from '../../../utils/index.js'
import { checkboxProps } from './checkboxProps.js'
import { useCheckbox } from './useCheckbox.jsx'

export const NCheckbox = createComponent({
  name: 'NCheckbox',
  props: checkboxProps,
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const ns = useNamespace('checkbox')

    function getInner() {
      return () => [
        <div class={ns.e('bg')} key={'svg'}>
          <svg class={ns.e('svg')} viewBox={'0 0 24 24'}>
            <path class={ns.e('truthy')} fill={'none'} d={'M4.6897 11.8008L9.52873 16.5577L19.2724 6.87964'} />
            <path class={ns.e('indet')} fill={'currentColor'} d={'M4,11H20V13H4'} />
          </svg>
        </div>,
      ]
    }

    return useCheckbox('checkbox', props, ctx, getInner)
  },
})
