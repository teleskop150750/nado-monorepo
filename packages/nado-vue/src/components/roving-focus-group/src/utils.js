import { EVENT_CODE } from '../../../constants/aria.js'

const MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

/**
 * @param {string} key
 * @param {'ltr' | 'rtl'} [dir]
 * @returns
 */
const getDirectionAwareKey = (key, dir) => {
  if (dir !== 'rtl') {
    return key
  }

  switch (key) {
    case EVENT_CODE.right: {
      return EVENT_CODE.left
    }
    case EVENT_CODE.left: {
      return EVENT_CODE.right
    }
    default: {
      return key
    }
  }
}

/**
 * @param {KeyboardEvent} event
 * @param {import("vue").HTMLAttributes['aria-orientation']} [orientation]
 * @param {'ltr' | 'rtl'} [dir]
 * @returns
 */
export const getFocusIntent = (event, orientation, dir) => {
  const key = getDirectionAwareKey(event.key, dir)

  if (orientation === 'vertical' && [EVENT_CODE.left, EVENT_CODE.right].includes(key)) {
    return undefined
  }

  if (orientation === 'horizontal' && [EVENT_CODE.up, EVENT_CODE.down].includes(key)) {
    return undefined
  }

  return MAP_KEY_TO_FOCUS_INTENT[key]
}

export const reorderArray = (array, atIdx) => array.map((_, idx) => array[(idx + atIdx) % array.length])

export const focusFirst = (elements) => {
  const { activeElement: prevActive } = document

  for (const element of elements) {
    if (element === prevActive) {
      return
    }

    element.focus()

    // eslint-disable-next-line unicorn/consistent-destructuring
    if (prevActive !== document.activeElement) {
      return
    }
  }
}
