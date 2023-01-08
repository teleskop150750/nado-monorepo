import { isClient } from '@vueuse/core'
import { onBeforeMount } from 'vue'

import { generateId } from '../../utils/index.js'
import { defaultNamespace } from '../useNamespace/index.js'

/** @type {HTMLElement} */
let cachedContainer

const namespace = defaultNamespace

export const POPPER_CONTAINER_ID = `${namespace}-popper-container-${generateId()}`

export const POPPER_CONTAINER_SELECTOR = `#${POPPER_CONTAINER_ID}`

const createContainer = () => {
  const container = document.createElement('div')

  container.id = POPPER_CONTAINER_ID
  document.body.append(container)

  return container
}

export const usePopperContainer = () => {
  onBeforeMount(() => {
    if (!isClient) {
      return
    }

    // Это делается для обхода ошибки, с которой мы часто сталкиваемся при тестировании env
    // document.body.innerHTML = '' situation
    // для этого нам нужно отключить кэширование, так как оно на самом деле не нужно
    if (
      // @ts-ignore
      process.env.NODE_ENV === 'test' ||
      !cachedContainer ||
      !document.body.querySelector(POPPER_CONTAINER_SELECTOR)
    ) {
      cachedContainer = createContainer()
    }
  })
}
