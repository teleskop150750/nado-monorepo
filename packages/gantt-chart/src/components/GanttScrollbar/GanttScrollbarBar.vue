<script setup lang="ts">
import { ref } from 'vue'

import { barProps } from './bar'
import GanttScrollbarThumb from './GanttScrollbarThumb.vue'

const props = defineProps(barProps)

const moveX = ref(0)
const moveY = ref(0)

function handleScroll(wrap: HTMLDivElement) {
  if (wrap) {
    const { offsetHeight, scrollTop } = wrap
    const { offsetWidth, scrollLeft } = wrap

    moveY.value = (scrollTop / offsetHeight) * 100 * props.ratioY
    moveX.value = (scrollLeft / offsetWidth) * 100 * props.ratioX
  }
}

defineExpose({
  handleScroll,
})
</script>

<script lang="ts">
export default {
  name: 'GanttScrollbarBar',
}
</script>

<template>
  <GanttScrollbarThumb :move="moveX" :ratio="ratioX" :size="width" :always="always" />
  <GanttScrollbarThumb :move="moveY" :ratio="ratioY" :size="height" vertical :always="always" />
</template>
