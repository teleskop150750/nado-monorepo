<script setup>
import { ref } from 'vue'

import { NButton, NButtonGroup, NProgress } from '../../../components/index.js'
import { NIconMinus, NIconPlus } from '../../../icons/index.js'

const percentage = ref(20)
const customColor = ref('#409eff')

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

function customColorMethod(val) {
  if (val < 30) {
    return '#909399'
  }

  if (val < 70) {
    return '#e6a23c'
  }

  return '#67c23a'
}

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
</script>

<template>
  <h3 class="n-title-3">Пользовательский цвет</h3>

  <div class="demo-progress">
    <NProgress :percentage="percentage" :color="customColor" />

    <NProgress :percentage="percentage" :color="customColorMethod" />

    <NProgress :percentage="percentage" :color="customColors" />
    <NProgress :percentage="percentage" :color="customColors" />
    <div>
      <NButtonGroup>
        <NButton plain :icon="NIconMinus" @click="decrease" />
        <NButton plain :icon="NIconPlus" @click="increase" />
      </NButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.demo-progress .n-progress {
  width: 350px;
  margin-bottom: 15px;
}
</style>
