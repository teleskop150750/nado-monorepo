<script setup lang="ts">
import { ref } from 'vue'

import GanttTimelineUnit from './GanttTimelineUnit.vue'
import { ganttTimelineProps } from './timeline'

defineProps(ganttTimelineProps)
const innerRef = ref<HTMLDivElement>()

const unitsRef = ref<Array<InstanceType<typeof GanttTimelineUnit>>>([])

function setScrollLeft(val: number) {
  unitsRef.value.forEach((comp) => {
    comp.setScrollLeft(val)
  })
}
defineExpose({
  setScrollLeft,
})
</script>

<template>
  <div class="gantt-timeline">
    <div ref="innerRef" class="gantt-timeline__inner">
      <GanttTimelineUnit
        v-for="item in scales"
        ref="unitsRef"
        :key="item.unit"
        :scale="item"
        :primary-scale="scale"
        :end="end"
        :start="start"
        :cell-width="cellWidth"
      />
    </div>
  </div>
</template>

<style>
.gantt-timeline {
  display: grid;

  overflow: hidden;
}

.gantt-timeline__inner {
  display: grid;
  grid-auto-rows: 1fr;

  scrollbar-width: none;

  overflow: hidden;
}

.gantt-timeline__inner::-webkit-scrollbar {
  display: none;
}
</style>
