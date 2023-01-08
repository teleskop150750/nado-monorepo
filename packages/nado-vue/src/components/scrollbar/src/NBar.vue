<script setup>
import { ref } from 'vue'

import { barProps } from './bar-props.js'
import NThumb from './NThumb.vue'

const props = defineProps(barProps)

defineOptions({
  name: 'NBar',
})

const moveX = ref(0)
const moveY = ref(0)

function handleScroll(wrap) {
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

<template>
  <NThumb :move="moveX" :ratio="ratioX" :size="width" :always="always" />
  <NThumb :move="moveY" :ratio="ratioY" :size="height" vertical :always="always" />
</template>
