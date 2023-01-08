import { isNumber, throwError } from '../../../../utils/index.js'
import { AUTO_ALIGNMENT, CENTERED_ALIGNMENT, END_ALIGNMENT, SMART_ALIGNMENT, START_ALIGNMENT } from '../defaults.js'

const COMPONENT_NAME = 'NFixedSizeGrid'

export const useFixedGrid = (props, { rowsCount, columnsCount }) => {
  function getColumnPosition(index) {
    return [props.columnWidth, index * props.columnWidth]
  }

  function getRowPosition(index) {
    return [props.rowHeight, index * props.rowHeight]
  }

  // function getEstimatedTotalHeight() {
  //   return props.rowHeight * rowsCount.value
  // }

  // function getEstimatedTotalWidth() {
  //   return props.columnWidth * columnsCount.value
  // }

  function getColumnOffset(columnIndex, alignment, scrollLeft, _, scrollBarWidth) {
    const width = Number(props.width)
    const lastColumnOffset = Math.max(0, columnsCount.value * props.columnWidth - width)
    const maxOffset = Math.min(lastColumnOffset, columnIndex * props.columnWidth)
    const minOffset = Math.max(0, columnIndex * props.columnWidth - width + scrollBarWidth + props.columnWidth)

    if (alignment === 'smart') {
      alignment =
        scrollLeft >= minOffset - width && scrollLeft <= maxOffset + width ? AUTO_ALIGNMENT : CENTERED_ALIGNMENT
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

        if (middleOffset < Math.ceil(width / 2)) {
          return 0
        }

        if (middleOffset > lastColumnOffset + Math.floor(width / 2)) {
          return lastColumnOffset
        }

        return middleOffset
      }
      // case AUTO_ALIGNMENT:
      default: {
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft
        }

        if (minOffset > maxOffset) {
          return minOffset
        }

        if (scrollLeft < minOffset) {
          return minOffset
        }

        return maxOffset
      }
    }
  }

  function getRowOffset(rowIndex, align, scrollTop, _, scrollBarWidth) {
    const height = Number(props.height)
    const lastRowOffset = Math.max(0, rowsCount.value * props.rowHeight - height)
    const maxOffset = Math.min(lastRowOffset, rowIndex * props.rowHeight)
    const minOffset = Math.max(0, rowIndex * props.rowHeight - height + scrollBarWidth + props.rowHeight)

    if (align === SMART_ALIGNMENT) {
      align = scrollTop >= minOffset - height && scrollTop <= maxOffset + height ? AUTO_ALIGNMENT : CENTERED_ALIGNMENT
    }

    switch (align) {
      case START_ALIGNMENT: {
        return maxOffset
      }
      case END_ALIGNMENT: {
        return minOffset
      }
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2)

        if (middleOffset < Math.ceil(height / 2)) {
          return 0
        }

        if (middleOffset > lastRowOffset + Math.floor(height / 2)) {
          return lastRowOffset
        }

        return middleOffset
      }
      // case AUTO_ALIGNMENT:
      default: {
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop
        }

        if (minOffset > maxOffset) {
          return minOffset
        }

        if (scrollTop < minOffset) {
          return minOffset
        }

        return maxOffset
      }
    }
  }

  function getColumnStartIndexForOffset(scrollLeft) {
    return Math.max(0, Math.min(columnsCount.value - 1, Math.floor(scrollLeft / props.columnWidth)))
  }

  function getColumnStopIndexForStartIndex(startIndex, scrollLeft) {
    const left = startIndex * props.columnWidth
    const visibleColumnsCount = Math.ceil((props.width + scrollLeft - left) / props.columnWidth)

    return Math.max(0, Math.min(columnsCount.value - 1, startIndex + visibleColumnsCount - 1))
  }

  function getRowStartIndexForOffset(scrollTop) {
    return Math.max(0, Math.min(rowsCount.value - 1, Math.floor(scrollTop / props.rowHeight)))
  }

  function getRowStopIndexForStartIndex(startIndex, scrollTop) {
    const top = startIndex * props.rowHeight
    const numVisibleRows = Math.ceil((props.height + scrollTop - top) / props.rowHeight)

    // -1 потому что стоп-индекс включен
    return Math.max(0, Math.min(rowsCount.value - 1, startIndex + numVisibleRows - 1))
  }

  const initCache = () => {}

  const injectToInstance = () => {}

  const clearCache = true

  function validateProps() {
    if (!isNumber(props.columnWidth)) {
      throwError(
        COMPONENT_NAME,
        `
          "columnWidth" must be passed as number,
            instead ${typeof props.columnWidth} was given.
        `,
      )
    }

    if (!isNumber(props.rowHeight)) {
      throwError(
        COMPONENT_NAME,
        `
          "columnWidth" must be passed as number,
            instead ${typeof props.rowHeight} was given.
        `,
      )
    }
  }

  return {
    clearCache,
    getColumnPosition,
    getColumnStartIndexForOffset,
    getColumnStopIndexForStartIndex,
    // getEstimatedTotalHeight,
    // getEstimatedTotalWidth,
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
