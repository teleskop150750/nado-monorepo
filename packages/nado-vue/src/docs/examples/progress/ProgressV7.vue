<script setup>
import { NProgress } from '../../../components/index.js'

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`)
</script>

<template>
  <h3 class="n-title-3">Круглый индикатор выполнения</h3>

  <div class="demo-progress">
    <NProgress :percentage="50" :indeterminate="true" />
    <NProgress :percentage="100" :format="format" :indeterminate="true" />
    <NProgress :percentage="100" appearance="primary" :indeterminate="true" :duration="5" />
    <NProgress :percentage="100" appearance="success" :indeterminate="true" :duration="5" />
    <NProgress :percentage="100" appearance="warn" :indeterminate="true" :duration="1" />
    <NProgress :percentage="50" appearance="error" :indeterminate="true" />
  </div>
</template>

<style scoped>
.demo-progress .n-progress--type-line {
  width: 350px;
  margin-bottom: 15px;
}
</style>
