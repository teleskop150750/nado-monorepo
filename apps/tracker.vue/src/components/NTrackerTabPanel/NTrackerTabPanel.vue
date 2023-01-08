<script setup>
import { NScrollbar } from '@nado/nado-vue-ui'
import { ref } from 'vue'

const isTable = ref(true)

function setTable() {
  isTable.value = true
}

function setChar() {
  isTable.value = false
}
</script>

<template>
  <div class="n-tracker-tab-panel">
    <div class="n-tracker-tab-panel__header">
      <button
        class="n-tracker-tab-panel__herder-button"
        :class="[isTable && 'n-tracker-tab-panel__herder-button--active']"
        type="button"
        @click="setTable"
      >
        Таблица
      </button>
      <button
        class="n-tracker-tab-panel__herder-button"
        :class="[!isTable && 'n-tracker-tab-panel__herder-button--active']"
        type="button"
        @click="setChar"
      >
        Диаграмма
      </button>
    </div>

    <div class="n-tracker-tab-panel__body">
      <!-- <NScrollbar> -->
      <div v-if="isTable" class="n-tracker-tab-panel__body-item">
        <slot name="table" />
      </div>
      <div v-else class="n-tracker-tab-panel__body-item">
        <slot name="chart" />
      </div>
      <!-- </NScrollbar> -->
    </div>
  </div>
</template>

<style>
.n-tracker-tab-panel {
  display: grid;
  grid-template-rows: 56px 1fr;

  height: 100%;

  overflow: hidden;
}

.n-tracker-tab-panel__header {
  display: flex;
  gap: 1rem;

  padding: 0 1rem;

  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  background-color: var(--n-sys-color-secondary-800);
}

.n-tracker-tab-panel__herder-button {
  margin: 0;
  padding: 1rem;

  color: var(--n-ref-palette-white);
  font-weight: 700;
  font-size: 18px;

  border: 0;
  border-bottom: 4px solid transparent;

  background-color: transparent;

  cursor: pointer;
}

.n-tracker-tab-panel__herder-button:hover {
  color: var(--n-sys-color-primary);
}

.n-tracker-tab-panel__herder-button--active {
  color: var(--n-sys-color-primary);

  border-bottom: 4px solid var(--n-sys-color-primary);
}

.n-tracker-tab-panel__body {
  overflow: hidden;

  /* height: 500px; */

  /* overflow: auto; */
}

.n-tracker-tab-panel__body-item {
  height: 100%;

  overflow: hidden;
}
</style>
