<script setup>
import { EDGE_TYPES, GanttChart } from '@nado/nado-gantt-chart'
import { NOption, NSelect } from '@nado/nado-vue-ui'
import { computedEager } from '@vueuse/core'
import { computed, ref } from 'vue'

import NChartTableHeader from './NChartTableHeader.vue'
import NChartTableItem from './NChartTableItem.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

const nodes = computedEager(() =>
  props.tasks.map((el) => ({
    id: el.id,
    startDate: el.startDate,
    endDate: el.endDate,
    data: el,
  })),
)

const edges = computedEager(() => {
  const map = {}

  props.tasks.forEach((el) => {
    el.inverseTaskRelationships.forEach((rel) => {
      map[rel.id] = {
        id: rel.id,
        source: el.id,
        target: rel.left.id,
        type: EDGE_TYPES.END_START,
      }
    })
    el.taskRelationships.forEach((rel) => {
      map[rel.id] = {
        id: rel.id,
        target: rel.right.id,
        source: el.id,
        type: EDGE_TYPES.END_START,
      }
    })
  })

  return Object.values(map)
})

const scalesOptions = [
  {
    id: 1,
    label: 'Месяц',
    value: 1,
    data: [
      { unit: 'year', step: 1, format: 'YYYY' },
      { unit: 'month', step: 1, format: 'MMMM' },
    ],
  },
  {
    id: 2,
    label: 'Неделя',
    value: 2,
    data: [
      { unit: 'month', step: 1, format: 'MMMM' },
      { unit: 'week', step: 1, format: 'ww' },
      { unit: 'day', step: 2, format: 'DD' },
    ],
  },
  {
    id: 3,
    label: 'День',
    value: 3,
    data: [
      { unit: 'month', step: 1, format: 'MMMM' },
      { unit: 'day', step: 1, format: 'DD' },
    ],
  },
]

const scalesModel = ref(scalesOptions[2].value)

const scales = computed(() => {
  const found = scalesOptions.find((el) => el.id === scalesModel.value)

  if (!found) {
    return []
  }

  return found.data
})
</script>

<template>
  <div class="n-chart">
    <div class="n-chart__header">
      <NSelect v-model="scalesModel" size="small">
        <NOption
          v-for="item in scalesOptions"
          :key="item.value"
          value-key="id"
          :label="item.label"
          :value="item.value"
        />
      </NSelect>
    </div>
    <div class="n-chart__body">
      <GanttChart
        :cell-width="100"
        :cell-height="40"
        :nodes="nodes"
        :edges="edges"
        :header-height="50"
        :scales="scales"
      >
        <template #aside-header>
          <NChartTableHeader />
        </template>
        <template #aside-row="{ node }">
          <NChartTableItem :task="node.data" />
        </template>
        <template #node="{ node }">
          <div class="gantt-chart__node" :style="node.style">
            {{ node.data.name }}
          </div>
        </template>
      </GanttChart>
    </div>
  </div>
</template>

<style>
.n-chart {
  --n-chart-table-size: 120px 46px 80px;

  display: grid;
  grid-template-rows: min-content 1fr;

  height: 100%;

  /* height: 300px; */
}

.n-chart__header {
  padding: 0.5rem;
}

.n-chart__body {
  height: 100%;

  overflow: hidden;
}
</style>
