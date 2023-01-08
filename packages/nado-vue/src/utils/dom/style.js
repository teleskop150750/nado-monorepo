import { debugWarn } from '../error.js'
import { isNumber, isString } from '../types.js'

const SCOPE = 'utils/dom/style'

export function classNameToArray(cls = '') {
  return cls.split(' ').filter((item) => !!item.trim())
}

/**
 * @param {Element} el
 * @param {string} cls
 */
export function hasClass(el, cls) {
  if (!el || !cls) {
    return false
  }

  if (cls.includes(' ')) {
    throw new Error('имя класса не должно содержать пробелов.')
  }

  return el.classList.contains(cls)
}

/**
 * @param {Element} el
 * @param {string} cls
 */
export function addClass(el, cls) {
  if (!el || !cls.trim()) {
    return
  }

  el.classList.add(...classNameToArray(cls))
}

/**
 * @param {undefined|string|number} val
 * @param {undefined|string} defaultUnit
 */
export function addUnit(val, defaultUnit = 'px') {
  if (!val) {
    return ''
  }

  if (isString(val)) {
    return val
  }

  if (isNumber(val)) {
    return `${val}${defaultUnit}`
  }

  debugWarn(SCOPE, 'binding value must be a string or number')
}
