<script setup>
import { ref } from 'vue'

import { NButton, NInput } from '../../../components/index.js'
import { NIconSearch } from '../../../icons/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Mixed input</h3>

  <div class="row">
    <div class="col">
      <NInput v-model="input" placeholder="Please input">
        <template #append>
          <NButton :icon="NIconSearch" />
        </template>
      </NInput>
    </div>

    <div class="col">
      <NInput v-model="input" placeholder="Please input">
        <template #prepend>
          <NButton :icon="NIconSearch" />
        </template>
      </NInput>
    </div>
  </div>
</template>
