<script setup>
import { computed, onBeforeUnmount, reactive, ref, unref, watch } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { cAF, rAF } from '../../../utils/index.js'
import { BAR_MAP } from '../../scrollbar/src/util.js'
import { HORIZONTAL, SCROLLBAR_MIN_SIZE, ScrollbarDirKey } from './defaults.js'
import { virtualizedScrollbarProps } from './props.js'
import { renderThumbStyle } from './utils.js'

const props = defineProps(virtualizedScrollbarProps)
const emit = defineEmits(['scroll', 'start-move', 'stop-move'])

defineOptions({
  name: 'NVirtualScrollbar',
})

const nsVirtualScrollbar = useNamespace('virtual-scrollbar')
const nsScrollbar = useNamespace('scrollbar')
// DOM refs
const trackRef = ref()
const thumbRef = ref()
// local variables
let frameHandle = null
let onSelectstartStore = null
// data
const state = reactive({
  isDragging: false,
  traveled: 0,
})

const bar = computed(() => BAR_MAP[props.layout])

const trackSize = computed(() => props.clientSize)

/** @type {import('vue').ComputedRef<any>} */
const trackStyle = computed(() => ({
  position: 'absolute',
  width: `${HORIZONTAL === props.layout ? trackSize.value : props.scrollbarSize}px`,
  height: `${HORIZONTAL === props.layout ? props.scrollbarSize : trackSize.value}px`,
  [ScrollbarDirKey[props.layout]]: '0',
  right: '0',
  bottom: '0',
  borderRadius: '8px',
}))

const thumbSize = computed(() => {
  const { ratio } = props
  const { clientSize } = props

  if (ratio >= 100) {
    return Number.POSITIVE_INFINITY
  }

  if (ratio >= 50) {
    return (ratio * clientSize) / 100
  }

  const SCROLLBAR_MAX_SIZE = clientSize / 3

  return Math.floor(Math.min(Math.max(ratio * clientSize, SCROLLBAR_MIN_SIZE), SCROLLBAR_MAX_SIZE))
})

/** @type {import('vue').ComputedRef<any>} */
const thumbStyle = computed(() => {
  if (!Number.isFinite(thumbSize.value)) {
    return {
      display: 'none',
    }
  }

  const size = `${thumbSize.value}px`
  const style = renderThumbStyle(
    {
      bar: bar.value,
      size,
      move: state.traveled,
    },
    props.layout,
  )

  return style
})

const totalSteps = computed(() => Math.floor(props.clientSize - thumbSize.value))

function attachEvents() {
  window.addEventListener('mousemove', handleMouseMoveWindow)
  window.addEventListener('mouseup', handleMouseUpWindow)
  const thumbEl = unref(thumbRef)

  if (!thumbEl) {
    return
  }

  onSelectstartStore = document.onselectstart
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  document.onselectstart = () => false
  thumbEl.addEventListener('touchmove', handleMouseMoveWindow, {
    passive: true,
  })
  thumbEl.addEventListener('touchend', handleMouseUpWindow)
}

function detachEvents() {
  window.removeEventListener('mousemove', handleMouseMoveWindow)
  window.removeEventListener('mouseup', handleMouseUpWindow)
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  document.onselectstart = onSelectstartStore
  onSelectstartStore = null
  const thumbEl = unref(thumbRef)

  if (!thumbEl) {
    return
  }

  thumbEl.removeEventListener('touchmove', handleMouseMoveWindow)
  thumbEl.removeEventListener('touchend', handleMouseUpWindow)
}

/**
 * @param {MouseEvent | TouchEvent} evt
 */
function handleMouseDownThumb(evt) {
  evt.stopImmediatePropagation()

  if (evt instanceof MouseEvent && (evt.ctrlKey || [1, 2].includes(evt.button))) {
    return
  }

  state.isDragging = true
  // eslint-disable-next-line max-len
  state[bar.value.axis] =
    evt.currentTarget[bar.value.offset] -
    // @ts-ignore
    (evt[bar.value.client] - evt.currentTarget.getBoundingClientRect()[bar.value.direction])
  emit('start-move')
  attachEvents()
}

