import { isClient } from '@vueuse/core'

/**
 * @return {boolean}
 */
export const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent)
