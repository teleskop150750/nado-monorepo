import { isClient } from '@vueuse/core'

/**
 * @param {() => void} fn
 */
export const rAF = (fn) => (isClient ? window.requestAnimationFrame(fn) : setTimeout(fn, 16))

/**
 * @param {number} handle
 */
export const cAF = (handle) => (isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle))
