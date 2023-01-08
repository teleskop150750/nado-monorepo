import { isNumber } from '@vueuse/core'
import type { ExtractPropTypes, PropType } from 'vue'

export const scrollbarProps = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  native: {
    type: Boolean,
    default: false,
  },
  wrapStyle: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    default: '',
  },
  wrapClass: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  viewClass: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  viewStyle: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    default: '',
  },
  noResize: {
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
    default: 30,
  },
} as const

export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>

export const scrollbarEmits = {
  scroll: ({ scrollTop, scrollLeft }: { scrollTop: number; scrollLeft: number }) =>
    [scrollTop, scrollLeft].every(isNumber),
}
