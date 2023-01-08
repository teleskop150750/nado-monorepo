import type { ExtractPropTypes } from 'vue'

export const optionProps = {
  data: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hovering: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    required: true,
  },
  index: Number,
  style: {
    type: Object,
    default: () => ({}),
  },
  selected: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Boolean,
    default: false,
  },
}

export type IOptionProps = ExtractPropTypes<typeof optionProps>
