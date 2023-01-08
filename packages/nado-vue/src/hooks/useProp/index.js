import { computed } from 'vue'

import { getCurrentInstance } from '../getCurrentInstance/index.js'

/**
 * @template T
 * @param {string} name
 * @returns {import('vue').ComputedRef<T | undefined>}
 */
export const useProp = (name) => {
  const vm = getCurrentInstance('useProp')

  return computed(() => {
    if (!vm.proxy) {
      return undefined
    }

    return vm.proxy.$props[name] ?? undefined
  })
}
