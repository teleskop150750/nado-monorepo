import { sizeProp } from '../../../hooks/index.js'
import { isArray, isBoolean, isString } from '../../../utils/index.js'

export const formProps = {
  model: Object,
  rules: {
    type: Object,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: sizeProp,
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  scrollToError: {
    type: Boolean,
    default: false,
  },
}

export const formEmits = {
  validate: (prop, isValid, message) => (isArray(prop) || isString(prop)) && isBoolean(isValid) && isString(message),
}
