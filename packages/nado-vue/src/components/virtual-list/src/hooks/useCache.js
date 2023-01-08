import { memoize } from 'lodash-unified'
import memoOne from 'memoize-one'
import { computed, getCurrentInstance } from 'vue'

export const useCache = () => {
  const vm = getCurrentInstance()

  const props = vm.proxy.$props

  return computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _getItemStyleCache = (_, __, ___) => ({})

    // @ts-ignore
    return props.perfMode ? memoize(_getItemStyleCache) : memoOne(_getItemStyleCache)
  })
}
