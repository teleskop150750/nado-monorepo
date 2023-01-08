export const focusTrapProps = {
  loop: {
    type: Boolean,
    default: false,
  },
  trapped: {
    type: Boolean,
    default: false,
  },
  focusTrapEl: {
    type: Object,
    default: undefined,
  },
  focusStartEl: {
    type: [Object, String],
    default: 'first',
  },
}
