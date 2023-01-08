<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const mask = ref('')
</script>

<template>
  <h3 class="n-title-3">Mask (В разработке)</h3>
  <div class="row">
    <div class="col">
      {{ mask }}
      <NInput v-model="mask" mask="#### - #### - #### - ####" placeholder="Please input" />
    </div>
  </div>
</template>
