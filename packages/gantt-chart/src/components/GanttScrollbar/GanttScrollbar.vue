<script setup lang="ts">
import { isNumber, isObject, useEventListener, useResizeObserver } from '@vueuse/core'
import {
  type CSSProperties,
  type StyleValue,
  computed,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  reactive,
  ref,
  watch,
} from 'vue'

import { scrollbarContextKey } from '../tokens'
import { addUnit, debugWarn } from '../utils'
import GanttScrollbarBar from './GanttScrollbarBar.vue'
import { scrollbarEmits, scrollbarProps } from './scrollbar'

const props = defineProps(scrollbarProps)

const emit = defineEmits(scrollbarEmits)

const COMPONENT_NAME = 'NScrollbar'

let stopResizeObserver: (() => void) | undefined = undefined
let stopResizeListener: (() => void) | undefined = undefined
const scrollbarRef = ref()
const wrapRef = ref()
const resizeRef = ref()
const thumbWidth = ref('0')
const thumbHeight = ref('0')
const barRef = ref()
const ratioY = ref(1)
const ratioX = ref(1)

const wrapClasses = [props.wrapClass, !props.native && 'gantt-scrollbar__wrap--is-hidden-default']
const resizeClasses = ['gantt-scrollbar__view', props.viewClass]

const style = computed(() => {
  const acc: CSSProperties = {}

  if (props.height) {
    acc.height = addUnit(props.height)
  }

  if (props.maxHeight) {
    acc.maxHeight = addUnit(props.maxHeight)
  }

  return [props.wrapStyle, acc]
}) as unknown as StyleValue

function handleScroll() {
  if (wrapRef.value) {
    barRef.value?.handleScroll(wrapRef.value)
    emit('scroll', {
      scrollTop: wrapRef.value.scrollTop,
      scrollLeft: wrapRef.value.scrollLeft,
    })
  }
}

function scrollTo(xCord: number, yCord?: number): void

function scrollTo(options: ScrollToOptions): void
function scrollTo(arg1: unknown, arg2?: number) {
  if (isObject(arg1)) {
    wrapRef.value.scrollTo(arg1)
  } else if (isNumber(arg1) && isNumber(arg2)) {
    wrapRef.value.scrollTo(arg1, arg2)
  }
}

function setScrollTop(val: number) {
  if (!isNumber(val)) {
    debugWarn(COMPONENT_NAME, 'value must be a number')

    return
  }

  wrapRef.value.scrollTop = val
}

function setScrollLeft(val: number) {
  if (!isNumber(val)) {
    debugWarn(COMPONENT_NAME, 'value must be a number')

    return
  }

  wrapRef.value.scrollLeft = val
}

function update() {
  if (!wrapRef.value) {
    return
  }

  const barYSize = wrapRef.value.offsetHeight
  const barXSize = wrapRef.value.offsetWidth

  const originalThumbYSize = barYSize ** 2 / wrapRef.value.scrollHeight
  const originalThumbXSize = barXSize ** 2 / wrapRef.value.scrollWidth
  const calculatedThumbYSize = Math.max(originalThumbYSize, props.minSize)
  const calculatedThumbXSize = Math.max(originalThumbXSize, props.minSize)

  const ratioOriginalYSize = originalThumbYSize / (barYSize - originalThumbYSize)
  const ratioCalculatedYSize = calculatedThumbYSize / (barYSize - calculatedThumbYSize)

  ratioY.value = ratioOriginalYSize / ratioCalculatedYSize

  const ratioOriginalXSize = originalThumbXSize / (barXSize - originalThumbXSize)
  const ratioCalculatedXSize = calculatedThumbXSize / (barXSize - calculatedThumbXSize)

  ratioX.value = ratioOriginalXSize / ratioCalculatedXSize
  thumbHeight.value = Math.round(calculatedThumbYSize) < barYSize ? `${calculatedThumbYSize}px` : ''
  thumbWidth.value = Math.round(calculatedThumbXSize) < barXSize ? `${calculatedThumbXSize}px` : ''
}

watch(
  () => props.noResize,
  (noresize) => {
    if (noresize) {
      stopResizeObserver?.()
      stopResizeListener?.()
    } else {
      ;({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update))
      stopResizeListener = useEventListener('resize', update)
    }
  },
  { immediate: true },
)

