import { unref } from 'vue'

import { isArray } from '../../../utils/index.js'

export const isTriggerType = (trigger, type) => {
  if (isArray(trigger)) {
    return trigger.includes(type)
  }

  return trigger === type
}

/**
 * @param {(evt: Event) => void} handler
 */
export const whenTrigger = (trigger, type, handler) => (evt) => {
  isTriggerType(unref(trigger), type) && handler(evt)
}
