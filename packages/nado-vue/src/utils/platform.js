/**
 * @return {boolean}
 */
export const isClient = typeof window !== 'undefined'

/**
 * @return {boolean}
 */
export const hasTouch = isClient ? 'ontouchstart' in window || window.navigator.maxTouchPoints > 0 : false
