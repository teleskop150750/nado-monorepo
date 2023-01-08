<script setup>
import { isClient } from '@vueuse/core'
import { debounce } from 'lodash-unified'
import { computed, getCurrentInstance, nextTick, onMounted, ref, resolveDynamicComponent, unref } from 'vue'

// import { useGridWheel } from '../hooks/use-grid-wheel.js'
import { useNamespace } from '../../../hooks/index.js'
import { getScrollBarWidth, hasOwn, isFunction, isNumber } from '../../../utils/index.js'
import {
  AUTO_ALIGNMENT,
  BACKWARD,
  FORWARD,
  ITEM_RENDER_EVT,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  RTL_OFFSET_POS_DESC,
  SCROLL_EVT,
} from './defaults.js'
import { useCache } from './hooks/useCache.js'
import { useDynamicGrid } from './hooks/useDynamicGrid.js'
import { useFixedGrid } from './hooks/useFixedGrid.js'
import NVirtualScrollbar from './NVirtualScrollbar.vue'
import { virtualizedGridProps } from './props.js'
import { getRTLOffsetType, getScrollDir, isRTL } from './utils.js'

const props = defineProps(virtualizedGridProps)

const emit = defineEmits([ITEM_RENDER_EVT, SCROLL_EVT])

defineOptions({
  name: 'NVirtualGrid',
})

const ns = useNamespace('virtual-list')
const rowsCount = computed(() => {
  if (props.totalRow !== undefined) {
    return props.totalRow
  }

  return props.data.length
})

const columnsCount = computed(() => {
  if (rowsCount.value === 0) {
    return 0
  }

  if (props.totalColumn !== undefined) {
    return props.totalColumn
  }

  // @ts-ignore
  return props.data && props.data[0] ? props.data[0].length : 0
})

const { totalHeight, totalWidth } = getTotalSize()

const {
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
} = isFunction(props.columnWidth)
  ? useDynamicGrid(props, { columnsCount, rowsCount }, { totalWidth, totalHeight })
  : useFixedGrid(props, { columnsCount, rowsCount })

validateProps()
const instance = getCurrentInstance()
const cache = ref(initCache())

injectToInstance(instance, cache)
// ссылки
// здесь windowRef и innerRef могут быть типом HTMLElement
// или определенный пользователем тип компонента, зависит от переданного типа
// пользователем
const containerRef = ref()
const hScrollbar = ref()
const vScrollbar = ref()
// innerRef является фактическим элементом контейнера, который содержит все элементы
const innerRef = ref(null)
const states = ref({
  isScrolling: false,
  scrollLeft: isNumber(props.initScrollLeft) ? props.initScrollLeft : 0,
  scrollTop: isNumber(props.initScrollTop) ? props.initScrollTop : 0,
  updateRequested: false,
  xAxisScrollDir: FORWARD,
  yAxisScrollDir: FORWARD,
})
const getItemStyleCache = useCache()
// computed
const parsedHeight = computed(() => Number.parseInt(`${props.height}`))
const parsedWidth = computed(() => Number.parseInt(`${props.width}`))
const columnsToRender = computed(() => {
  const { columnCache } = props
  const { isScrolling, xAxisScrollDir, scrollLeft } = unref(states)

  if (columnsCount.value === 0 || rowsCount.value === 0) {
    return [0, 0, 0, 0]
  }

  const startIndex = getColumnStartIndexForOffset(scrollLeft, unref(cache))
  const stopIndex = getColumnStopIndexForStartIndex(startIndex, scrollLeft, unref(cache))
  const cacheBackward = !isScrolling || xAxisScrollDir === BACKWARD ? Math.max(1, columnCache) : 1
  const cacheForward = !isScrolling || xAxisScrollDir === FORWARD ? Math.max(1, columnCache) : 1

  return [
    Math.max(0, startIndex - cacheBackward),
    Math.max(0, Math.min(columnsCount.value - 1, stopIndex + cacheForward)),
    startIndex,
    stopIndex,
  ]
})
const rowsToRender = computed(() => {
  const { rowCache } = props
  const { isScrolling, yAxisScrollDir, scrollTop } = unref(states)

  if (columnsCount.value === 0 || rowsCount.value === 0) {
    return [0, 0, 0, 0]
  }

  const startIndex = getRowStartIndexForOffset(scrollTop, unref(cache))
  const stopIndex = getRowStopIndexForStartIndex(startIndex, scrollTop, unref(cache))
  const cacheBackward = !isScrolling || yAxisScrollDir === BACKWARD ? Math.max(1, rowCache) : 1
  const cacheForward = !isScrolling || yAxisScrollDir === FORWARD ? Math.max(1, rowCache) : 1

  return [
    Math.max(0, startIndex - cacheBackward),
    Math.max(0, Math.min(rowsCount.value - 1, stopIndex + cacheForward)),
    startIndex,
    stopIndex,
  ]
})

