<script setup>
import { NProgress } from '../../../components/index.js'
</script>

<template>
  <h3 class="n-title-3">Круглый индикатор выполнения</h3>

  <div class="demo-progress">
    <NProgress type="circle" :percentage="0" />
    <NProgress type="circle" :percentage="25" />
    <NProgress type="circle" :percentage="100" appearance="success" />
    <NProgress type="circle" :percentage="70" appearance="warn" />
    <NProgress type="circle" :percentage="50" appearance="error" />
  </div>
</template>

<style scoped>
.demo-progress .n-progress {
  margin-right: 15px;
}
</style>
