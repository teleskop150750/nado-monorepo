import { sizeProp, useRouterLinkProps } from '../../../hooks/index.js'
import { iconPropType } from '../../../utils/index.js'

const align = new Set(['left', 'right', 'center', 'around', 'between', 'evenly'])
const formTypes = new Set(['button', 'submit', 'reset'])
const appearances = new Set(['primary', 'secondary', 'info', 'success', 'warn', 'error'])

export const buttonProps = {
  ...useRouterLinkProps,
  type: {
    type: String,
    default: 'button',
    /**
     * @param {string} val
     */
    validator(val) {
      return formTypes.has(val)
    },
  },
  label: {
    type: [Number, String],
    default: '',
  },
  /** @type {any} */
  icon: {
    type: iconPropType,
    default: null,
  },
  /** @type {any} */
  iconRight: {
    type: iconPropType,
    default: null,
  },
  tabindex: {
    type: [Number, String],
    default: 0,
  },
  appearance: {
    type: String,
    default: undefined,
    validator(val) {
      return appearances.has(val)
    },
  },
  size: sizeProp,
  align: {
    type: String,
    default: 'center',
    validator(val) {
      return align.has(val)
    },
  },
  link: {
    type: Boolean,
    default: false,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}