const containerStyle = computed(() => [
  {
    position: 'relative',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    willChange: 'transform',
  },
  {
    direction: props.direction,
    height: isNumber(props.height) ? `${props.height}px` : props.height,
    width: isNumber(props.width) ? `${props.width}px` : props.width,
  },
  props.style ?? {},
])
const innerStyle = computed(() => {
  const width = `${unref(totalWidth)}px`
  const height = `${unref(totalHeight)}px`

  return {
    height,
    pointerEvents: unref(states).isScrolling ? 'none' : undefined,
    width,
  }
})
// methods

function getTotalSize() {
  const { rowHeight, columnWidth } = props
  /** @type{import('vue').ComputedRef<number>} */
  // @ts-ignore
  const height = computed(() => {
    if (typeof rowHeight === 'number') {
      return rowsCount.value * rowHeight
    }

    // eslint-disable-next-line unicorn/consistent-destructuring
    if (props.estimatedRowHeight !== undefined) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      return rowsCount.value * props.estimatedRowHeight
    }

    let result = 0

    for (let index = 0; index < rowsCount.value; index++) {
      result += rowHeight(index)
    }

    return result
  })

  /** @type{import('vue').ComputedRef<number>} */
  const width = computed(() => {
    if (typeof columnWidth === 'number') {
      return columnsCount.value * columnWidth
    }

    // eslint-disable-next-line unicorn/consistent-destructuring
    if (props.estimatedColumnWidth !== undefined) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      return columnsCount.value * props.estimatedColumnWidth
    }

    let result = 0

    for (let index = 0; index < columnsCount.value; index++) {
      result += columnWidth(index)
    }

    return result
  })

  return {
    totalHeight: height,
    totalWidth: width,
  }
}

// TODO: debounce setting is scrolling.
const resetIsScrolling = debounce(() => {
  // timer = null
  states.value.isScrolling = false
  nextTick(() => {
    getItemStyleCache.value(-1, null, null)
  })
}, 10)

function emitEvents() {
  if (columnsCount.value > 0 && rowsCount.value > 0) {
    const [columnCacheStart, columnCacheEnd, columnVisibleStart, columnVisibleEnd] = unref(columnsToRender)
    const [rowCacheStart, rowCacheEnd, rowVisibleStart, rowVisibleEnd] = unref(rowsToRender)

    // emit the render item event with
    // [xAxisInvisibleStart, xAxisInvisibleEnd, xAxisVisibleStart, xAxisVisibleEnd]
    // [yAxisInvisibleStart, yAxisInvisibleEnd, yAxisVisibleStart, yAxisVisibleEnd]
    emit(ITEM_RENDER_EVT, {
      columnCacheStart,
      columnCacheEnd,
      rowCacheStart,
      rowCacheEnd,
      columnVisibleStart,
      columnVisibleEnd,
      rowVisibleStart,
      rowVisibleEnd,
    })
  }

  const { scrollLeft, scrollTop, updateRequested, xAxisScrollDir, yAxisScrollDir } = unref(states)

  emit(SCROLL_EVT, {
    xAxisScrollDir,
    scrollLeft,
    yAxisScrollDir,
    scrollTop,
    updateRequested,
  })
}

/**
 * @param {Event} evt
 */
