<script setup>
import { isClient, useEventListener } from '@vueuse/core'
import { computed, inject, onBeforeUnmount, ref, toRef } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { scrollbarContextKey } from '../../../tokens/index.js'
import { stop, throwError } from '../../../utils/index.js'
import { thumbProps } from './thumb-props.js'
import { BAR_MAP, renderThumbStyle } from './util.js'

const props = defineProps(thumbProps)

defineOptions({
  name: 'NThumb',
})

const scrollbar = inject(scrollbarContextKey)
const ns = useNamespace('scrollbar')

if (!scrollbar) {
  throwError('NThumb', 'can not inject scrollbar context')
}

const barRef = ref()
const thumbRef = ref()
const thumbState = ref({})
const visible = ref(false)

let cursorDown = false
let cursorLeave = false
let originalOnSelectStart = isClient ? document.onselectstart : null

const bar = computed(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'])

const thumbStyle = computed(() =>
  renderThumbStyle({
    move: props.move,
    size: props.size,
    bar: bar.value,
  }),
)

const offsetRatio = computed(
  () =>
    // offsetRatioX = original width of thumb / current width of thumb / ratioX
    // offsetRatioY = original height of thumb / current height of thumb / ratioY
    // burRef height = wrap height - GAP
    barRef.value[bar.value.offset] ** 2 /
    scrollbar.wrapElement[bar.value.scrollSize] /
    props.ratio /
    thumbRef.value[bar.value.offset],
)

const barClasses = [ns.e('bar'), ns.eIs('bar', bar.value.key)]

function handleMouseDownThumb(evt) {
  // prevent click event of middle and right button
  stop(evt)

  if (evt.ctrlKey || [1, 2].includes(evt.button)) {
    return
  }

  window.getSelection()?.removeAllRanges()
  startDrag(evt)
  const el = evt.currentTarget

  if (!el) {
    return
  }

  // eslint-disable-next-line max-len
  thumbState.value[bar.value.axis] =
    el[bar.value.offset] - (evt[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
}

function handleMouseDownTrack(evt) {
  if (!thumbRef.value || !barRef.value || !scrollbar.wrapElement) {
    return
  }

  const offset = Math.abs(evt.target.getBoundingClientRect()[bar.value.direction] - evt[bar.value.client])

  const thumbHalf = thumbRef.value[bar.value.offset] / 2

  const thumbPositionPercentage = ((offset - thumbHalf) * 100 * offsetRatio.value) / barRef.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) / 100
}

function startDrag(evt) {
  evt.stopImmediatePropagation()
  cursorDown = true
  document.addEventListener('mousemove', handleMouseMoveDocument)
  document.addEventListener('mouseup', handleMouseUpDocument)
  originalOnSelectStart = document.onselectstart
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  document.onselectstart = () => false
}

function handleMouseMoveDocument(evt) {
  if (!barRef.value || !thumbRef.value) {
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

  // eslint-disable-next-line max-len
  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) / barRef.value[bar.value.offset]

  // eslint-disable-next-line max-len
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

<template>
  <Transition :name="ns.b('fade')">
    <div v-show="always || visible" ref="barRef" :class="barClasses" @mousedown="handleMouseDownTrack">
      <div ref="thumbRef" :class="ns.e('thumb')" :style="thumbStyle" @mousedown="handleMouseDownThumb" />
    </div>
  </Transition>
</template>
