import type { Ref } from 'vue'

export type CollectionItem<T = Record<string, any>> = {
  [x: string]: unknown
  focusable: unknown
  focusable: unknown
  active: unknown
  id: string
  [x: string]: unknown
  ref: HTMLElement | null
} & T

export type NCollectionInjectionContext = {
  itemMap: Map<HTMLElement, CollectionItem>
  getItems: <T>() => CollectionItem<T>[]
  collectionRef: Ref<HTMLElement | null>
}

export type NCollectionItemInjectionContext = {
  collectionItemRef: Ref<HTMLElement | null>
}
