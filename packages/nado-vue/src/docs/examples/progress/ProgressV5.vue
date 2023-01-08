<script setup>
import { onMounted, ref } from 'vue'

import { NButton, NButtonGroup, NProgress } from '../../../components/index.js'
import { NIconMinus, NIconPlus } from '../../../icons/index.js'

const percentage = ref(10)
const percentage2 = ref(0)

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

function increase() {
  percentage.value += 10

  if (percentage.value > 100) {
    percentage.value = 100
  }
}

function decrease() {
  percentage.value -= 10

  if (percentage.value < 0) {
    percentage.value = 0
  }
}
onMounted(() => {
  setInterval(() => {
    percentage2.value = (percentage2.value % 100) + 10
  }, 500)
})
</script>

<template>
  <h3 class="n-title-3">Индикатор выполнения панели мониторинга</h3>

  <div class="demo-progress">
    <NProgress type="dashboard" :percentage="percentage" :color="colors" />
    <NProgress type="dashboard" :percentage="percentage2" :color="colors" />
    <div>
      <NButtonGroup>
        <NButton :icon="NIconMinus" @click="decrease" />
        <NButton :icon="NIconPlus" @click="increase" />
      </NButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.demo-progress .n-progress {
  margin-right: 15px;
}
</style>
