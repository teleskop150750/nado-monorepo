<script setup>
import { NTooltip } from '@nado/nado-vue-ui'
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const path = computed(() => props.task.value.folders.map((folder) => folder.name))
</script>

<template>
  <NTooltip placement="left">
    <template #content>
      <div class="n-task-option-path-preview">
        <span
          v-for="(pathItem, index) in path"
          :key="index"
          class="n-task-option-path-preview__item"
          disable-transitions
          type="warning"
          size="small"
        >
          <span class="n-task-option-path-preview__item-name">
            {{ pathItem }}
          </span>
        </span>
      </div>
    </template>
    <div class="n-task-option">
      <span class="n-task-option__name">{{ task.label }}</span>
      <div class="n-task-option__path">
        <span
          v-for="(pathItem, index) in path"
          :key="index"
          class="n-task-option__path-item"
          disable-transitions
          type="warning"
          size="small"
        >
          <span class="n-task-option__path-item-name">
            {{ pathItem }}
          </span>
        </span>
      </div>
    </div>
  </NTooltip>
</template>

<style>
.n-task-option {
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;

  height: 100%;
}

.n-task-option__name {
  font-weight: 600;
  line-height: 1.5rem;
  text-overflow: ellipsis;

  overflow: hidden;
}

.n-task-option__path {
  height: 20px;
  min-width: 0;
  margin: 0;

  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;

  overflow: hidden;
}

.n-select-v2-dropdown__item--is-selected .n-task-option__path {
  color: var(--n-sys-color-secondary);
  font-weight: var(--n-sys-font-weight-regular);
}

.n-task-option__path-item {
  display: inline-flex;
  gap: 2px;
  align-items: center;

  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.n-task-option__path-item:not(.n-task-option__path-item:last-child)::after {
  content: '';

  display: flex;

  width: 10px;
  height: 10px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 500 500'%3E%3Cpath d='M377 219c8 9 12 20 12 31H248L120 122a31 31 0 0 1 0-45l40-40c9-9 25-9 35 0l182 182z' style='fill:%2317a2ff'/%3E%3Cpath d='M389 250c0 11-4 22-12 31L195 463c-10 9-26 9-35 0l-40-40a31 31 0 0 1 0-45l128-128h141z' style='fill:%23008eed'/%3E%3C/svg%3E");
}

.n-task-option-path-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  align-items: center;

  max-width: 300px;
}

.n-task-option-path-preview__item {
  display: inline-flex;
  gap: 2px;
  align-items: center;

  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.n-task-option-path-preview__item:not(.n-task-option-path-preview__item:last-child)::after {
  content: '';

  display: flex;

  width: 10px;
  height: 10px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 500 500'%3E%3Cpath d='M377 219c8 9 12 20 12 31H248L120 122a31 31 0 0 1 0-45l40-40c9-9 25-9 35 0l182 182z' style='fill:%2317a2ff'/%3E%3Cpath d='M389 250c0 11-4 22-12 31L195 463c-10 9-26 9-35 0l-40-40a31 31 0 0 1 0-45l128-128h141z' style='fill:%23008eed'/%3E%3C/svg%3E");
}
</style>
