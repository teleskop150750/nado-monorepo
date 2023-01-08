<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { computed } from 'vue'

import { useVirtualList } from '../../composables/useVirtualList'
import { getUnitWidth } from './composables'
import { ganttTimelineUnitProps } from './timeline'
import { getUnitListInRange } from './utils'

const props = defineProps(ganttTimelineUnitProps)

const diff = computed(() =>
  getUnitListInRange(props.start, props.end, props.scale).map((item) => ({
    size: getWidth(item),
    date: item,
  })),
)

const { list, containerProps, wrapperProps } = useVirtualList(diff, {
  itemWidth: (index) => diff.value[index].size,
})

function getWidth(date: Dayjs) {
  if (props.scale.unit === props.primaryScale.unit) {
    return props.cellWidth * props.scale.step
  }

  console.log('getUnitWidth', getUnitWidth(date, props));
  
  return getUnitWidth(date, props)
}

function setScrollLeft(val: number) {
  if (!containerProps.ref.value) {
    return
  }

  containerProps.ref.value.scrollLeft = val
}

defineExpose({
  setScrollLeft,
})
</script>

<template>
  <div class="gantt-timeline-unit">
    <div class="gantt-timeline-unit__inner" v-bind="containerProps">
      <div class="gantt-timeline-unit__list" v-bind="wrapperProps">
        <div
          v-for="{ index, data } in list"
          :key="`${index}-${scale.unit}`"
          class="gantt-timeline-unit__list-item"
          :style="{ width: `${data.size}px` }"
        >
          <div class="gantt-timeline-unit__list-item-data">
            {{ data.date.format(scale.format) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gantt-timeline-unit {
  display: flex;

  border-bottom: 1px solid var(--n-comp-gantt-border-color);

  overflow: hidden;
}

.gantt-timeline-unit__inner {
  overflow: hidden;
}

.gantt-timeline-unit__list {
  box-sizing: border-box;
}

.gantt-timeline-unit__list-item {
  display: grid;
  flex: none;
  justify-content: center;
  align-items: center;

  padding: 4px;

  border-right: 1px solid var(--n-comp-gantt-border-color);
}

.gantt-timeline-unit__list-item-data {
  text-overflow: ellipsis;

  overflow: hidden;
}
</style>
