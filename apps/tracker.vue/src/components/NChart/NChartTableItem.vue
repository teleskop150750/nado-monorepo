<script setup>
import { NAvatar } from '@nado/nado-vue-ui'

import NTableUsersCell from '../NTableUsersCell/NTableUsersCell.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="n-chart-table-item">
    <div class="n-chart-table-item__name">
      {{ task.name }}
    </div>
    <div class="n-chart-table-item__author">
      <NAvatar :user-name="`${task.author.fullName.firstName[0]}. ${task.author.fullName.lastName}`" :size="26" />
    </div>
    <div class="n-chart-table-item__author">
      <NTableUsersCell :max="2" :users="task.executors" />
    </div>
  </div>
</template>

<style>
.n-chart-table-item {
  display: grid;
  grid-template-columns: var(--n-chart-table-size);
  align-items: center;

  padding: 4px;
}

.n-chart-table-item__name {
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;
}
</style>
