/**
 * @param {KeyboardEvent} evt
 */
export function shouldIgnoreKey(evt) {
  return (
    evt !== Object(evt) ||
    evt.isComposing === true ||
    // @ts-ignore
    evt.nKeyEvent === true
  )
}

/**
 * @param {KeyboardEvent} evt
 * @param {Array|number} keyCodes
 */
export function isKeyCode(evt, keyCodes = []) {
  return shouldIgnoreKey(evt) === true ? false : [keyCodes].flat().includes(evt.keyCode)
}
