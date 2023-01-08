import { EVENT_CODE } from '../../../constants/aria.js'
import { createCollectionWithScope } from '../../collection/index.js'
import { useTooltipContentProps } from '../../tooltip/src/tooltipContentProps.js'
import { useTooltipTriggerProps } from '../../tooltip/src/tooltipTriggerProps.js'

export const dropdownProps = {
  trigger: useTooltipTriggerProps.trigger,
  effect: {
    ...useTooltipContentProps.effect,
    default: 'light',
  },
  type: {
    type: String,
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
  id: String,
  size: {
    type: String,
    default: '',
  },
  splitButton: Boolean,
  hideOnClick: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  showTimeout: {
    type: Number,
    default: 150,
  },
  hideTimeout: {
    type: Number,
    default: 150,
  },
  tabindex: {
    type: [Number, String],
    default: 0,
  },
  maxHeight: {
    type: [Number, String],
    default: '',
  },
  popperClass: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'menu',
  },
  buttonProps: {
    type: Object,
  },
  teleported: useTooltipContentProps.teleported,
}

export const dropdownItemProps = {
  command: {
    type: [Object, String, Number],
    default: () => ({}),
  },
  disabled: Boolean,
  divided: Boolean,
  textValue: String,
  icon: {
    type: [Object, Function],
  },
}

export const dropdownMenuProps = {
  onKeydown: { type: Function },
}
export const FIRST_KEYS = [EVENT_CODE.down, EVENT_CODE.pageDown, EVENT_CODE.home]

export const LAST_KEYS = [EVENT_CODE.up, EVENT_CODE.pageUp, EVENT_CODE.end]

export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]

const { NCollection, NCollectionItem, COLLECTION_INJECTION_KEY, COLLECTION_ITEM_INJECTION_KEY } =
  createCollectionWithScope('Dropdown')

export {
  COLLECTION_INJECTION_KEY as DROPDOWN_COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY as DROPDOWN_COLLECTION_ITEM_INJECTION_KEY,
  NCollection,
  NCollectionItem,
}
