import { isString, throwError } from '../../../../utils/index.js'
import { AUTO_ALIGNMENT, CENTERED_ALIGNMENT, END_ALIGNMENT, SMART_ALIGNMENT, START_ALIGNMENT } from '../defaults.js'
import { getIsHorizontal } from '../utils.js'

export const useFixedList = (props, itemsCount, totalSize) => {
  function getItemOffset(index) {
    return index * props.itemSize
  }

  function getItemSize() {
    return props.itemSize
  }

  function getOffset(index, alignment, scrollOffset) {
    const size = getIsHorizontal(props.layout) ? props.width : props.height

    if (isString(size)) {
      throwError(
        '[NVirtualList]',
        `
        Вы должны установить
          width/height
        для нумерации, когда ваш макет
          horizontal/vertical
        `,
      )
    }

    const lastItemOffset = Math.max(0, totalSize.value - size)

    const maxOffset = Math.min(lastItemOffset, index * props.itemSize)
    const minOffset = Math.max(0, (index + 1) * props.itemSize - size)

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
        // "Centered" смещение обычно представляет собой среднее значение минимального и максимального значений.
        // Но ближе к краям списка это не соответствует действительности.
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

  function getStartIndexForOffset(offset) {
    return Math.max(0, Math.min(itemsCount.value - 1, Math.floor(offset / props.itemSize)))
  }

  function getStopIndexForStartIndex(startIndex, scrollOffset) {
    const offset = startIndex * props.itemSize
    const size = getIsHorizontal(props.layout) ? props.width : props.height
    const numVisibleItems = Math.ceil((size + scrollOffset - offset) / props.itemSize)

    return Math.max(
      0,
      Math.min(
        itemsCount.value - 1,
        // потому что startIndex является инклюзивным, поэтому для предотвращения исходящей индексации массива
        // нам нужно - 1 для предотвращения исходящего поведения
        startIndex + numVisibleItems - 1,
      ),
    )
  }

  /**
   * Список фиксированного размера не нуждается в этом кеше
   */
  const initCache = () => {}
  const clearCache = true
  const validateProps = () => {}

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
