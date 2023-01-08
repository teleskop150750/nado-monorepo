/**
 * @param {(evt: Event) => boolean | void} theirsHandler
 * @param {(evt: Event) => void} oursHandler
 */
export const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
  const handleEvent = (evt) => {
    const shouldPrevent = theirsHandler?.(evt)

    if (checkForDefaultPrevented === false || !shouldPrevent) {
      return oursHandler?.(evt)
    }
  }

  return handleEvent
}

/**
 * @param {(evt: PointerEvent) => any} handler
 */
export const whenMouse = (handler) => (evt) => evt.pointerType === 'mouse' ? handler(evt) : undefined
