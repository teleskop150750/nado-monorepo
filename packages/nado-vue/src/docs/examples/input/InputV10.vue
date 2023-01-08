<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const input = ref('')
</script>

<template>
  <h3 class="n-title-3">Limit length</h3>
  <div class="row">
    <div class="col">
      <NInput v-model="input" maxlength="10" placeholder="Please input" show-word-limit type="text" />
    </div>

    <div class="col">
      <NInput v-model="input" maxlength="30" placeholder="Please input" show-word-limit type="textarea" />
    </div>
  </div>
</template>
