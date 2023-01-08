import { throwError } from '../../../../utils/index.js'
import { AUTO_ALIGNMENT, CENTERED_ALIGNMENT, END_ALIGNMENT, SMART_ALIGNMENT, START_ALIGNMENT } from '../defaults.js'
import { getIsHorizontal } from '../utils.js'

const COMPONENT_NAME = 'NDynamicSizeList'

export const useDynamicList = (props, itemsCount, totalSize) => {
  function getItemOffset(index, listCache) {
    return getItemFromCache(index, listCache).offset
  }

  function getItemSize(index, { items }) {
    return items[index].size
  }

  function getOffset(index, alignment, scrollOffset, listCache) {
    const { height, layout, width } = props
    const size = getIsHorizontal(layout) ? width : height
    const item = getItemFromCache(index, listCache)
    const lastItemOffset = Math.max(0, totalSize.value - size)

    const maxOffset = Math.max(0, Math.min(lastItemOffset, item.offset))
    const minOffset = Math.max(0, item.offset - size + item.size)

    if (alignment === SMART_ALIGNMENT) {
      alignment =
        scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size ? AUTO_ALIGNMENT : CENTERED_ALIGNMENT
    }

    switch (alignment) {
      case START_ALIGNMENT: {
        return maxOffset
      }
      case END_ALIGNMENT: {
        return minOffset
      }
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2)

        if (middleOffset < Math.ceil(size / 2)) {
          return 0 // ближе к началу
        }

        if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset // ближе к конце
        }

        return middleOffset
      }
      // case AUTO_ALIGNMENT:
      default: {
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset
        }

        if (scrollOffset < minOffset) {
          return minOffset
        }

        return maxOffset
      }
    }
  }

  function getStartIndexForOffset(offset, listCache) {
    return findItem(listCache, offset, itemsCount.value)
  }

  function getStopIndexForStartIndex(startIndex, scrollOffset, listCache) {
    const size = getIsHorizontal(props.layout) ? props.width : props.height
    const item = getItemFromCache(startIndex, listCache)
    const maxOffset = scrollOffset + size

    let offset = item.offset + item.size
    let stopIndex = startIndex

    while (stopIndex < itemsCount.value - 1 && offset < maxOffset) {
      stopIndex += 1
      offset += getItemFromCache(stopIndex, listCache).size
    }

    return stopIndex
  }

  function initCache(instance) {
    const cache = {
      items: {},
      lastVisitedIndex: -1,
    }

    cache.clearCacheAfterIndex = (index, forceUpdate = true) => {
      cache.lastVisitedIndex = Math.min(cache.lastVisitedIndex, index - 1)
      instance.exposed?.getItemStyleCache(-1)

      if (forceUpdate) {
        instance.proxy?.$forceUpdate()
      }
    }

    getItemFromCache(Math.min(50, itemsCount.value - 1), cache)

    return cache
  }

  const clearCache = false

  function validateProps() {
    if (import.meta.env.PROD && typeof props.itemSize !== 'function') {
      throwError(
        COMPONENT_NAME,
        `
          itemSize is required as function, but the given value was ${typeof props.itemSize}
        `,
      )
    }
  }

  // =========================
  function getItemFromCache(index, listCache) {
    const { items, lastVisitedIndex } = listCache

    if (index > lastVisitedIndex) {
      let offset = 0

      if (lastVisitedIndex >= 0) {
        const item = items[lastVisitedIndex]

        offset = item.offset + item.size
      }

      for (let i = lastVisitedIndex + 1; i <= index; i++) {
        const size = props.itemSize(i)

        items[i] = {
          offset,
          size,
        }
        offset += size
      }

      listCache.lastVisitedIndex = index
    }

    return items[index]
  }

  function findItem(listCache, offset, total) {
    const { items, lastVisitedIndex } = listCache
    const lastVisitedOffset = lastVisitedIndex > 0 ? items[lastVisitedIndex].offset : 0

    if (lastVisitedOffset >= offset) {
      return bs(listCache, 0, lastVisitedIndex, offset)
    }

    return es(listCache, Math.max(0, lastVisitedIndex), offset, total)
  }

  // bs означает двоичный поиск, который имеет приблизительно временную сложность O (Log n)
  // пространственная сложность O(1)
  // в этом случае мы используем его для поиска смещения каждого элемента, поскольку
  // смещение кэшированных элементов монотонно увеличивается
  function bs(listCache, low, high, offset) {
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2)
      const currentOffset = getItemFromCache(mid, listCache).offset

      if (currentOffset === offset) {
        return mid
      }

      if (currentOffset < offset) {
        low = mid + 1
      } else if (currentOffset > offset) {
        high = mid - 1
      }
    }

    return Math.max(0, low - 1)
  }

  // es означает экспоненциальный поиск, который имеет временную сложность O (Log n) и
  // пространственную сложность O (1) в случае нахождения граничного элемента.
  // экспоненциальный показатель в данном случае равен 2.
  // для получения более подробной информации об экспоненциальном поиске перейдите по этой ссылке
  // https://www.freecodecamp.org/news/search-algorithms-exponential-search-explained/
  function es(listCache, index, offset, total) {
    let exponent = 1

    while (index < total && getItemFromCache(index, listCache).offset < offset) {
      index += exponent
      exponent *= 2
    }

    return bs(listCache, Math.floor(index / 2), Math.min(index, total - 1), offset)
  }

  return {
    getItemOffset,
    getItemSize,
    getOffset,
    getStartIndexForOffset,
    getStopIndexForStartIndex,
    initCache,
    clearCache,
    validateProps,
  }
}
