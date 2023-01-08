<script setup>
import { NVirtualGrid } from '../components/index.js'
import NCard from './NCard.vue'

const multiItems = Array.from({ length: 100 }).map((_) => Array.from({ length: 100 }).map((_j) => 100))

const columnWidths = Array.from({ length: 100 }).map((_, i) => (50 + i < 400 ? 50 + i : 400))

function getSize(idx) {
  return columnWidths[idx]
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Virtual Grid</h2>
    <h3 class="n-title-3">Fixed size</h3>

    <div class="row">
      <NVirtualGrid
        ref="fixVertical"
        :scrollbar-always-on="true"
        :width="300"
        :height="300"
        :column-width="100"
        :row-height="100"
        :data="multiItems"
      >
        <template #default="{ columnIndex, style, rowIndex }">
          <div
            class="scrollbar-demo-item"
            :class="[
              ((columnIndex % 2 === 0 && rowIndex % 2 !== 0) || (columnIndex % 2 !== 0 && rowIndex % 2 === 0)) &&
                'scrollbar-demo-item--white',
            ]"
            :style="style"
          >
            item {{ rowIndex }} {{ columnIndex }}
          </div>
        </template>
      </NVirtualGrid>
    </div>

    <h3 class="n-title-3">Dynamic size</h3>

    <div class="row">
      <NVirtualGrid
        ref="fixVertical"
        :scrollbar-always-on="true"
        :width="300"
        :height="300"
        :column-width="getSize"
        :row-height="getSize"
        :data="multiItems"
      >
        <template #default="{ columnIndex, style, rowIndex }">
          <div
            class="scrollbar-demo-item"
            :class="[
              ((columnIndex % 2 === 0 && rowIndex % 2 !== 0) || (columnIndex % 2 !== 0 && rowIndex % 2 === 0)) &&
                'scrollbar-demo-item--white',
            ]"
            :style="style"
          >
            {{ rowIndex }} {{ columnIndex }}
          </div>
        </template>
      </NVirtualGrid>
    </div>
  </NCard>
</template>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;

  color: var(--n-sys-color-secondary-600);
  text-align: center;

  background: var(--n-sys-color-secondary-100);
}

.scrollbar-demo-item--white {
  background: var(--n-ref-palette-white);
}

.scrollbar-flex-content {
  display: flex;
}

.scrollbar-flex-demo-item {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 50px;
  margin: 10px;

  color: var(--n-sys-color-primary-600);
  text-align: center;

  border-radius: 4px;

  background: var(--n-sys-color-primary-100);
}
</style>
