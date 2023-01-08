<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'
import { NIconSearch } from '../../../icons/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Input with icon</h3>

  <div class="row">
    <div class="col">
      <NInput v-model="input" placeholder="Please input" :suffix-icon="NIconSearch" />
    </div>
    <div class="col">
      <NInput v-model="input" placeholder="Please input">
        <template #suffix>
          <span class="n-input__icon"><NIconSearch /></span>
        </template>
      </NInput>
    </div>
    <div class="col">
      <NInput v-model="input" placeholder="Please input" :prefix-icon="NIconSearch" />
    </div>
    <div class="col">
      <NInput v-model="input" placeholder="Please input">
        <template #prefix>
          <span class="n-input__icon"><NIconSearch /></span>
        </template>
      </NInput>
    </div>
  </div>
</template>
