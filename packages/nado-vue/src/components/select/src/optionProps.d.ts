const optionProps = {
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  label: {
    type: [String, Number],
    default: '',
  },
  created: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}

export type OptionProps = ExtractPropTypes<typeof optionProps>
