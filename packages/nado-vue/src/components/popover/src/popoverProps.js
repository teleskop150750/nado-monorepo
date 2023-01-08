import { isBoolean } from '../../../utils/index.js'
import { useTooltipContentProps } from '../../tooltip/src/tooltipContentProps.js'
import { useTooltipTriggerProps } from '../../tooltip/src/tooltipTriggerProps.js'

// TODO: Перенести в dropdown
const dropdownProps = {
  placement: {
    type: String,
    default: 'bottom',
  },
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
  tabindex: {
    type: [Number, String],
    default: 0,
  },
}

export const popoverProps = {
  trigger: useTooltipTriggerProps.trigger,
  placement: dropdownProps.placement,
  disabled: useTooltipTriggerProps.disabled,
  visible: useTooltipContentProps.visible,
  transition: useTooltipContentProps.transition,
  popperOptions: dropdownProps.popperOptions,
  tabindex: dropdownProps.tabindex,
  content: useTooltipContentProps.content,
  popperStyle: useTooltipContentProps.popperStyle,
  popperClass: useTooltipContentProps.popperClass,
  enterable: {
    ...useTooltipContentProps.enterable,
    default: true,
  },
  effect: {
    ...useTooltipContentProps.effect,
    default: 'light',
  },
  teleported: useTooltipContentProps.teleported,
  title: String,

  width: {
    type: [String, Number],
    default: 150,
  },
  offset: {
    type: Number,
    default: undefined,
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
  autoClose: {
    type: Number,
    default: 0,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  'onUpdate:visible': {
    type: Function,
  },
}

export const popoverEmits = {
  'update:visible': (val) => isBoolean(val),
  'before-enter': () => true,
  'before-leave': () => true,
  'after-enter': () => true,
  'after-leave': () => true,
}
