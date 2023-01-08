import { tooltipSides } from './common.js'

export const tooltipArrowProps = {
  width: {
    type: Number,
    default: 10,
  },
  height: {
    type: Number,
    default: 10,
  },
  style: {
    type: Object,
    default: null,
  },
}

export const tooltipArrowSpecialProps = {
  side: {
    type: String,
    required: true,
    validator(val) {
      return tooltipSides.includes(val)
    },
  },
}