watch(
  () => [props.maxHeight, props.height],
  () => {
    if (!props.native) {
      nextTick(() => {
        update()

        if (wrapRef.value) {
          barRef.value?.handleScroll(wrapRef.value)
        }
      })
    }
  },
)

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbarRef,
    wrapElement: wrapRef,
  }),
)

onMounted(() => {
  if (!props.native) {
    nextTick(() => {
      update()
    })
  }
})

onUpdated(() => update())

defineExpose({
  /** @description scrollbar wrap ref */
  wrapRef,
  /** @description update scrollbar state manually */
  update,
  /** @description scrolls to a particular set of coordinates */
  scrollTo,
  /** @description set distance to scroll top */
  setScrollTop,
  /** @description set distance to scroll left */
  setScrollLeft,
  /** @description handle scroll event */
  handleScroll,
})
</script>

<script lang="ts">
export default {
  name: 'GanttScrollbar',
}
</script>

<template>
  <div ref="scrollbarRef" class="gantt-scrollbar">
    <div ref="wrapRef" class="gantt-scrollbar__wrap" :class="wrapClasses" :style="style" @scroll="handleScroll">
      <component :is="tag" ref="resizeRef" :class="resizeClasses" :style="viewStyle">
        <slot />
      </component>

      <template v-if="!native">
        <GanttScrollbarBar
          ref="barRef"
          :height="thumbHeight"
          :width="thumbWidth"
          :always="always"
          :ratio-x="ratioX"
          :ratio-y="ratioY"
        />
      </template>
    </div>
  </div>
</template>

<style>
.gantt-scrollbar {
  --gantt-comp-scrollbar-opacity: 0.5;
  --gantt-comp-scrollbar-opacity-hover: 0.9;
  --gantt-comp-scrollbar-color-bg: red;
  --gantt-comp-scrollbar-color-bg-hover: red;
  --gantt-comp-scrollbar-bar-offset: 2px;
  --gantt-comp-scrollbar-bar-size: 12px;

  position: relative;

  height: 100%;

  overflow: hidden;
}

.gantt-scrollbar__wrap {
  height: 100%;

  overflow: auto;
}

.gantt-scrollbar__wrap--is-hidden-default {
  scrollbar-width: none;
}

.gantt-scrollbar__wrap--is-hidden-default::-webkit-scrollbar {
  display: none;
}

.gantt-scrollbar__thumb {
  position: relative;

  display: block;

  width: 0;
  height: 0;

  border-radius: inherit;

  cursor: pointer;

  transition: var(--gantt-transition-duration) background-color;
}

.gantt-scrollbar__thumb::before {
  position: absolute;
  top: var(--gantt-comp-scrollbar-bar-offset);
  left: var(--gantt-comp-scrollbar-bar-offset);
  bottom: var(--gantt-comp-scrollbar-bar-offset);
  right: var(--gantt-comp-scrollbar-bar-offset);
  content: '';

  border-radius: inherit;

  background-color: var(--gantt-comp-scrollbar-color-bg);

  opacity: var(--gantt-comp-scrollbar-opacity);
}

.gantt-scrollbar__thumb:hover::before {
  background-color: var(--gantt-comp-scrollbar-color-bg-hover);

  opacity: var(--gantt-comp-scrollbar-opacity-hover);
}

.gantt-scrollbar__bar {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;

  border-radius: var(--gantt-comp-scrollbar-bar-size);
}

.gantt-scrollbar__bar--is-vertical {
  top: 0;

  width: var(--gantt-comp-scrollbar-bar-size);
}

.gantt-scrollbar__bar--is-vertical > div {
  width: 100%;
}

.gantt-scrollbar__bar--is-horizontal {
  left: 0;

  height: var(--gantt-comp-scrollbar-bar-size);
}

.gantt-scrollbar__bar--is-horizontal > div {
  height: 100%;
}

.gantt-scrollbar-fade-enter-active {
  transition: opacity 340ms ease-out;
}

.gantt-scrollbar-fade-leave-active {
  transition: opacity 120ms ease-out;
}

.gantt-scrollbar-fade-enter-from,
.gantt-scrollbar-fade-leave-active {
  opacity: 0;
}
</style>
