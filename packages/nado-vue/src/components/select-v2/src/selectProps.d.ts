import { placements } from '@popperjs/core'
import type { ExtractPropTypes } from 'vue'

import type { sizeProp } from '../../../hooks/index.js'
import { NIconClose } from '../../../icons/index.js'
import { useTooltipContentProps } from '../../tooltip/src/tooltipContentProps.js'

export const selectProps = {
  allowCreate: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'none',
  },
  automaticDropdown: Boolean,
  clearable: Boolean,
  clearIcon: {
    type: [String, Object, Function],
    default: NIconClose,
  },
  effect: {
    type: String,
    default: 'light',
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  defaultFirstOption: Boolean,
  disabled: Boolean,
  estimatedOptionHeight: {
    type: Number,
    default: undefined,
  },
  filterable: Boolean,
  filterMethod: Function,
  height: {
    type: Number,
    default: 170, // 5 items by default
  },
  itemHeight: {
    type: [Number, Function],
    default: 34,
  },
  id: String,
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: String,
  label: String,
  modelValue: [Array, String, Number, Boolean, Object],
  multiple: {
    type: Boolean,
    default: false,
  },
  multipleLimit: {
    type: Number,
    default: 0,
  },
  name: String,
  noDataText: String,
  noMatchText: String,
  remoteMethod: Function,
  reserveKeyword: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
  },
  teleported: useTooltipContentProps.teleported,
  persistent: {
    type: Boolean,
    default: true,
  },
  popperClass: {
    type: String,
    default: '',
  },
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
  remote: {
    type: Boolean,
    default: false,
  },
  size: sizeProp,
  valueKey: {
    type: String,
    default: 'value',
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  placement: {
    type: String,
    default: 'bottom-start',
    validator(val) {
      return placements.includes(val)
    },
  },
  success: {
    type: Boolean,
    default: undefined,
  },
  error: {
    type: Boolean,
    default: undefined,
  },
}
export type ISelectProps = ExtractPropTypes<typeof selectProps>
