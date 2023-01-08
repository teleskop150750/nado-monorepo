<script setup>
import { isClient } from '@vueuse/core'
import { computed } from 'vue'

import { portalProps } from './props.js'

const props = defineProps(portalProps)

defineOptions({
  name: 'NPortal',
})
const inline = computed(() => props.disabled || props.to === 'self')
</script>

<template>
  <template v-if="inline">
    <slot />
  </template>
  <template v-else-if="isClient">
    <Teleport :to="to">
      <slot />
    </Teleport>
  </template>
</template>
