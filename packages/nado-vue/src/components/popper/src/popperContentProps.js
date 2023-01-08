import { placements } from '@popperjs/core'

const POSITIONING_STRATEGIES = new Set(['fixed', 'absolute'])

export const popperCoreConfigProps = {
  boundariesPadding: {
    type: Number,
    default: 0,
  },
  fallbackPlacements: {
    type: Array,
    default: undefined,
  },
  gpuAcceleration: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: Number,
    default: 12,
  },
  placement: {
    type: String,
    default: 'bottom',
    validator(val) {
      return placements.includes(val)
    },
  },
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
  strategy: {
    type: String,
    default: 'absolute',
    validator(val) {
      return POSITIONING_STRATEGIES.has(val)
    },
  },
}

export const popperContentProps = {
  ...popperCoreConfigProps,
  id: String,
  style: {
    type: [String, Array, Object],
  },
  className: {
    type: [String, Array, Object],
  },
  effect: {
    type: String,
    default: 'light',
  },
  visible: {
    type: Boolean,
    default: false,
  },
  enterable: {
    type: Boolean,
    default: true,
  },
  pure: {
    type: Boolean,
    default: false,
  },
  focusOnShow: {
    type: Boolean,
    default: false,
  },
  trapping: {
    type: Boolean,
    default: false,
  },
  popperClass: {
    type: [String, Array, Object],
  },
  popperStyle: {
    type: [String, Array, Object],
  },
  referenceEl: {
    type: Object,
  },
  triggerTargetEl: {
    type: Object,
  },
  stopPopperMouseEvent: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
  virtualTriggering: Boolean,
  zIndex: Number,
}

export const popperContentEmits = {
  mouseenter: (evt) => evt instanceof MouseEvent,
  mouseleave: (evt) => evt instanceof MouseEvent,
  focus: () => true,
  blur: () => true,
  close: () => true,
}
