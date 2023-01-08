<script setup>
// import { NButton } from '../components/NButton/index.js'
import { NTooltipV2 } from '../components/tooltip-v2/index.js'
import NCard from './NCard.vue'
</script>

<template>
  <NCard>
    <h2>Tooltip</h2>

    <NTooltipV2 aria-label="content" placement="left">
      <template #trigger> NButton </template>
      Basic tooltip
    </NTooltipV2>
  </NCard>
</template>
