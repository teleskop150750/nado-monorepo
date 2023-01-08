import { onBeforeUnmount, onMounted, ref } from 'vue'

import { FOCUSOUT_PREVENTED, FOCUSOUT_PREVENTED_OPTS } from './tokens.js'

const focusReason = ref()
const lastUserFocusTimestamp = ref(0)
const lastAutomatedFocusTimestamp = ref(0)
let focusReasonUserCount = 0

/**
 * @param {HTMLElement} element
 * @returns {HTMLElement[]}
 */
export const getAllFocusableElements = (element) => {
  const nodes = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    /**
     * @param {Element & {
     *  disabled: boolean
     *  hidden: boolean
     *  type: string
     *  tabIndex: number
     * }} node
     */
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden'

      if (node.disabled || node.hidden || isHiddenInput) {
        return NodeFilter.FILTER_SKIP
      }

      return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })

  while (walker.nextNode()) {
    nodes.push(walker.currentNode)
  }

  // @ts-ignore
  return nodes
}

function isVisible(element) {
  if (getComputedStyle(element).visibility === 'hidden') {
    return false
  }

  if (element.offsetWidth || element.offsetHeight || element.getClientRects().length > 0) {
    return true
  }

  return false
}

/**
 * @param {HTMLElement} element
 */
export function isHidden(element) {
  // @ts-ignore
  // if (process.env.NODE_ENV === 'test') {
  //   return false
  // }
  return !isVisible(element)
}

/**
 * @param {HTMLElement[]} elements
 * @returns
 */
export const getVisibleElement = (elements) => {
  for (const element of elements) {
    if (!isHidden(element)) {
      return element
    }
  }
}

/**
 * @param {HTMLElement} container
 */
export const getEdges = (container) => {
  const focusable = getAllFocusableElements(container)
  const first = getVisibleElement(focusable)
  const last = getVisibleElement(focusable.reverse())

  return [first, last]
}

const isSelectable = (element) => element instanceof HTMLInputElement && 'select' in element

/**
 * @param {HTMLElement | { focus: () => void } | null} [element]
 * @param {boolean} [shouldSelect]
 */
export const tryFocus = (element, shouldSelect) => {
  if (element && element.focus) {
    const prevFocusedElement = document.activeElement

    element.focus({ preventScroll: true })
    lastAutomatedFocusTimestamp.value = window.performance.now()

    if (element !== prevFocusedElement && shouldSelect && isSelectable(element)) {
      // @ts-ignore
      element.select()
    }
  }
}

/**
 * @template T
 * @param {T[]} list
 * @param {T} item
 * @returns
 */
function removeFromStack(list, item) {
  const copy = [...list]

  const idx = list.indexOf(item)

  if (idx !== -1) {
    copy.splice(idx, 1)
  }

  return copy
}

const createFocusableStack = () => {
  let stack = []

  const push = (layer) => {
    const currentLayer = stack[0]

    if (currentLayer && layer !== currentLayer) {
      currentLayer.pause()
    }

    stack = removeFromStack(stack, layer)
    stack.unshift(layer)
  }

  const remove = (layer) => {
    stack = removeFromStack(stack, layer)
    stack[0]?.play?.()
  }

  return {
    push,
    remove,
  }
}

/**
 * @param {HTMLElement[]} elements
 * @param {boolean} [shouldSelect]
 */
export const focusFirstDescendant = (elements, shouldSelect = false) => {
  const prevFocusedElement = document.activeElement

  for (const element of elements) {
    tryFocus(element, shouldSelect)

    if (document.activeElement !== prevFocusedElement) {
      return
    }
  }
}

export const focusableStack = createFocusableStack()

export const isFocusCausedByUserEvent = () => lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value

const notifyFocusReasonPointer = () => {
  focusReason.value = 'pointer'
  lastUserFocusTimestamp.value = window.performance.now()
}

const notifyFocusReasonKeydown = () => {
  focusReason.value = 'keyboard'
  lastUserFocusTimestamp.value = window.performance.now()
}

export const useFocusReason = () => {
  onMounted(() => {
    if (focusReasonUserCount === 0) {
      document.addEventListener('mousedown', notifyFocusReasonPointer)
      document.addEventListener('touchstart', notifyFocusReasonPointer)
      document.addEventListener('keydown', notifyFocusReasonKeydown)
    }

    focusReasonUserCount += 1
  })

  onBeforeUnmount(() => {
    focusReasonUserCount -= 1

    if (focusReasonUserCount <= 0) {
      document.removeEventListener('mousedown', notifyFocusReasonPointer)
      document.removeEventListener('touchstart', notifyFocusReasonPointer)
      document.removeEventListener('keydown', notifyFocusReasonKeydown)
    }
  })

  return {
    focusReason,
    lastUserFocusTimestamp,
    lastAutomatedFocusTimestamp,
  }
}

export const createFocusOutPreventedEvent = (detail) =>
  new CustomEvent(FOCUSOUT_PREVENTED, {
    ...FOCUSOUT_PREVENTED_OPTS,
    detail,
  })
