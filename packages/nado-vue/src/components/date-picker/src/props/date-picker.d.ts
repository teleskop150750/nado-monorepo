import type { ExtractPropTypes } from 'vue'

export const datePickerProps = {
  type: {
    type: String,
    default: 'date',
  },
}

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
