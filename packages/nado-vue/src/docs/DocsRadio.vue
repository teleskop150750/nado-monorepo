<script setup>
import { ref } from 'vue'

import { NRadio } from '../components/index.js'
import NCard from './NCard.vue'

const radio = ref('line')
const radio2 = ref('line')
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Radio</h2>

    <div class="row">
      <div class="col">
        <NRadio v-model="radio" name="radio" val="line" label="Line" />
        <NRadio v-model="radio" name="radio" val="rectangle" label="Rectangle" disabled />
        <NRadio v-model="radio" name="radio" val="ellipse" label="Ellipse" />
      </div>

      <div class="col">
        <NRadio v-model="radio2" name="radio2" val="line" label="Line" left-label />
        <NRadio v-model="radio2" name="radio2" val="rectangle" label="Rectangle" left-label disabled />
        <NRadio v-model="radio2" name="radio2" val="ellipse" label="Ellipse" left-label />
      </div>
    </div>
  </NCard>
</template>
