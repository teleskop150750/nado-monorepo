import { useFormProps } from '../../../composables/private/useForm.js'

export const radioProps = {
  ...useFormProps,

  modelValue: {
    required: true,
  },
  val: {
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  leftLabel: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tabindex: {
    type: [String, Number],
    default: 0,
  },
}
