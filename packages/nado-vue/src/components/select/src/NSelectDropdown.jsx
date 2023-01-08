import { useResizeObserver } from '@vueuse/core'
import { computed, inject, onMounted, ref } from 'vue'

import { useNamespace, useRender } from '../../../hooks/index.js'
import { selectKey } from '../../../tokens/index.js'
import { createComponent, hSlot } from '../../../utils/index.js'

export const NSelectDropdown = createComponent({
  name: 'NSelectDropdown',
  setup(_, { slots }) {
    const select = inject(selectKey)
    const ns = useNamespace('select')

    // computed
    const popperClass = computed(() => select.props.popperClass)
    const isMultiple = computed(() => select.props.multiple)
    const isFitInputWidth = computed(() => select.props.fitInputWidth)
    const minWidth = ref('')

    function updateMinWidth() {
      minWidth.value = `${select.selectWrapperRef?.offsetWidth}px`
    }

    onMounted(() => {
      // TODO: updatePopper
      // popper.value.update()
      updateMinWidth()
      useResizeObserver(select.selectWrapperRef, updateMinWidth)
    })

    useRender(() => (
      <div
        class={[ns.b('dropdown'), ns.is('multiple', isMultiple.value), popperClass.value]}
        style={{ [isFitInputWidth.value ? 'width' : 'minWidth']: minWidth.value }}
      >
        {hSlot(slots.default)}
      </div>
    ))

    return {
      ns,
      minWidth,
      popperClass,
      isMultiple,
      isFitInputWidth,
    }
  },
})
