import { sizeProp } from '../../../hooks/index.js'
import { NIconClose } from '../../../icons/index.js'
import { disabledTimeListsProps } from '../../time-picker/src/props/shared.js'

export const timePickerDefaultProps = {
  id: {
    type: [Array, String],
  },
  name: {
    type: [Array, String],
    default: '',
  },
  popperClass: {
    type: String,
    default: '',
  },
  format: String,
  valueFormat: String,
  type: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  clearIcon: {
    type: [String, Object],
    default: NIconClose,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  prefixIcon: {
    type: [String, Object],
    default: '',
  },
  size: sizeProp,
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: [Date, Array, String, Number],
    default: '',
  },
  rangeSeparator: {
    type: String,
    default: '-',
  },
  startPlaceholder: String,
  endPlaceholder: String,
  defaultValue: {
    type: [Date, Array],
  },
  defaultTime: {
    type: [Date, Array],
  },
  isRange: {
    type: Boolean,
    default: false,
  },
  ...disabledTimeListsProps,
  disabledDate: {
    type: Function,
  },
  cellClassName: {
    type: Function,
  },
  shortcuts: {
    type: Array,
    default: () => [],
  },
  arrowControl: {
    type: Boolean,
    default: false,
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
  unlinkPanels: Boolean,
}
