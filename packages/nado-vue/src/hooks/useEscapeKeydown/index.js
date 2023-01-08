import { isClient } from '@vueuse/core'
import { onBeforeUnmount, onMounted } from 'vue'

import { EVENT_CODE } from '../../constants/aria.js'

/**
 * @type {((evt: KeyboardEvent) => void)[]}
 */
let registeredEscapeHandlers = []

/**
 * @param {KeyboardEvent} evt
 */
const cachedHandler = (evt) => {
  const event = evt

  if (event.key === EVENT_CODE.esc) {
    registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event))
  }
}

/**
 * @param {(evt: KeyboardEvent) => void} handler
 */
export const useEscapeKeydown = (handler) => {
  onMounted(() => {
    if (registeredEscapeHandlers.length === 0) {
      document.addEventListener('keydown', cachedHandler)
    }

    if (isClient) {
      registeredEscapeHandlers.push(handler)
    }
  })

  onBeforeUnmount(() => {
    registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler)

    if (registeredEscapeHandlers.length === 0 && isClient) {
      document.removeEventListener('keydown', cachedHandler)
    }
  })
}
