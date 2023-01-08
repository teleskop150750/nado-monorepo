<script setup>
import { isClient } from '@vueuse/core'
import { debounce } from 'lodash-unified'
import { computed, getCurrentInstance, nextTick, onMounted, onUpdated, ref, resolveDynamicComponent, unref } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { hasOwn, isFunction, isNumber } from '../../../utils/index.js'
import {
  AUTO_ALIGNMENT,
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  ITEM_RENDER_EVT,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  RTL_OFFSET_POS_DESC,
  SCROLL_EVT,
} from './defaults.js'
import { useCache } from './hooks/useCache.js'
import { useDynamicList } from './hooks/useDynamicList.js'
import { useFixedList } from './hooks/useFixedList.js'
// import useWheel from '../hooks/use-wheel.js'
import NVirtualScrollbar from './NVirtualScrollbar.vue'
import { virtualizedListProps } from './props.js'
import { getIsHorizontal, getRTLOffsetType, getScrollDir } from './utils.js'

const props = defineProps(virtualizedListProps)
const emit = defineEmits([ITEM_RENDER_EVT, SCROLL_EVT])

defineOptions({
  name: 'NVirtualList',
})

const itemsCount = computed(() => props.data.length)
/** @type{import('vue').ComputedRef<number>} */
const totalSize = getTotalSize()

const {
  getItemOffset,
  getItemSize,
  getOffset,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initCache,
  clearCache,
  validateProps,
} = isFunction(props.itemSize)
  ? useDynamicList(props, itemsCount, totalSize)
  : useFixedList(props, itemsCount, totalSize)

// @ts-ignore
validateProps()
const instance = getCurrentInstance()
const ns = useNamespace('virtual-list')
// @ts-ignore
const dynamicSizeCache = ref(initCache(instance))
const getItemStyleCache = useCache()
// ссылки
// здесь windowRef и innerRef могут быть типом HTMLElement
// или определенный пользователем тип компонента, зависит от переданного типа
// пользователем
const containerRef = ref()
const innerRef = ref()
const scrollbarRef = ref()
const states = ref({
  isScrolling: false,
  scrollDir: FORWARD,
  scrollOffset: props.initScrollOffset,
  updateRequested: false,
})

// computed
const itemsToRender = computed(() => {
  const { cache } = props
  const { isScrolling, scrollDir, scrollOffset } = unref(states)

  if (itemsCount.value === 0) {
    return [0, 0, 0, 0]
  }

  // @ts-ignore
  const startIndex = getStartIndexForOffset(scrollOffset, unref(dynamicSizeCache))
  // @ts-ignore
  const stopIndex = getStopIndexForStartIndex(startIndex, scrollOffset, unref(dynamicSizeCache))
  const cacheBackward = isScrolling === false || scrollDir === BACKWARD ? Math.max(1, cache) : 1
  const cacheForward = isScrolling === false || scrollDir === FORWARD ? Math.max(1, cache) : 1

  return [
    Math.max(0, startIndex - cacheBackward),
    Math.max(0, Math.min(itemsCount.value - 1, stopIndex + cacheForward)),
    startIndex,
    stopIndex,
  ]
})

// @ts-ignore
const isHorizontal = computed(() => getIsHorizontal(props.layout))
const containerStyle = computed(() => [
  {
    position: 'relative',
    [`overflow-${isHorizontal.value ? 'x' : 'y'}`]: 'scroll',
    WebkitOverflowScrolling: 'touch',
    willChange: 'transform',
  },
  {
    direction: props.direction,
    height: isNumber(props.height) ? `${props.height}px` : props.height,
    width: isNumber(props.width) ? `${props.width}px` : props.width,
  },
  props.style,
])

const innerStyle = computed(() => {
  const size = unref(totalSize)
  const horizontal = unref(isHorizontal)

  return {
    width: !horizontal ? '100%' : `${size}px`,
    height: horizontal ? '100%' : `${size}px`,
    pointerEvents: unref(states).isScrolling ? 'none' : undefined,
  }
})

const clientSize = computed(() => (isHorizontal.value ? props.width : props.height))

// methods

function getTotalSize() {
  const { itemSize } = props

  return computed(() => {
    if (typeof itemSize === 'number') {
      return itemsCount.value * itemSize
    }

    // eslint-disable-next-line unicorn/consistent-destructuring
    if (props.estimatedItemSize !== undefined) {
      // eslint-disable-next-line unicorn/consistent-destructuring
      return itemsCount.value * props.estimatedItemSize
    }

    let result = 0

    for (let index = 0; index < itemsCount.value; index++) {
      result += itemSize(index)
    }

    return result
  })
}

