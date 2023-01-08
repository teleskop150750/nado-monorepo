import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes } from 'vue'

import type { datePickTypes } from '../../../../constants/date.js'

export type RangeState = {
  endDate: null | Dayjs
  selecting: boolean
}

export const datePickerSharedProps = {
  disabledDate: {
    type: Function,
  },
  date: {
    type: Object,
    required: true,
  },
  minDate: {
    type: Object,
    default: null,
  },
  maxDate: {
    type: Object,
    default: null,
  },
  parsedValue: {
    type: [Object, Array],
  },
  rangeState: {
    type: Object,
    default: () => ({
      endDate: null,
      selecting: false,
    }),
  },
}

export const panelSharedProps = {
  type: {
    type: String,
    required: true,
    validator(val) {
      return datePickTypes.includes(val)
    },
  },
}

export const panelRangeSharedProps = {
  unlinkPanels: Boolean,
  parsedValue: {
    type: Array,
  },
}
type SelectionModes = ['date', 'dates', 'year', 'month', 'week', 'range']

export const selectionModeWithDefault: any

// export const selectionModeWithDefault: (mode: string) => {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   type: String
//   default: string
//   validator: (val: string) => boolean
// }

export const rangePickerSharedEmits: {
  pick: (range: [Dayjs, Dayjs]) => any
}

export type RangePickerSharedEmits = typeof rangePickerSharedEmits
export type PanelRangeSharedProps = ExtractPropTypes<typeof panelRangeSharedProps>