function handleScroll(evt) {
  // @ts-ignore
  const { clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth } = evt.currentTarget
  const _states = unref(states)

  if (_states.scrollTop === scrollTop && _states.scrollLeft === scrollLeft) {
    return
  }

  let _scrollLeft = scrollLeft

  if (isRTL(props.direction)) {
    switch (getRTLOffsetType()) {
      case RTL_OFFSET_NAG: {
        _scrollLeft = -scrollLeft
        break
      }
      case RTL_OFFSET_POS_DESC: {
        _scrollLeft = scrollWidth - clientWidth - scrollLeft
        break
      }
      default: {
        break
      }
    }
  }

  states.value = {
    ..._states,
    isScrolling: true,
    scrollLeft: _scrollLeft,
    scrollTop: Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight)),
    updateRequested: true,
    xAxisScrollDir: getScrollDir(_states.scrollLeft, _scrollLeft),
    yAxisScrollDir: getScrollDir(_states.scrollTop, scrollTop),
  }
  nextTick(() => resetIsScrolling())
  onUpdated()
  emitEvents()
}

function handleVerticalScroll(distance, totalSteps) {
  const height = unref(parsedHeight)
  const offset = ((totalHeight.value - height) / totalSteps) * distance

  scrollTo({
    scrollTop: Math.min(totalHeight.value - height, offset),
  })
}

function handleHorizontalScroll(distance, totalSteps) {
  const width = unref(parsedWidth)
  const offset = ((totalWidth.value - width) / totalSteps) * distance

  scrollTo({
    scrollLeft: Math.min(totalWidth.value - width, offset),
  })
}

// const { onWheel } = useGridWheel({
//   atXStartEdge: computed(() => states.value.scrollLeft <= 0),
//   atXEndEdge: computed(() => states.value.scrollLeft >= totalWidth.value),
//   atYStartEdge: computed(() => states.value.scrollTop <= 0),
//   atYEndEdge: computed(() => states.value.scrollTop >= totalHeight.value),
// }, (x, y) => {
//   hScrollbar.value?.onMouseUp?.()
//   hScrollbar.value?.onMouseUp?.()
//   const width = unref(parsedWidth)
//   const height = unref(parsedHeight)

//   scrollTo({
//     scrollLeft: Math.min(states.value.scrollLeft + x, totalWidth.value - width),
//     scrollTop: Math.min(states.value.scrollTop + y, totalHeight.value - height),
//   })
// })

function scrollTo({ scrollLeft = states.value.scrollLeft, scrollTop = states.value.scrollTop }) {
  scrollLeft = Math.max(scrollLeft, 0)
  scrollTop = Math.max(scrollTop, 0)
  const _states = unref(states)

  if (scrollTop === _states.scrollTop && scrollLeft === _states.scrollLeft) {
    return
  }

  states.value = {
    ..._states,
    xAxisScrollDir: getScrollDir(_states.scrollLeft, scrollLeft),
    yAxisScrollDir: getScrollDir(_states.scrollTop, scrollTop),
    scrollLeft,
    scrollTop,
    updateRequested: true,
  }
  nextTick(() => resetIsScrolling())
  onUpdated()
  emitEvents()
}

function scrollToItem(rowIndex = 0, columnIndex = 0, alignment = AUTO_ALIGNMENT) {
  const { scrollLeft, scrollTop } = unref(states)

  columnIndex = Math.max(0, Math.min(columnIndex, columnsCount.value - 1))
  rowIndex = Math.max(0, Math.min(rowIndex, rowsCount.value - 1))
  // @ts-ignore
  const scrollBarWidth = getScrollBarWidth(ns.namespace.value)
  const _cache = unref(cache)
  // @ts-ignore
  const estimatedHeight = unref(totalHeight)
  // @ts-ignore
  const estimatedWidth = unref(totalWidth)

  scrollTo({
    // eslint-disable-next-line max-len
    scrollLeft: getColumnOffset(
      columnIndex,
      alignment,
      scrollLeft,
      _cache,
      estimatedWidth > props.width ? scrollBarWidth : 0,
    ),
    scrollTop: getRowOffset(
      rowIndex,
      alignment,
      scrollTop,
      _cache,
      estimatedHeight > props.height ? scrollBarWidth : 0,
    ),
  })
}

