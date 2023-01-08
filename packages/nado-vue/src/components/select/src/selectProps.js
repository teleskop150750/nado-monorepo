import { placements } from '@popperjs/core'

import { sizeProp } from '../../../hooks/index.js'
import { NIconChevronDown, NIconClose } from '../../../icons/index.js'
import { iconPropType } from '../../../utils/index.js'
import { tagProps } from '../../tag/src/props.js'
import { useTooltipContentProps } from '../../tooltip/src/tooltipContentProps.js'

export const selectProps = {
  name: String,
  id: String,
  modelValue: {
    type: [Array, String, Number, Boolean, Object],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  automaticDropdown: {
    type: Boolean,
    default: false,
  },
  size: sizeProp,
  effect: {
    type: String,
    default: 'light',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  allowCreate: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  popperClass: {
    type: String,
    default: '',
  },
  remote: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Загрузка',
  },
  noMatchText: {
    type: String,
    default: 'Совпадений не найдено',
  },
  noDataText: {
    type: String,
    default: 'Нет данных',
  },
  remoteMethod: Function,
  filterMethod: Function,
  multiple: {
    type: Boolean,
    default: false,
  },
  multipleLimit: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: String,
    default: 'Выбрать',
  },
  defaultFirstOption: Boolean,
  reserveKeyword: {
    type: Boolean,
    default: true,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  teleported: useTooltipContentProps.teleported,
  persistent: {
    type: Boolean,
    default: true,
  },
  clearIcon: {
    type: iconPropType,
    default: NIconClose,
  },
  suffixIcon: {
    type: iconPropType,
    default: NIconChevronDown,
  },
  fitInputWidth: {
    type: Boolean,
    default: false,
  },
  tagType: {
    ...tagProps.type,
    default: 'info',
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  remoteShowSuffix: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: 'bottom-start',
    validator(val) {
      return placements.includes(val)
    },
  },
}
