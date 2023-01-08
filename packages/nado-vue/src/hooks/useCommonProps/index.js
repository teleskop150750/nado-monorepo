import { computed, inject, ref, unref } from 'vue'

import { componentSizes } from '../../constants/index.js'
import { formContextKey, formItemContextKey } from '../../tokens/index.js'
import { useProp } from '../useProp/index.js'

export const sizeProp = {
  type: String,
  default: '',
  validator(val) {
    return componentSizes.includes(val)
  },
}

/**
 * @param {import('@vueuse/core').MaybeRef<import('../../constants/size.js').ComponentSizes | undefined>} [fallback]
 * @param {Object} ignore
 * @returns {import('vue').ComputedRef<import('../../constants/size.js').ComponentSizes>}
 */
export const useSize = (fallback, ignore = {}) => {
  const emptyRef = ref(undefined)

  const size = ignore.prop ? emptyRef : useProp('size')
  const form = ignore.form ? { size: undefined } : inject(formContextKey, undefined)
  const formItem = ignore.formItem ? { size: undefined } : inject(formItemContextKey, undefined)

  return computed(() => size.value || unref(fallback) || formItem?.size || form?.size || 'default')
}

/**
 * @param {import('@vueuse/core').MaybeRef<boolean | undefined>} [fallback]
 * @returns {import('vue').ComputedRef<boolean>}
 */
export const useDisabled = (fallback) => {
  const disabled = useProp('disabled')
  const form = inject(formContextKey, undefined)

  return computed(() => disabled.value || unref(fallback) || form?.disabled || false)
}
