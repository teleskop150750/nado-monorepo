import { VERTICAL } from './defaults.js'

const itemSize = {
  type: [Number, Function],
  required: true,
}
const estimatedItemSize = {
  type: Number,
}
const cache = {
  type: Number,
  default: 2,
}
const direction = {
  type: String,
  default: 'ltr',
  validator(val) {
    return ['ltr', 'rtl'].includes(val)
  },
}
const initScrollOffset = {
  type: Number,
  default: 0,
}
const total = {
  type: Number,
}
const layout = {
  type: String,
  default: VERTICAL,
  validator(val) {
    return ['horizontal', 'vertical'].includes(val)
  },
}

export const virtualizedProps = {
  className: {
    type: String,
    default: '',
  },
  containerElement: {
    type: [String, Object],
    default: 'div',
  },
  data: {
    type: Array,
    default: () => [],
  },
  /**
   * @description controls the horizontal direction.
   */
  direction,
  height: {
    type: [Number],
    required: true,
  },
  innerElement: {
    type: [String, Object],
    default: 'div',
  },
  style: {
    type: [Object, String, Array],
  },
  useIsScrolling: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number],
    required: false,
  },
  perfMode: {
    type: Boolean,
    default: true,
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
}
export const virtualizedListProps = {
  /**
   * @description описывает, сколько элементов должно быть предварительно отображено в начале и в конце окна.
   */
  cache,
  estimatedItemSize,
  /**
   * @description управляет ориентацией списка
   */
  layout,
  initScrollOffset,
  /**
   * @description описывает общее количество в списке.
   */
  total,
  itemSize,
  ...virtualizedProps,
}
const scrollbarSize = {
  type: Number,
  default: 12,
}
const startGap = { type: Number, default: 0 }
const endGap = { type: Number, default: 0 }

export const virtualizedGridProps = {
  columnCache: cache,
  columnWidth: itemSize,
  estimatedColumnWidth: estimatedItemSize,
  estimatedRowHeight: estimatedItemSize,
  initScrollLeft: initScrollOffset,
  initScrollTop: initScrollOffset,
  itemKey: {
    type: Function,
    default: ({ columnIndex, rowIndex }) => `${rowIndex}:${columnIndex}`,
  },
  rowCache: cache,
  rowHeight: itemSize,
  totalColumn: total,
  totalRow: total,
  hScrollbarSize: scrollbarSize,
  vScrollbarSize: scrollbarSize,
  scrollbarStartGap: startGap,
  scrollbarEndGap: endGap,
  ...virtualizedProps,
}
export const virtualizedScrollbarProps = {
  alwaysOn: Boolean,
  class: String,
  layout,
  total,
  ratio: {
    type: Number,
    required: true,
  },
  clientSize: {
    type: Number,
    required: true,
  },
  scrollFrom: {
    type: Number,
    required: true,
  },
  scrollbarSize,
  startGap: {
    type: Number,
    default: 0,
  },
  endGap: {
    type: Number,
    default: 0,
  },
  visible: {
    type: Boolean,
    default: false,
  },
}
