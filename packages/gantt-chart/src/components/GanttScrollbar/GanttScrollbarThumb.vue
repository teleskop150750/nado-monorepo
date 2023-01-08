<script setup lang="ts">
import { isClient, useEventListener } from '@vueuse/core'
import { computed, inject, onBeforeUnmount, ref, toRef } from 'vue'

import { scrollbarContextKey } from '../tokens'
import { throwError } from '../utils'
import { thumbProps } from './thumb'
import { BAR_MAP, renderThumbStyle } from './utils.js'

const props = defineProps(thumbProps)

const scrollbar = inject(scrollbarContextKey)

if (!scrollbar) {
  throwError('NThumb', 'can not inject scrollbar context')
}

const barRef = ref<HTMLDivElement>()
const thumbRef = ref<HTMLDivElement>()
const thumbState = ref<Partial<Record<'X' | 'Y', number>>>({})
const visible = ref(false)

let cursorDown = false
let cursorLeave = false
let originalOnSelectStart: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = isClient
  ? document.onselectstart
  : null

const bar = computed(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'])

const thumbStyle = computed(() =>
  renderThumbStyle({
    move: props.move,
    size: props.size,
    bar: bar.value,
  }),
)

const offsetRatio = computed(() => {
  // offsetRatioX = original width of thumb / current width of thumb / ratioX
  // offsetRatioY = original height of thumb / current height of thumb / ratioY
  // burRef height = wrap height - GAP
  if (!barRef.value || !thumbRef.value) {
    return 1
  }

  return (
    barRef.value[bar.value.offset] ** 2 /
    scrollbar.wrapElement[bar.value.scrollSize] /
    props.ratio /
    thumbRef.value[bar.value.offset]
  )
})

const barClasses = ['gantt-scrollbar__bar', `gantt-scrollbar__bar--is-${bar.value.key}`]

function handleMouseDownThumb(evt: MouseEvent) {
  // prevent click event of middle and right button
  evt.stopPropagation()

  if (evt.ctrlKey || [1, 2].includes(evt.button)) {
    return
  }

  window.getSelection()?.removeAllRanges()
  startDrag(evt)
  const el = evt.currentTarget as HTMLDivElement

  if (!el) {
    return
  }

  thumbState.value[bar.value.axis] =
    el[bar.value.offset] - (evt[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
}

function handleMouseDownTrack(evt: MouseEvent) {
  if (!thumbRef.value || !barRef.value || !scrollbar) {
    return
  }

  const offset = Math.abs(
    (evt.target as HTMLElement).getBoundingClientRect()[bar.value.direction] - evt[bar.value.client],
  )

  const thumbHalf = thumbRef.value[bar.value.offset] / 2

  const thumbPositionPercentage = ((offset - thumbHalf) * 100 * offsetRatio.value) / barRef.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) / 100
}

function startDrag(evt: MouseEvent) {
  evt.stopImmediatePropagation()
  cursorDown = true
  document.addEventListener('mousemove', handleMouseMoveDocument)
  document.addEventListener('mouseup', handleMouseUpDocument)
  originalOnSelectStart = document.onselectstart
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  document.onselectstart = () => false
}

function handleMouseMoveDocument(evt: MouseEvent) {
  if (!barRef.value || !thumbRef.value || !scrollbar) {
    return
  }

  if (cursorDown === false) {
    return
  }

  const prevPage = thumbState.value[bar.value.axis]

  if (!prevPage) {
    return
  }

  const offset = (barRef.value.getBoundingClientRect()[bar.value.direction] - evt[bar.value.client]) * -1
  const thumbClickPosition = thumbRef.value[bar.value.offset] - prevPage

  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) / barRef.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) / 100
}

function handleMouseUpDocument() {
  cursorDown = false
  thumbState.value[bar.value.axis] = 0
  document.removeEventListener('mousemove', handleMouseMoveDocument)
  document.removeEventListener('mouseup', handleMouseUpDocument)
  restoreOnselectstart()

  if (cursorLeave) {
    visible.value = false
  }
}

function handleMouseMoveScrollbar() {
  cursorLeave = false
  visible.value = props.size.length > 0
}

function handleMouseLeaveScrollbar() {
  cursorLeave = true
  visible.value = cursorDown
}

onBeforeUnmount(() => {
  restoreOnselectstart()
  document.removeEventListener('mouseup', handleMouseUpDocument)
})

function restoreOnselectstart() {
  if (document.onselectstart !== originalOnSelectStart) {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    document.onselectstart = originalOnSelectStart
  }
}

useEventListener(toRef(scrollbar, 'scrollbarElement'), 'mousemove', handleMouseMoveScrollbar)

useEventListener(toRef(scrollbar, 'scrollbarElement'), 'mouseleave', handleMouseLeaveScrollbar)
</script>

<script lang="ts">
export default {
  name: 'GanttScrollbarThumb',
}
</script>

<template>
  <Transition name="gantt-scroll-bar-fade">
    <div v-show="always || visible" ref="barRef" :class="barClasses" @mousedown="handleMouseDownTrack">
      <div ref="thumbRef" class="gantt-scrollbar__thumb" :style="thumbStyle" @mousedown="handleMouseDownThumb" />
    </div>
  </Transition>
</template>
