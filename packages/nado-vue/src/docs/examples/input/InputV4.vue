<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Clearable</h3>

  <div class="row">
    <div class="col" style="width: 250px">
      <NInput v-model="input" clearable placeholder="Please input" />
    </div>
  </div>
</template>
