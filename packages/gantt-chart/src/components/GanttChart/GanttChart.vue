<script setup lang="ts">
import { type ResizeObserverCallback, useDebounceFn, useResizeObserver } from '@vueuse/core'
import { computed, ref, type StyleValue } from 'vue'

import GanttAside from '../GanttAside/GanttAside.vue'
import GanttScrollbar from '../GanttScrollbar/GanttScrollbar.vue'
import GanttTimeline from '../GanttTimeline/GanttTimeline.vue'
import { useEdges, useNodes, useTimeline } from './composables'
import { ganttProps } from './gantt-chart'

const props = defineProps(ganttProps)

const timelineRef = ref<InstanceType<typeof GanttTimeline>>()
const asideRef = ref<InstanceType<typeof GanttAside>>()
const tableScrollLeft = ref(0)
const tableScrollTop = ref(0)

const tableWrapper = ref<HTMLDivElement>()
const tableWrapperHeight = ref(0)
const tableWrapperWidth = ref(0)

const { startDate, endDate, timelineWidth, primaryScale } = useTimeline(props, tableWrapperWidth)

const { ganttNodes } = useNodes(props, startDate, primaryScale)
const { ganttEdges } = useEdges(props, ganttNodes)

useResizeObserver(
  tableWrapper,
  useDebounceFn((entries: readonly ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const { contentRect } = entry

      const { width, height } = contentRect

      tableWrapperHeight.value = height
      tableWrapperWidth.value = width
    })
  }, 50) as ResizeObserverCallback,
)

const tableStyle = computed(() => ({
  width: `${timelineWidth.value}px`,
  height: `${props.nodes.length * props.cellHeight}px`,
}))

const gridStyle = computed(() => ({
  backgroundSize: `${props.cellWidth}px ${props.cellHeight}px`,
}))

function handleTableScroll({ scrollTop, scrollLeft }: { scrollTop: number; scrollLeft: number }) {
  tableScrollTop.value = scrollTop
  tableScrollLeft.value = scrollLeft
  timelineRef.value?.setScrollLeft(scrollLeft)

  asideRef.value?.setScrollTop(scrollTop)
}

const style = computed<StyleValue>(() => ({
  '--n-comp-gantt-header-height-user': `${props.headerHeight}px`
}))
</script>

<template>
  <div class="gantt-chart" :style="style">
    <div class="gantt-chart__container">
      <GanttAside ref="asideRef" class="gantt-chart__aside" :nodes="nodes" :body-height="tableWrapperHeight">
        <template #header>
          <slot name="aside-header" />
        </template>
        <template #default="{ node, index }">
          <slot name="aside-row" :node="node" :index="index" />
        </template>
      </GanttAside>
      <div class="gantt-chart__body">
        <div class="gantt-chart__timeline">
          <GanttTimeline
            ref="timelineRef"
            :start="startDate"
            :end="endDate"
            :scale="primaryScale"
            :scales="scales"
            :cell-width="cellWidth"
          />
        </div>
        <div ref="tableWrapper" class="gantt-chart__table-wrapper">
          <GanttScrollbar always @scroll="handleTableScroll">
            <div class="gantt-chart__table" :style="tableStyle">
              <div class="gantt-chart__grid" :style="gridStyle" />
              <svg class="gantt-chart__edges">
                <template v-for="edge in ganttEdges" :key="edge.id">
                  <polyline class="gantt-chart__edge" :points="edge.svg.path" />
                  <polygon class="gantt-chart__edge-arrow" :points="edge.svg.arrow" />
                </template>
              </svg>
              <div class="gantt-chart__nodes">
                <slot v-for="node in ganttNodes" name="node" :node="node">
                  <div :key="node.id" class="gantt-chart__node" :style="node.style"></div>
                </slot>
              </div>
            </div>
          </GanttScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gantt-chart {
  --n-comp-gantt-header-height: var(--n-comp-gantt-header-height-user, 100px);
  --n-comp-gantt-aside-width: 200px;
  --n-comp-gantt-body-height: calc(100% - var(--n-comp-gantt-header-height));
  --n-comp-gantt-body-width: calc(100% - var(--n-comp-gantt-aside-width));
  --n-comp-gantt-border-color: hsl(0deg 0% 52%);

  position: relative;

  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;

  width: 100%;
  height: 100%;
}

.gantt-chart::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';

  width: 100%;
  height: 100%;

  border: 1px solid var(--n-comp-gantt-border-color);

  pointer-events: none;
}

.gantt-chart__container {
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: var(--n-comp-gantt-aside-width) var(--n-comp-gantt-body-width);
  align-items: stretch;

  width: 100%;
  height: 100%;
}

.gantt-chart__body {
  display: grid;
  grid-template-rows: var(--n-comp-gantt-header-height) var(--n-comp-gantt-body-height);

  overflow: hidden;
}

.gantt-chart__timeline {
  display: grid;

  overflow: hidden;
}

.gantt-chart__table-wrapper {
  overflow: hidden;
}

.gantt-chart__table {
  position: relative;

  margin-top: 0;
  margin-left: 0;
}

.gantt-chart__grid {
  position: absolute;
  top: -1px;
  left: -1px;

  width: calc(100% + 1px);
  height: calc(100% + 1px);

  background-image: linear-gradient(rgb(0 0 0 / 10%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 0 0 / 10%) 1px, transparent 1px);
}

.gantt-chart__edges {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.gantt-chart__edge {
  position: absolute;
  z-index: 0;

  cursor: pointer;

  fill: transparent;
  stroke: turquoise;

  user-select: auto;
  pointer-events: stroke;
  stroke-width: 2;
}

.gantt-chart__edge-arrow {
  fill: turquoise;
  stroke: turquoise;
}

.gantt-chart__nodes {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;

  width: 100%;
  height: 100%;
}

.gantt-chart__node {
  text-overflow: ellipsis;

  /* background-color: tomato */
  background: tomato;

  overflow: hidden;
}
</style>
