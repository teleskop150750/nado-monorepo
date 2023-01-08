import type { ExtractPropTypes } from 'vue'

export const barProps = {
  always: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  ratioX: {
    type: Number,
    default: 1,
  },
  ratioY: {
    type: Number,
    default: 1,
  },
} as const

export type BarProps = ExtractPropTypes<typeof barProps>
