<script setup>
import { ref } from 'vue'

import { NInput } from '../../../components/index.js'

const textarea = ref('')
</script>

<template>
  <h3 class="n-title-3">Textarea</h3>
  <div class="row">
    <div class="col">
      <NInput v-model="textarea" :rows="2" type="textarea" placeholder="Please input" />
    </div>
  </div>
</template>
