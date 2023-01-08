import { datePickTypes } from '../../../../constants/index.js'
import { isArray } from '../../../../utils/index.js'

const selectionModes = new Set(['date', 'dates', 'year', 'month', 'week', 'range'])

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

export const selectionModeWithDefault = (mode) => ({
  type: String,
  default: mode,
  validator(val) {
    return selectionModes.has(val)
  },
})

export const rangePickerSharedEmits = {
  pick: (range) => isArray(range),
}
