<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: [String, Number],
    default: 1,
  },
})

const tagName = computed(() => `h${props.level}`)
const classes = computed(() => [`n-title-${props.level}`])
</script>

<template>
  <component :is="tagName" :class="classes">
    <slot />
  </component>
</template>
