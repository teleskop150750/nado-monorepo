import { isString } from '@vue/shared'
import type { ExtractPropTypes } from 'vue'

import { UPDATE_MODEL_EVENT } from '../../../constants/index.js'

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean

export const inputProps = {
  id: {
    type: String,
    default: undefined,
  },
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
    default: () => '',
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  warn: {
    type: Boolean,
    default: false,
  },
}

export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (val: string) => isString(val),
  input: (val: string) => isString(val),
  change: (val: string) => isString(val),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
  mouseleave: (evt: MouseEvent) => evt instanceof MouseEvent,
  mouseenter: (evt: MouseEvent) => evt instanceof MouseEvent,
  // NOTE: when autofill by browser, the keydown event is instanceof Event, not KeyboardEvent
  // relative bug report https://github.com/element-plus/element-plus/issues/6665
  keydown: (evt: KeyboardEvent | Event) => evt instanceof Event,
}
export type InputEmits = typeof inputEmits

export type InputInstance = InstanceType<typeof Input>
