import { isString } from '@vue/shared'

import { UPDATE_MODEL_EVENT } from '../../../constants/index.js'
import { sizeProp } from '../../../hooks/index.js'

export const inputProps = {
  id: {
    type: String,
    default: undefined,
  },
  size: sizeProp,
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Object],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  resize: {
    type: String,
    validator(val) {
      return ['none', 'both', 'horizontal', 'vertical'].includes(val)
    },
  },
  autosize: {
    type: [Boolean, Object],
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },

  placeholder: {
    type: String,
  },
  form: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    default: null,
  },
  prefixIcon: {
    default: null,
  },
  containerRole: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  tabindex: {
    type: [String, Number],
    default: 0,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  inputStyle: {
    type: [Object, Array, String],
    default: () => {},
  },
  success: {
    type: Boolean,
    default: undefined,
  },
  error: {
    type: Boolean,
    default: undefined,
  },
  // warn: {
  //   type: Boolean,
  //   default: undefined,
  // },
}

export const inputEmits = {
  /**
   * @param {string} val
   */
  [UPDATE_MODEL_EVENT]: (val) => isString(val),
  /**
   * @param {string} val
   */
  input: (val) => isString(val),
  /**
   * @param {string} val
   */
  change: (val) => isString(val),
  /**
   * @param {FocusEvent} evt
   */
  focus: (evt) => evt instanceof FocusEvent,
  /**
   * @param {FocusEvent} evt
   */
  blur: (evt) => evt instanceof FocusEvent,
  clear: () => true,
  /**
   * @param {MouseEvent} evt
   */
  mouseleave: (evt) => evt instanceof MouseEvent,
  /**
   * @param {MouseEvent} evt
   */
  mouseenter: (evt) => evt instanceof MouseEvent,
  // NOTE: При автозаполнении браузером событие instanceof Event, а не KeyboardEvent
  /**
   * @param {KeyboardEvent | Event} evt
   */
  keydown: (evt) => evt instanceof Event,
}
