import { defineComponent, inject } from 'vue'

import { useNamespace } from '../../../../hooks/index.js'
import { ROOT_PICKER_INJECTION_KEY } from '../../../../tokens/index.js'
import { basicCellProps } from '../props/basic-cell.js'

export default defineComponent({
  name: 'NDatePickerCell',
  props: basicCellProps,
  setup(props) {
    const ns = useNamespace('date-table-cell')
    const { slots } = inject(ROOT_PICKER_INJECTION_KEY)

    return () => {
      const { cell } = props

      if (slots.default) {
        const list = slots
          .default(cell)
          .filter((item) => item.patchFlag !== -2 && item.type.toString() !== 'Symbol(Comment)')

        if (list.length > 0) {
          return list
        }
      }

      return (
        <div class={ns.b()}>
          <span class={ns.e('text')}>{cell?.text}</span>
        </div>
      )
    }
  },
})
