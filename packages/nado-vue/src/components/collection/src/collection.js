import { inject, onBeforeUnmount, onMounted, provide, ref, unref } from 'vue'

import Collection from './NCollection.vue'
import CollectionItem from './NCollectionItem.vue'

export const COLLECTION_ITEM_SIGN = 'data-n-collection-item'

// Убедитесь, что первая буква имени написана с заглавной буквы
/**
 * @param {string} name
 */
export const createCollectionWithScope = (name) => {
  const COLLECTION_NAME = `N${name}Collection`
  const COLLECTION_ITEM_NAME = `${COLLECTION_NAME}Item`
  /** @type {import('vue').InjectionKey<import('./tokens.js').NCollectionInjectionContext>}  */
  const COLLECTION_INJECTION_KEY = Symbol(COLLECTION_NAME)
  /** @type {import('vue').InjectionKey<import('./tokens.js').NCollectionItemInjectionContext>}  */
  const COLLECTION_ITEM_INJECTION_KEY = Symbol(COLLECTION_ITEM_NAME)

  const NCollection = {
    ...Collection,
    name: COLLECTION_NAME,
    setup() {
      const collectionRef = ref(undefined)
      /** @type {import('./tokens.js').NCollectionInjectionContext['itemMap']} */
      const itemMap = new Map()

      const getItems = () => {
        const collectionEl = unref(collectionRef)

        if (!collectionEl) {
          return []
        }

        const orderedNodes = [...collectionEl.querySelectorAll(`[${COLLECTION_ITEM_SIGN}]`)]

        const items = [...itemMap.values()]

        return items.sort((a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref))
      }

      provide(COLLECTION_INJECTION_KEY, {
        itemMap,
        getItems,
        collectionRef,
      })
    },
  }

  const NCollectionItem = {
    ...CollectionItem,
    name: COLLECTION_ITEM_NAME,
    setup(_, { attrs }) {
      const collectionItemRef = ref(undefined)
      const collectionInjection = inject(COLLECTION_INJECTION_KEY, undefined)

      provide(COLLECTION_ITEM_INJECTION_KEY, {
        collectionItemRef,
      })

      onMounted(() => {
        const collectionItemEl = unref(collectionItemRef)

        if (collectionItemEl) {
          collectionInjection.itemMap.set(collectionItemEl, {
            ref: collectionItemEl,
            ...attrs,
          })
        }
      })

      onBeforeUnmount(() => {
        const collectionItemEl = unref(collectionItemRef)

        collectionInjection.itemMap.delete(collectionItemEl)
      })
    },
  }

  return {
    COLLECTION_INJECTION_KEY,
    COLLECTION_ITEM_INJECTION_KEY,
    NCollection,
    NCollectionItem,
  }
}