function getItemStyle(rowIndex, columnIndex) {
  const { columnWidth, direction, rowHeight } = props
  const itemStyleCache = getItemStyleCache.value(
    clearCache && columnWidth,
    clearCache && rowHeight,
    clearCache && direction,
  )
  // поскольку не было необходимости вводить вложенный массив в объект кэша
  // мы используем строку, столбец для построения ключа для индексации карты.
  const key = `${rowIndex},${columnIndex}`

  if (hasOwn(itemStyleCache, key)) {
    return itemStyleCache[key]
  }

  const [, left] = getColumnPosition(columnIndex, unref(cache))
  const _cache = unref(cache)
  const rtl = isRTL(direction)
  const [height, top] = getRowPosition(rowIndex, _cache)
  const [width] = getColumnPosition(columnIndex, _cache)

  itemStyleCache[key] = {
    position: 'absolute',
    left: rtl ? undefined : `${left}px`,
    right: rtl ? `${left}px` : undefined,
    top: `${top}px`,
    height: `${height}px`,
    width: `${width}px`,
  }

  return itemStyleCache[key]
}
// life cycles
onMounted(() => {
  // for SSR
  if (!isClient) {
    return
  }

  const { initScrollLeft, initScrollTop } = props
  const windowElement = unref(containerRef)

  if (windowElement) {
    if (isNumber(initScrollLeft)) {
      windowElement.scrollLeft = initScrollLeft
    }

    if (isNumber(initScrollTop)) {
      windowElement.scrollTop = initScrollTop
    }
  }

  emitEvents()
})

function onUpdated() {
  const { direction } = props
  const { scrollLeft, scrollTop, updateRequested } = unref(states)
  const windowElement = unref(containerRef)

  if (updateRequested && windowElement) {
    if (direction === RTL) {
      switch (getRTLOffsetType()) {
        case RTL_OFFSET_NAG: {
          windowElement.scrollLeft = -scrollLeft
          break
        }
        case RTL_OFFSET_POS_ASC: {
          windowElement.scrollLeft = scrollLeft
          break
        }
        default: {
          const { clientWidth, scrollWidth } = windowElement

          windowElement.scrollLeft = scrollWidth - clientWidth - scrollLeft
          break
        }
      }
    } else {
      windowElement.scrollLeft = Math.max(0, scrollLeft)
    }

    windowElement.scrollTop = Math.max(0, scrollTop)
  }
}

// @ts-ignore
const { resetAfterColumnIndex, resetAfterRowIndex, resetAfter } = instance.proxy

defineExpose({
  containerRef,
  innerRef,
  getItemStyleCache,
  scrollTo,
  scrollToItem,
  states,
  resetAfterColumnIndex,
  resetAfterRowIndex,
  resetAfter,
})

const Container = resolveDynamicComponent(props.containerElement)
const Inner = resolveDynamicComponent(props.innerElement)
</script>

<template>
  <div :key="0" :class="ns.b()">
    <component
      :is="Container"
      ref="containerRef"
      :class="[ns.e('container'), className]"
      :style="containerStyle"
      @scroll="handleScroll"
    >
      <component :is="Inner" ref="innerRef" :class="ns.e('inner')" :style="innerStyle">
        <template v-if="rowsCount > 0 && columnsCount > 0">
          <template v-for="row in rowsToRender[1] - rowsToRender[0] + 1">
            <slot
              v-for="column in columnsToRender[1] - columnsToRender[0] + 1"
              :key="itemKey({ columnIndex: column, data, rowIndex: row })"
              :data="data"
              :column-index="column + columnsToRender[0] - 1"
              :row-index="row + rowsToRender[0] - 1"
              :is-scrolling="useIsScrolling ? states.isScrolling : undefined"
              :style="getItemStyle(row + rowsToRender[0] - 1, column + columnsToRender[0] - 1)"
            />
          </template>
        </template>
      </component>
    </component>
    <NVirtualScrollbar
      ref="hScrollbar"
      :class="ns.e('horizontal')"
      :always-on="scrollbarAlwaysOn"
      :client-size="parsedWidth"
      layout="horizontal"
      :ratio="(width * 100) / totalWidth"
      :scroll-from="states.scrollLeft / (totalWidth - width)"
      :total="rowsCount"
      @scroll="handleHorizontalScroll"
    />

    <NVirtualScrollbar
      ref="vScrollbar"
      :class="ns.e('vertical')"
      :always-on="scrollbarAlwaysOn"
      :client-size="parsedHeight"
      layout="vertical"
      :ratio="(width * 100) / totalHeight"
      :scroll-from="states.scrollTop / (totalHeight - width)"
      :total="rowsCount"
      @scroll="handleVerticalScroll"
    />
  </div>
</template>
