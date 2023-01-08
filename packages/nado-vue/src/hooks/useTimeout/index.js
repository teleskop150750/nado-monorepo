import { tryOnScopeDispose } from '@vueuse/core'

export function useTimeout() {
  /** @type {number} */
  let timeoutHandle

  const cancelTimeout = () => window.clearTimeout(timeoutHandle)

  /**
   * @param {(...args: any[]) => any} fn
   * @param {number} delay
   */
  const registerTimeout = (fn, delay) => {
    cancelTimeout()
    timeoutHandle = window.setTimeout(fn, delay)
  }

  tryOnScopeDispose(() => cancelTimeout())

  return {
    registerTimeout,
    cancelTimeout,
  }
}
