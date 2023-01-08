import { datePickerSharedProps, selectionModeWithDefault } from './shared.js'

export const basicMonthTableProps = {
  ...datePickerSharedProps,
  selectionMode: selectionModeWithDefault('month'),
}
