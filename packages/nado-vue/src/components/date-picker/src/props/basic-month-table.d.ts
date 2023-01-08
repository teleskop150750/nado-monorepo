import type { ExtractPropTypes } from 'vue'

import { datePickerSharedProps, selectionModeWithDefault } from './shared.js'

export const basicMonthTableProps = {
  ...datePickerSharedProps,
  selectionMode: selectionModeWithDefault('month'),
}

export type BasicMonthTableProps = ExtractPropTypes<typeof basicMonthTableProps>