// function createComputedTotalSize() {
//   return computed(() => {
//     console.log('createComputedTotalSize')

//     if (typeof props.itemSize === 'number') {
//       return itemsCount.value * props.itemSize
//     }

//     if (props.estimatedItemSize !== undefined) {
//       return itemsCount.value * props.estimatedItemSize
//     }

//     // @ts-ignore
//     return props.data.reduce((sum, _, index) => sum + props.itemSize(index), 0)
//   })
// }

// const { onWheel } = useWheel({
//   atStartEdge: computed(() => states.value.scrollOffset <= 0),
//   atEndEdge: computed(() => states.value.scrollOffset >= estimatedTotalSize.value),
//   layout: computed(() => props.layout),
// }, (offset) => {
//   scrollbarRef.value.onMouseUp?.()
//   scrollTo(Math.min(states.value.scrollOffset + offset, estimatedTotalSize.value - clientSize.value))
// })

// TODO:
// оптимизация производительности здесь, сброс isScrolling с помощью debounce.
const resetIsScrolling = debounce(() => {
  states.value.isScrolling = false
  nextTick(() => {
    getItemStyleCache.value(-1, null, null)
  })
}, 10)

function emitEvents() {
  if (itemsCount.value > 0) {
    const [cacheStart, cacheEnd, visibleStart, visibleEnd] = unref(itemsToRender)

    emit(ITEM_RENDER_EVT, cacheStart, cacheEnd, visibleStart, visibleEnd)
  }

  const { scrollDir, scrollOffset, updateRequested } = unref(states)

  emit(SCROLL_EVT, scrollDir, scrollOffset, updateRequested)
}

function scrollVertically(evt) {
  const { clientHeight, scrollHeight, scrollTop } = evt.currentTarget
  const unStates = unref(states)

  if (unStates.scrollOffset === scrollTop) {
    return
  }

  const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))

  states.value = {
    ...unStates,
    isScrolling: true,
    scrollDir: getScrollDir(unStates.scrollOffset, scrollOffset),
    scrollOffset,
    updateRequested: false,
  }
  nextTick(() => resetIsScrolling())
}

function scrollHorizontally(evt) {
  const { clientWidth, scrollLeft, scrollWidth } = evt.currentTarget
  const _states = unref(states)

  if (_states.scrollOffset === scrollLeft) {
    return
  }

  const { direction } = props
  let scrollOffset = scrollLeft

  if (direction === RTL) {
    // Согласно спецификации, scrollLeft должен быть отрицательным для элементов, выровненных по RTL.
    // Однако это относится не ко всем браузерам
    // (например, Chrome сообщает о положительных значениях, измеренных относительно левого края).
    // Для этого компонента также будет проще, если мы преобразуем смещения в тот же формат,
    //  в котором они были бы для ltr.
    // Итак, самое простое решение - определить, с каким поведением браузера мы имеем дело,
    // и преобразовать его на основе этого.
    switch (getRTLOffsetType()) {
      case RTL_OFFSET_NAG: {
        scrollOffset = -scrollLeft
        break
      }
      case RTL_OFFSET_POS_DESC: {
        scrollOffset = scrollWidth - clientWidth - scrollLeft
        break
      }
      default: {
        break
      }
    }
  }

  scrollOffset = Math.max(0, Math.min(scrollOffset, scrollWidth - clientWidth))
  states.value = {
    ..._states,
    isScrolling: true,
    scrollDir: getScrollDir(_states.scrollOffset, scrollOffset),
    scrollOffset,
    updateRequested: false,
  }
  nextTick(() => resetIsScrolling())
}

function handleScroll(evt) {
  unref(isHorizontal) ? scrollHorizontally(evt) : scrollVertically(evt)
  emitEvents()
}

function handleScrollbarScroll(distanceToGo, totalSteps) {
  const offset = ((totalSize.value - Number(clientSize.value)) / totalSteps) * distanceToGo

  scrollTo(Math.min(totalSize.value - Number(clientSize.value), offset))
}

function scrollTo(offset) {
  offset = Math.max(offset, 0)

  if (offset === unref(states).scrollOffset) {
    return
  }

  states.value = {
    ...unref(states),
    scrollOffset: offset,
    scrollDir: getScrollDir(unref(states).scrollOffset, offset),
    updateRequested: true,
  }
  nextTick(() => resetIsScrolling())
}

