export const listenOptions = {
  hasPassive: false,
  passiveCapture: true,
  notPassiveCapture: true,
}

/**
 * @param {Event} evt
 */
export function stop(evt) {
  evt.stopPropagation()
}

/**
 * @param {Event} evt
 */
export function prevent(evt) {
  evt.cancelable !== false && evt.preventDefault()
}

/**
 * @param {Event} evt
 */
export function stopAndPrevent(evt) {
  evt.cancelable !== false && evt.preventDefault()
  evt.stopPropagation()
}
