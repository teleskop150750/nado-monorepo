import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const defaultMenu = [
    {
      id: 'Indefinite',
      name: 'Неразобранные',
      type: 'INDEFINITE',
      parentId: null,
    },
    {
      id: 'Executor',
      name: 'Я исполнитель',
      type: 'EXECUTOR',
      parentId: null,
    },
    {
      id: 'Author',
      name: 'Я автор',
      type: 'AUTHOR',
      parentId: null,
    },
    {
      id: 'All',
      name: 'Все',
      type: 'ALL',
      parentId: null,
    },
    {
      id: 'USER',
      name: 'Личное',
      type: 'ROOT_USER',
      parentId: null,
    },
    {
      id: 'SHARED',
      name: 'Доступные',
      type: 'ROOT_SHARED',
      parentId: null,
    },
  ]
  const userFolders = ref([])
  const menu = computed(() => {
    const items = [...userFolders.value, ...defaultMenu].filter((el) => ('type' in el ? el.type !== 'ROOT' : true))
    const hashTable = {}
    const result = []

    items.forEach((item) => {
      hashTable[item.id] = item
      hashTable[item.id].children = []
    })

    Object.values(hashTable).forEach((hashItem) => {
      const parentId = hashItem.parentId || null

      if (!Object.hasOwn(hashTable, parentId)) {
        // hashItem.parentId = null
        result.push(hashItem)
      } else {
        hashTable[parentId].children.push(hashItem)
      }
    })

    return result
  })

  function getMenu() {
    return menu
  }

  function setUserFolders(payload) {
    userFolders.value = payload
  }

  return {
    getMenu,
    setUserFolders,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
