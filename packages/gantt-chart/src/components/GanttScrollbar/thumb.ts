import type { ExtractPropTypes } from 'vue'

export const thumbProps = {
  vertical: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    required: true,
  },
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: {
    type: Boolean,
    default: false,
  },
} as const

export type ThumbProps = ExtractPropTypes<typeof thumbProps>
