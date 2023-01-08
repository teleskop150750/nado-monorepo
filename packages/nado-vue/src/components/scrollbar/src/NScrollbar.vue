<script setup>
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { computed, nextTick, onMounted, onUpdated, provide, reactive, ref, watch } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { scrollbarContextKey } from '../../../tokens/index.js'
import { addUnit, debugWarn, isNumber, isObject } from '../../../utils/index.js'
import NBar from './NBar.vue'
import { scrollbarEmits, scrollbarProps } from './scrollbar-props.js'

const props = defineProps(scrollbarProps)

const emit = defineEmits(scrollbarEmits)

const COMPONENT_NAME = 'NScrollbar'

defineOptions({
  name: 'NScrollbar',
})

const ns = useNamespace('scrollbar')
let stopResizeObserver
let stopResizeListener
const scrollbarRef = ref()
const wrapRef = ref()
const resizeRef = ref()
const thumbWidth = ref('0')
const thumbHeight = ref('0')
const barRef = ref()
const ratioY = ref(1)
const ratioX = ref(1)

const wrapClasses = [props.wrapClass, ns.e('wrap'), ns.eIs('wrap', 'hidden-default', !props.native)]
const resizeClasses = [ns.e('view'), props.viewClass]

const style = computed(() => {
  const acc = {}

  if (props.height) {
    acc.height = addUnit(props.height)
  }

  if (props.maxHeight) {
    acc.maxHeight = addUnit(props.maxHeight)
  }

  return [props.wrapStyle, acc]
})

function handleScroll() {
  if (wrapRef.value) {
    barRef.value?.handleScroll(wrapRef.value)
    emit('scroll', {
      scrollTop: wrapRef.value.scrollTop,
      scrollLeft: wrapRef.value.scrollLeft,
    })
  }
}

function scrollTo(arg1, arg2) {
  if (isObject(arg1)) {
    wrapRef.value.scrollTo(arg1)
  } else if (isNumber(arg1) && isNumber(arg2)) {
    wrapRef.value.scrollTo(arg1, arg2)
  }
}

function setScrollTop(val) {
  if (!isNumber(val)) {
    debugWarn(COMPONENT_NAME, 'value must be a number')

    return
  }

  wrapRef.value.scrollTop = val
}

function setScrollLeft(val) {
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
  () => props.noresize,
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

<template>
  <div ref="scrollbarRef" :class="ns.b()">
    <div ref="wrapRef" :class="wrapClasses" :style="style" @scroll="handleScroll">
      <component :is="tag" ref="resizeRef" :class="resizeClasses" :style="viewStyle">
        <slot />
      </component>

      <template v-if="!native">
        <NBar
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
