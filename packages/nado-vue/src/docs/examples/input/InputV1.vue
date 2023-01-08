<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Base</h3>
  <div class="row">
    <div class="col">
      <div class="col">
        <NInput v-model="input" size="small" placeholder="Please input" />
      </div>

      <div class="col">
        <NInput v-model="input" size="default" placeholder="Please input" />
      </div>

      <div class="col">
        <NInput v-model="input" size="large" placeholder="Please input" />
      </div>
    </div>
  </div>
</template>
