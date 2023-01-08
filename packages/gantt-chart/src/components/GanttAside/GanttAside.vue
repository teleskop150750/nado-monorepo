<script setup lang="ts">
import { computed } from 'vue'

import { useVirtualList } from '../../composables'
import GanttScrollbar from '../GanttScrollbar/GanttScrollbar.vue'
import { ganttAsideProps } from './aside'

const props = defineProps(ganttAsideProps)

const dataList = computed(() => props.nodes)

const { list, containerProps, wrapperProps } = useVirtualList(dataList, {
  itemHeight: props.cellHeight,
})

function setScrollTop(val: number) {
  if (!containerProps.ref.value) {
    return
  }

  containerProps.ref.value.scrollTop = val
}

defineExpose({
  setScrollTop,
})
</script>

<template>
  <aside class="gantt-aside">
    <GanttScrollbar always class="gantt-aside__scrollbar" wrap-class="gantt-aside__wrap" view-class="gantt-aside__view">
      <div class="gantt-aside__inner">
        <div class="gantt-aside__header">
          <slot name="header"> </slot>
        </div>
        <div class="gantt-aside__body" v-bind="containerProps" :style="{ height: `${bodyHeight}px` }">
          <div class="gantt-aside__list" v-bind="wrapperProps">
            <div
              v-for="{ data, index } in list"
              :key="data.id"
              class="gantt-aside__list-item-wrapper"
              :style="{ height: `${props.cellHeight}px` }"
            >
              <slot :node="data" :index="index" />
            </div>
          </div>
        </div>
      </div>
    </GanttScrollbar>
  </aside>
</template>

<style>
.gantt-aside {
  border-right: 1px solid var(--n-comp-gantt-border-color);
}

.gantt-aside__inner {
  display: table;

  width: 100%;
  height: 100%;
}

.gantt-aside__header {
  height: var(--n-comp-gantt-header-height);

  border-bottom: 1px solid var(--n-comp-gantt-border-color);
}

.gantt-aside__body {
  overflow-y: hidden;
}

.gantt-aside__list-container {
  height: 100%;
}

.gantt-aside__list-item-wrapper {
  border-bottom: 1px solid var(--n-comp-gantt-border-color);
}
</style>
