import { isFunction } from '@vue/shared'

import { isNumber, isUndefined, throwError } from '../../../../utils/index.js'
import { AUTO_ALIGNMENT, CENTERED_ALIGNMENT, END_ALIGNMENT, SMART_ALIGNMENT, START_ALIGNMENT } from '../defaults.js'

const { max, min, floor } = Math
const COMPONENT_NAME = 'NDynamicSizeGrid'
// generates props access key via type
const ACCESS_SIZER_KEY_MAP = {
  column: 'columnWidth',
  row: 'rowHeight',
}

// generates cache access key via type
const ACCESS_LAST_VISITED_KEY_MAP = {
  column: 'lastVisitedColumnIndex',
  row: 'lastVisitedRowIndex',
}

export const useDynamicGrid = (props, { rowsCount, columnsCount }, { totalWidth, totalHeight }) => {
  const ACCESS_ESTIMATED_SIZE_KEY_MAP = {
    column: totalWidth.value,
    row: totalHeight.value,
  }

  function getColumnPosition(idx, cache) {
    const item = getItemFromCache(idx, cache, 'column')

    return [item.size, item.offset]
  }

  function getRowPosition(idx, cache) {
    const item = getItemFromCache(idx, cache, 'row')

    return [item.size, item.offset]
  }

  function getColumnOffset(columnIndex, alignment, scrollLeft, cache, scrollBarWidth) {
    return getOffset(columnIndex, alignment, scrollLeft, cache, 'column', scrollBarWidth)
  }

  function getRowOffset(rowIndex, alignment, scrollTop, cache, scrollBarWidth) {
    return getOffset(rowIndex, alignment, scrollTop, cache, 'row', scrollBarWidth)
  }

  function getColumnStartIndexForOffset(scrollLeft, cache) {
    return findItem(cache, scrollLeft, 'column')
  }

  function getColumnStopIndexForStartIndex(startIndex, scrollLeft, cache) {
    const item = getItemFromCache(startIndex, cache, 'column')
    const maxOffset = scrollLeft + props.width
    let offset = item.offset + item.size
    let stopIndex = startIndex

    while (stopIndex < columnsCount.value - 1 && offset < maxOffset) {
      stopIndex += 1
      offset += getItemFromCache(startIndex, cache, 'column').size
    }

    return stopIndex
  }

  function getRowStartIndexForOffset(scrollTop, cache) {
    return findItem(cache, scrollTop, 'row')
  }

  function getRowStopIndexForStartIndex(startIndex, scrollTop, cache) {
    const { height } = props
    const item = getItemFromCache(startIndex, cache, 'row')
    const maxOffset = scrollTop + height
    let offset = item.size + item.offset
    let stopIndex = startIndex

    while (stopIndex < rowsCount.value - 1 && offset < maxOffset) {
      stopIndex += 1
      offset += getItemFromCache(stopIndex, cache, 'row').size
    }

    return stopIndex
  }

  function injectToInstance(instance, cache) {
    const resetAfter = ({ columnIndex, rowIndex }, forceUpdate) => {
      forceUpdate = isUndefined(forceUpdate) ? true : forceUpdate

      if (isNumber(columnIndex)) {
        cache.value.lastVisitedColumnIndex = Math.min(cache.value.lastVisitedColumnIndex, columnIndex - 1)
      }

      if (isNumber(rowIndex)) {
        cache.value.lastVisitedRowIndex = Math.min(cache.value.lastVisitedRowIndex, rowIndex - 1)
      }

      instance.exposed?.getItemStyleCache.value(-1, null, null)

      if (forceUpdate) {
        instance.proxy?.$forceUpdate()
      }
    }
    const resetAfterColumnIndex = (columnIndex, forceUpdate) => {
      // @ts-ignore
      resetAfter({ columnIndex }, forceUpdate)
    }
    const resetAfterRowIndex = (rowIndex, forceUpdate) => {
      // @ts-ignore
      resetAfter({ rowIndex }, forceUpdate)
    }

    Object.assign(instance.proxy, {
      resetAfterColumnIndex,
      resetAfterRowIndex,
      resetAfter,
    })
  }

  function initCache() {
    const cache = {
      column: {},
      estimatedColumnWidth: totalHeight.value / rowsCount.value,
      estimatedRowHeight: totalWidth.value / columnsCount.value,
      lastVisitedColumnIndex: -1,
      lastVisitedRowIndex: -1,
      row: {},
    }

    // TODO: expose methods.
    return cache
  }

  const clearCache = false

  function validateProps() {
    if (!isFunction(props.columnWidth)) {
      throwError(
        COMPONENT_NAME,
        `
          "columnWidth" must be passed as function,
            instead ${typeof props.columnWidth} was given.
        `,
      )
    }

    if (!isFunction(props.rowHeight)) {
      throwError(
        COMPONENT_NAME,
        `
          "rowHeight" must be passed as function,
            instead ${typeof props.rowHeight} was given.
        `,
      )
    }
  }

  // =============================
  function getItemFromCache(index, gridCache, type) {
    const [cachedItems, sizer, lastVisited] = [
      gridCache[type],
      props[ACCESS_SIZER_KEY_MAP[type]],
      gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]],
    ]

    if (index > lastVisited) {
      let offset = 0

      if (lastVisited >= 0) {
        const item = cachedItems[lastVisited]

        offset = item.offset + item.size
      }

      for (let i = lastVisited + 1; i <= index; i++) {
        const size = sizer(i)

        cachedItems[i] = {
          offset,
          size,
        }
        offset += size
      }

      gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]] = index
    }

    return cachedItems[index]
  }

  function bs(gridCache, low, high, offset, type) {
    while (low <= high) {
      const mid = low + floor((high - low) / 2)
      const currentOffset = getItemFromCache(mid, gridCache, type).offset

      if (currentOffset === offset) {
        return mid
      }

      if (currentOffset < offset) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    return max(0, low - 1)
  }

  function es(gridCache, idx, offset, type) {
    const total = type === 'column' ? columnsCount.value : rowsCount.value
    let exponent = 1

    while (idx < total && getItemFromCache(idx, gridCache, type).offset < offset) {
      idx += exponent
      exponent *= 2
    }

    return bs(gridCache, floor(idx / 2), min(idx, total - 1), offset, type)
  }

  function findItem(gridCache, offset, type) {
    const [cache, lastVisitedIndex] = [gridCache[type], gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]]]
    const lastVisitedItemOffset = lastVisitedIndex > 0 ? cache[lastVisitedIndex].offset : 0

    if (lastVisitedItemOffset >= offset) {
      return bs(gridCache, 0, lastVisitedIndex, offset, type)
    }

    return es(gridCache, max(0, lastVisitedIndex), offset, type)
  }

  function getOffset(index, alignment, scrollOffset, cache, type, scrollBarWidth) {
    const [size, estimatedSizeAssociates] = [
      type === 'row' ? props.height : props.width,
      ACCESS_ESTIMATED_SIZE_KEY_MAP[type],
    ]
    const item = getItemFromCache(index, cache, type)
    const estimatedSize = estimatedSizeAssociates(cache)
    const maxOffset = max(0, min(estimatedSize - size, item.offset))
    const minOffset = max(0, item.offset - size + scrollBarWidth + item.size)

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
        return Math.round(minOffset + (maxOffset - minOffset) / 2)
      }
      // case AUTO_ALIGNMENT:
      default: {
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset
        }

        if (minOffset > maxOffset) {
          return minOffset
        }

        if (scrollOffset < minOffset) {
          return minOffset
        }

        return maxOffset
      }
    }
  }

  return {
    clearCache,
    getColumnPosition,
    getColumnStartIndexForOffset,
    getColumnStopIndexForStartIndex,
    getColumnOffset,
    getRowOffset,
    getRowPosition,
    getRowStartIndexForOffset,
    getRowStopIndexForStartIndex,
    initCache,
    injectToInstance,
    validateProps,
  }
}
