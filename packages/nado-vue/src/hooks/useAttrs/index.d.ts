import type { ComputedRef } from 'vue'

interface Params {
  excludeListeners?: boolean
  excludeKeys?: ComputedRef<string[]>
}

export const useAttrs: (params?: Params) => ComputedRef<Record<string, unknown>>
