import { sizeProp } from '../../../hooks/index.js'

export const formItemValidateStates = ['', 'error', 'validating', 'success']

export const formItemProps = {
  label: String,
  prop: {
    // @ts-ignore
    type: [String, Array],
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    // @ts-ignore
    type: [Object, Array],
  },
  hint: {
    type: String,
  },
  warn: {
    type: String,
  },
  error: {
    type: String,
  },
  validateStatus: {
    type: String,
    validator(val) {
      return formItemValidateStates.includes(val)
    },
  },
  for: String,
  inlineMessage: {
    type: [String, Boolean],
    default: '',
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: sizeProp,
  hideHint: {
    type: Boolean,
    default: false,
  },
}
