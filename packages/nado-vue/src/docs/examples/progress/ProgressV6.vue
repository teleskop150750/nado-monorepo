<script setup>
import { NButton, NProgress } from '../../../components/index.js'
import { NIconCheck } from '../../../icons/index.js'
</script>

<template>
  <h3 class="n-title-3">Круглый индикатор выполнения</h3>

  <div class="demo-progress">
    <NProgress :percentage="50">
      <NButton link>Content</NButton>
    </NProgress>
    <NProgress :text-inside="true" :stroke-width="20" :percentage="50" appearance="error">
      <span>Content</span>
    </NProgress>
    <NProgress type="circle" :percentage="100" appearance="success">
      <NButton appearance="success" :icon="NIconCheck" />
    </NProgress>
    <NProgress type="dashboard" :percentage="80">
      <template #default="{ percentage }">
        <span class="percentage-wrapper">
          <span class="percentage-value">{{ percentage }}%</span>
          <span class="percentage-label">Progressing</span>
        </span>
      </template>
    </NProgress>
  </div>
</template>

<style scoped>
.percentage-value {
  display: block;

  margin-top: 10px;

  font-size: 28px;
}

.percentage-label {
  display: block;

  margin-top: 10px;

  font-size: 12px;
}

.demo-progress .n-progress--type-line {
  width: 350px;
  margin-bottom: 15px;
}

.demo-progress .n-progress--type-circle {
  margin-right: 15px;
}

.percentage-wrapper {
  text-align: center;
}
</style>
