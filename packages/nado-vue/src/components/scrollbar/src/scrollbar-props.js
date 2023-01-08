import { isNumber } from '../../../utils/index.js'

export const scrollbarProps = {
  height: {
    type: [String, Number],
    default: '',
  },
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  native: {
    type: Boolean,
    default: false,
  },
  wrapStyle: {
    type: [String, Object, Array],
    default: '',
  },
  wrapClass: {
    type: [String, Array],
    default: '',
  },
  viewClass: {
    type: [String, Array],
    default: '',
  },
  viewStyle: {
    type: [String, Array, Object],
    default: '',
  },
  // Если размер контейнера не меняется, лучше всего установить его для оптимизации производительности
  noresize: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: 'div',
  },
  always: {
    type: Boolean,
    default: false,
  },
  minSize: {
    type: Number,
    default: 20,
  },
}
export const scrollbarEmits = {
  scroll: ({ scrollTop, scrollLeft }) => [scrollTop, scrollLeft].every((element) => isNumber(element)),
}
