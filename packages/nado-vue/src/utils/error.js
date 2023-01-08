import { isString } from './types.js'

class NError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message)
    this.name = 'NError'
  }
}

/**
 * @param {string} scope string
 * @param {string} [message] string
 */
export function throwError(scope, message) {
  throw new NError(`[${scope}] ${message}`)
}

/**
 * @param {string} scope
 * @param {string} [message]
 */
export function debugWarn(scope, message) {
  if (import.meta.env.PROD) {
    const error = isString(scope) ? new NError(`[${scope}] ${message}`) : scope

    // eslint-disable-next-line no-console
    console.warn(error)
  }
}
