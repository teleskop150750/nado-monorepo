<script setup>
import { ElContainer } from 'element-plus'
import { inject } from 'vue'

import { LAYOUT_DEFAULT_KEY } from '../tokens/layout-default.js'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Главная')
</script>

<template>
  <ElContainer />
</template>
