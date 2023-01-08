import { computed } from 'vue'

import { getCurrentInstance } from '../getCurrentInstance/index.js'

const DEFAULT_EXCLUDE_KEYS = ['class', 'style']
const LISTENER_PREFIX = /^on[A-Z]/

/**
 * @typedef {Object} Params
 * @property {boolean} [excludeListeners]
 * @property {import('vue').ComputedRef<string[]>} [excludeKeys]
 */

/**
 * @param {?Params} params
 */
export const useAttrs = (params = {}) => {
  const { excludeListeners = false, excludeKeys } = params
  /** @type {import('vue').ComputedRef<string[]>} */
  const allExcludeKeys = computed(() => [...(excludeKeys?.value || []), ...DEFAULT_EXCLUDE_KEYS])

  const instance = getCurrentInstance('useAttrs')

  if (!instance) {
    return computed(() => ({}))
  }

  return computed(() =>
    Object.fromEntries(
      Object.entries(instance.proxy?.$attrs).filter(
        ([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key)),
      ),
    ),
  )
}
