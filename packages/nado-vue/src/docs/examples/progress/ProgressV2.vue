<script setup>
import { NProgress } from '../../../components/index.js'
</script>

<template>
  <h3 class="n-title-3">Внутренний процент</h3>

  <div class="demo-progress">
    <NProgress :text-inside="true" :percentage="70" />
    <NProgress :text-inside="true" :stroke-width="24" :percentage="100" appearance="primary" />
    <NProgress :text-inside="true" :stroke-width="24" :percentage="100" appearance="success" />
    <NProgress :text-inside="true" :stroke-width="22" :percentage="80" appearance="warn" />
    <NProgress :text-inside="true" :stroke-width="32" :percentage="50" appearance="error" />
  </div>
</template>

<style scoped>
.demo-progress .n-progress {
  width: 350px;
  margin-bottom: 15px;
}
</style>
