<script setup>
import { NSpinner } from '../components/index.js'
import NCard from './NCard.vue'
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Spinner</h2>
    <NSpinner class="spinner" />
  </NCard>
</template>

<style scoped>
.spinner {
  width: 160px;
  height: 160px;

  color: var(--n-sys-color-primary);
}
</style>
