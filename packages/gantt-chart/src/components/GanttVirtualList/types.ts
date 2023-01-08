import type { ComponentInternalInstance } from 'vue'

export type Instance = ComponentInternalInstance

export type Alignment = 'auto' | 'smart' | 'center' | 'start' | 'end'
export type ItemSize = (idx: number) => number
export type Direction = 'ltr' | 'rtl'
export type LayoutDirection = 'horizontal' | 'vertical'
export type RTLOffsetType = 'negative' | 'positive-descending' | 'positive-ascending'

export interface ListItem {
  offset: number
  size: number
}

export interface ListCache {
  items: Record<string, ListItem>
  // estimatedItemSize: number
  lastVisitedIndex: number
  clearCacheAfterIndex: (idx: number, forceUpdate?: boolean) => void
}

export type InitCacheFunc<T, P> = (props: T, cache: Instance) => P
export type InitListCacheFunc<T> = InitCacheFunc<T, ListCache>