function scrollToItem(idx, alignment = AUTO_ALIGNMENT) {
  const { scrollOffset } = unref(states)

  idx = Math.max(0, Math.min(idx, itemsCount.value - 1))
  // @ts-ignore
  scrollTo(getOffset(idx, alignment, scrollOffset, unref(dynamicSizeCache)))
}

function getItemStyle(idx) {
  const { direction, itemSize, layout } = props
  const itemStyleCache = getItemStyleCache.value(clearCache && itemSize, clearCache && layout, clearCache && direction)

  if (hasOwn(itemStyleCache, String(idx))) {
    return itemStyleCache[idx]
  }

  // @ts-ignore
  const offset = getItemOffset(idx, unref(dynamicSizeCache))
  // @ts-ignore
  const size = getItemSize(idx, unref(dynamicSizeCache))
  const horizontal = unref(isHorizontal)
  const isRtl = direction === RTL
  const offsetHorizontal = horizontal ? offset : 0

  // eslint-disable-next-line no-multi-assign
  itemStyleCache[idx] = {
    position: 'absolute',
    left: isRtl ? undefined : `${offsetHorizontal}px`,
    right: isRtl ? `${offsetHorizontal}px` : undefined,
    top: !horizontal ? `${offset}px` : 0,
    height: !horizontal ? `${size}px` : '100%',
    width: horizontal ? `${size}px` : '100%',
  }

  return itemStyleCache[idx]
}

function resetScrollTop() {
  const window = containerRef.value

  if (window) {
    window.scrollTop = 0
  }
}

// life cycles
onMounted(() => {
  if (!isClient) {
    return
  }

  const { initScrollOffset } = props
  const windowElement = unref(containerRef)

  if (isNumber(initScrollOffset) && windowElement) {
    if (unref(isHorizontal)) {
      windowElement.scrollLeft = initScrollOffset
    } else {
      windowElement.scrollTop = initScrollOffset
    }
  }

  emitEvents()
})

onUpdated(() => {
  const { direction, layout } = props
  const { scrollOffset, updateRequested } = unref(states)
  const windowElement = unref(containerRef)

  if (updateRequested && windowElement) {
    if (layout === HORIZONTAL) {
      if (direction === RTL) {
        // / Согласно спецификации, scrollLeft должен быть отрицательным для элементов, выровненных по RTL.
        // Однако это относится не ко всем браузерам
        // (например, Chrome сообщает о положительных значениях, измеренных относительно левого края).
        // Итак, нам нужно определить, с каким поведением браузера мы имеем дело, и имитировать его.
        switch (getRTLOffsetType()) {
          case RTL_OFFSET_NAG: {
            windowElement.scrollLeft = -scrollOffset
            break
          }
          case RTL_OFFSET_POS_ASC: {
            windowElement.scrollLeft = scrollOffset
            break
          }
          default: {
            const { clientWidth, scrollWidth } = windowElement

            windowElement.scrollLeft = scrollWidth - clientWidth - scrollOffset
            break
          }
        }
      } else {
        windowElement.scrollLeft = scrollOffset
      }
    } else {
      windowElement.scrollTop = scrollOffset
    }
  }
})

defineExpose({
  containerRef,
  innerRef,
  getItemStyleCache,
  scrollTo,
  scrollToItem,
  resetScrollTop,
  states,
})

const Container = resolveDynamicComponent(props.containerElement)
const Inner = resolveDynamicComponent(props.innerElement)
</script>

<template>
  <div :key="0" :class="ns.b()">
    <component
      :is="Container"
      ref="containerRef"
      :key="0"
      :class="[ns.e('container'), className]"
      :style="containerStyle"
      @scroll="handleScroll"
    >
      <component :is="Inner" ref="innerRef" :class="ns.e('inner')" :style="innerStyle">
        <template v-if="itemsCount > 0 && $slots.default">
          <slot
            v-for="i in itemsToRender[1] - itemsToRender[0] + 1"
            :key="i + itemsToRender[0]"
            :data="data"
            :index="i + itemsToRender[0] - 1"
            :is-scrolling="useIsScrolling ? states.isScrolling : undefined"
            :style="getItemStyle(i + itemsToRender[0] - 1)"
          />
        </template>
      </component>
    </component>
    <NVirtualScrollbar
      ref="scrollbarRef"
      :client-size="clientSize"
      :layout="layout"
      :always-on="scrollbarAlwaysOn"
      :ratio="(Number(clientSize) / totalSize) * 100"
      :scroll-from="states.scrollOffset / (totalSize - Number(clientSize))"
      :total="itemsCount"
      @scroll="handleScrollbarScroll"
    />
  </div>
</template>
