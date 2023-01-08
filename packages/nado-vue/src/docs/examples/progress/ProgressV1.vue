<script setup>
import { NProgress } from '../../../components/index.js'

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`)
</script>

<template>
  <h3 class="n-title-3">Линейный индикатор выполнения</h3>

  <div class="demo-progress">
    <NProgress :percentage="50" />
    <NProgress :percentage="100" :format="format" />
    <NProgress :percentage="100" appearance="primary" />
    <NProgress :percentage="100" appearance="success" />
    <NProgress :percentage="100" appearance="warn" />
    <NProgress :percentage="50" appearance="error" />
  </div>
</template>

<style scoped>
.demo-progress .n-progress {
  width: 350px;
  margin-bottom: 15px;
}
</style>
