const tooltipStrategies = new Set(['absolute', 'fixed'])

const tooltipPlacements = new Set([
  'top-start',
  'top-end',
  'top',
  'bottom-start',
  'bottom-end',
  'bottom',
  'left-start',
  'left-end',
  'left',
  'right-start',
  'right-end',
  'right',
])

export const tooltipContentProps = {
  ariaLabel: String,

  arrowPadding: {
    type: Number,
    default: 5,
  },

  effect: {
    type: String,
    default: '',
  },

  contentClass: {
    type: String,
    default: '',
  },

  /**
   * Размещение содержимого всплывающей подсказки относительно ссылочного элемента
   * (при отсутствии он ссылается на триггер)
   */
  placement: {
    type: String,
    default: 'bottom',
    validator(val) {
      return tooltipPlacements.has(val)
    },
  },

  /**
   * Ссылочный элемент для содержимого всплывающей подсказки, чтобы задать его положение
   */
  reference: {
    type: Object,
    default: null,
  },

  offset: {
    type: Number,
    default: 8,
  },

  strategy: {
    type: String,
    default: 'absolute',
    validator(val) {
      return tooltipStrategies.has(val)
    },
  },

  showArrow: {
    type: Boolean,
    default: false,
  },
}
