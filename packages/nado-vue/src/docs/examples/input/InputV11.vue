<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Status</h3>
  <div class="row">
    <div class="col">
      <NInput v-model="input" success placeholder="Please input" />
    </div>
    <div class="col">
      <NInput v-model="input" error placeholder="Please input" />
    </div>
  </div>
</template>