function handleMouseUpWindow() {
  state.isDragging = false
  state[bar.value.axis] = 0
  emit('stop-move')
  detachEvents()
}

/**
 * @param {Event} evt
 */
function handleMouseMoveWindow(evt) {
  const { isDragging } = state

  if (!isDragging) {
    return
  }

  if (!thumbRef.value || !trackRef.value) {
    return
  }

  const prevPage = state[bar.value.axis]

  if (!prevPage) {
    return
  }

  cAF(frameHandle)
  // используя смещение текущего трека top/left - текущий
  // указатель clientY/clientX, чтобы получить относительное положение указателя на трек
  const offset = (trackRef.value.getBoundingClientRect()[bar.value.direction] - evt[bar.value.client]) * -1
  // найдите место, на которое был нажат thumb.
  const thumbClickPosition = thumbRef.value[bar.value.offset] - prevPage
  /**
   *  +--------------+                                   +--------------+
   *  |              -  <--------- thumb.offsetTop       |              |
   *  |             |+|             <--+                 |              |
   *  |              -                 |                 |              |
   *  |   Content    |                 |                 |              |
   *  |              |                 |                 |              |
   *  |              |                 |                 |              |
   *  |              |                 |                 |              -
   *  |              |                 +-->              |             |+|
   *  |              |                                   |              -
   *  +--------------+                                   +--------------+
   */
  // используя текущую позицию - предыдущую позицию для
  const distance = offset - thumbClickPosition

  // узнать, сколько всего шагов.
  // зазор 2 сверху, 2 снизу, всего 4.
  // используя totalSteps ÷ totalSize, получаем размер каждого шага * расстояние, чтобы получить новое
  // смещение прокрутки для scrollTo
  frameHandle = rAF(() => {
    state.traveled = Math.max(0, Math.min(distance, totalSteps.value))
    emit('scroll', distance, totalSteps.value)
  })
}

/**
 * @param {MouseEvent} evt
 */
function handleMouseDownTrack(evt) {
  // @ts-ignore
  const offset = Math.abs(evt.target.getBoundingClientRect()[bar.value.direction] - evt[bar.value.client])
  const thumbHalf = thumbRef.value[bar.value.offset] / 2
  const distance = offset - thumbHalf

  state.traveled = Math.max(0, Math.min(distance, totalSteps.value))
  emit('scroll', distance, totalSteps.value)
}

watch(
  () => props.scrollFrom,
  (val) => {
    if (state.isDragging) {
      return
    }

    /**
     *  это просто отображение текущего смещения полосы прокрутки
     *
     *  formula 1:
     *    v = scrollOffset / (estimatedTotalSize - clientSize)
     *    traveled = v * (clientSize - thumbSize) --> v * totalSteps
     *
     *  formula 2:
     *    traveled = (v * clientSize) / (clientSize / totalSteps)
     *                --> (v * clientSize) * (totalSteps / clientSize) --> v * totalSteps
     */
    state.traveled = Math.ceil(val * totalSteps.value)
  },
)

onBeforeUnmount(() => {
  detachEvents()
})
</script>

<template>
  <div
    ref="trackRef"
    role="presentation"
    :class="[nsVirtualScrollbar.b(), (alwaysOn || state.isDragging) && nsVirtualScrollbar.m('always-on')]"
    :style="trackStyle"
    @mousedown.stop.prevent="handleMouseDownTrack"
    @touchstart.prevent="handleMouseDownThumb"
  >
    <div
      ref="thumbRef"
      :class="nsScrollbar.e('thumb')"
      :style="thumbStyle"
      @mousedown.stop.prevent="handleMouseDownThumb"
    ></div>
  </div>
</template>
