import { sizeProp } from '../../../hooks/index.js'

const appearances = new Set(['primary', 'secondary', 'info', 'success', 'warn', 'error'])

export const tagProps = {
  closable: {
    type: Boolean,
    default: false,
  },
  appearance: {
    type: String,
    default: 'secondary',
    validator(val) {
      return appearances.has(val)
    },
  },
  hit: {
    type: Boolean,
    default: false,
  },
  size: sizeProp,
}

export const tagEmits = {
  /** @param {MouseEvent} evt */
  close: (evt) => evt instanceof MouseEvent,
  /** @param {MouseEvent} evt */
  click: (evt) => evt instanceof MouseEvent,
}
