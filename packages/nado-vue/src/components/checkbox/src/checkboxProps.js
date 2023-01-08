import { useFormProps } from '../../../composables/private/useForm.js'

export const checkboxProps = {
  ...useFormProps,
  modelValue: {
    required: true,
    default: null,
  },
  val: {},
  trueValue: {
    default: true,
  },
  falseValue: {
    default: false,
  },
  indeterminateValue: {
    default: null,
  },
  toggleOrder: {
    type: String,
    validator: (/** @type {string} */ v) => v === 'tf' || v === 'ft',
  },
  toggleIndeterminate: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: '',
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
  validateEvent: {
    type: Boolean,
    default: true,
  },
}
