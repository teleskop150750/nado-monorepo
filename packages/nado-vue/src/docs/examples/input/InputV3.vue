<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'
import { NIconSearch } from '../../../icons/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Disabled</h3>

  <div class="row">
    <div class="col">
      <NInput v-model="input" disabled placeholder="Please input" :suffix-icon="NIconSearch" />
    </div>
  </div>
</template>
