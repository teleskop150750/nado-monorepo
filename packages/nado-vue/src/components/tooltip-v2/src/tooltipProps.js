import { tooltipArrowProps } from './arrowProps.js'
import { tooltipContentProps } from './contentProps.js'
import { tooltipRootProps } from './rootProps.js'
import { tooltipTriggerProps } from './triggerProps.js'

export const tooltipProps = {
  ...tooltipRootProps,
  ...tooltipArrowProps,
  ...tooltipTriggerProps,
  ...tooltipContentProps,

  alwaysOn: {
    type: Boolean,
    default: true,
  },

  fullTransition: {
    type: Boolean,
    default: false,
  },

  transitionProps: {
    type: Object,
    default: null,
  },

  teleported: {
    type: Boolean,
    default: false,
  },

  to: {
    type: String,
    default: 'self',
  },
}
