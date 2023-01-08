import { isClient } from '@vueuse/core'

import { isElement } from '../../utils/index.js'

const nodeList = new Map()

let startClick

if (isClient) {
  document.addEventListener('mousedown', (evt) => {
    startClick = evt
  })
  document.addEventListener('mouseup', (evt) => {
    for (const handlers of nodeList.values()) {
      for (const { documentHandler } of handlers) {
        documentHandler(evt, startClick)
      }
    }
  })
}

/**
 *
 * @param {HTMLElement} el
 * @param {import('vue').DirectiveBinding} binding
 */
function createDocumentHandler(el, binding) {
  /**
   * @type {HTMLElement[]}
   */
  let excludes = []

  if (Array.isArray(binding.arg)) {
    excludes = binding.arg
  } else if (isElement(binding.arg)) {
    // из-за текущей реализации тип привязки неверен, здесь необходимо приведение типа
    // @ts-ignore
    excludes.push(binding.arg)
  }

  return function innerFun(mouseup, mousedown) {
    // @ts-ignore
    const { popperRef } = binding.instance
    const mouseUpTarget = mouseup.target
    const mouseDownTarget = mousedown?.target
    const isBound = !binding || !binding.instance
    const isTargetExists = !mouseUpTarget || !mouseDownTarget
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget

    const isTargetExcluded =
      excludes.some((item) => item?.contains(mouseUpTarget)) ||
      (excludes.length > 0 && excludes.includes(mouseDownTarget))
    const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget))

    if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
      return
    }

    binding.value(mouseup, mousedown)
  }
}

/**
 * @type {import('vue').ObjectDirective}
 */
export const ClickOutside = {
  /**
   *
   * @param {HTMLElement} el
   * @param {import('vue').DirectiveBinding} binding
   */
  beforeMount(el, binding) {
    // у элемента может быть несколько обработчиков
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }

    nodeList.get(el).push({
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    })
  },

  /**
   * @param {HTMLElement} el
   * @param {import('vue').DirectiveBinding} binding
   */
  updated(el, binding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }

    const handlers = nodeList.get(el)
    const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue)
    const newHandler = {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    }

    if (oldHandlerIndex >= 0) {
      // replace the old handler to the new handler
      handlers.splice(oldHandlerIndex, 1, newHandler)
    } else {
      handlers.push(newHandler)
    }
  },

  /**
   * @param {HTMLElement} el
   */
  unmounted(el) {
    // удалите все прослушиватели, когда компонент размонтирован
    nodeList.delete(el)
  },
}
