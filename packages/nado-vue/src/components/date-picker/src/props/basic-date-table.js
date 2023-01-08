import { datePickerSharedProps, selectionModeWithDefault } from './shared.js'

export const basicDateTableProps = {
  ...datePickerSharedProps,
  cellClassName: {
    type: Function,
  },
  showWeekNumber: {
    type: Boolean,
    default: true,
  },
  selectionMode: selectionModeWithDefault('date'),
}
