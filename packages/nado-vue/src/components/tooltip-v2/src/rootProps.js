export const tooltipRootProps = {
  delayDuration: {
    type: Number,
    default: 300,
  },

  defaultOpen: {
    type: Boolean,
    default: false,
  },

  open: {
    type: Boolean,
    default: true,
  },

  onOpenChange: {
    type: Function,
  },

  'onUpdate:open': {
    type: Function,
  },
}
