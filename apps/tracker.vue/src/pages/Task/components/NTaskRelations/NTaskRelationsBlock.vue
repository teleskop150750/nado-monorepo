<script setup>
import { NIconPlus, NPopover, NSelectV2 } from '@nado/nado-vue-ui'
import { ref, watch } from 'vue'

import NTaskOption from '../../../../components/NTaskOption/NTaskOption.vue'
import IconInfo from './IconInfo.vue'
import NTaskRelationsBlockItem from './NTaskRelationsBlockItem.vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tasks: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:selected'])
const selectedTask = ref(props.tasks.length > 0 ? props.tasks[0].value.id : null)

function addTask() {
  if (!selectedTask.value) {
    return
  }

  if (props.selected.some((el) => el.value.id !== selectedTask.value.id)) {
    return
  }

  emit('update:selected', [...props.selected, selectedTask.value])
}

function deleteTask(id) {
  emit(
    'update:selected',
    props.selected.filter((el) => el.id !== id),
  )
}

watch(
  () => props.tasks,
  () => {
    selectedTask.value = props.tasks.length > 0 ? props.tasks[0].value.id : null
  },
)
</script>

<template>
  <div class="n-task-relations-block">
    <div class="n-task-relations-block__header">
      <p class="n-task-relations-block__title">
        <slot name="title" />
      </p>

      <div class="n-task-relations-block__info-wrapper">
        <NPopover placement="top" :width="250" trigger="hover">
          <template #reference>
            <IconInfo class="n-task-relations-block__info" />
          </template>
          <template #default>
            <div>
              <slot name="description" />
            </div>
          </template>
        </NPopover>
      </div>
    </div>

    <div v-if="selected.length > 0" class="n-task-relations-block__body">
      <div class="n-task-relations-block__list">
        <NTaskRelationsBlockItem v-for="task in selected" :key="task.value.id" :task="task" @delete="deleteTask" />
      </div>
    </div>

    <div class="n-task-relations-block__footer">
      <NSelectV2
        v-model="selectedTask"
        :options="tasks"
        value-key="value.id"
        filterable
        :item-height="52"
        style="width: 100%"
        placeholder="Выберите"
      >
        <template #default="{ item }">
          <NTaskOption :task="item" />
        </template>
      </NSelectV2>

      <button class="n-task-relations-block__add" type="button" aria-label="add" @click="addTask">
        <NIconPlus class="n-task-relations-block__add-icon" />
      </button>
    </div>
  </div>
</template>

<style>
.n-task-relations-block {
  padding: 1rem;

  border: 1px solid var(--n-ref-palette-neutral-400);
  border-radius: 4px;
}

.n-task-relations-block__header {
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: 1rem;
  align-items: center;

  margin-bottom: 0.5rem;
}

.n-task-relations-block__title {
  margin: 0;

  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;
}

.n-task-relations-block__info-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 32px;
  height: 32px;
}

.n-task-relations-block__info {
  cursor: pointer;
}

.n-task-relations-block__body {
  margin-bottom: 1rem;
}

.n-task-relations-block__list {
  display: grid;
  gap: 0.4rem;
}

.n-task-relations-block__footer {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  align-items: center;
}

.n-task-relations-block__add {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;

  color: var(--n-ref-palette-white);

  border: 0;
  border-radius: 30px;

  background-color: var(--n-ref-palette-green-500);

  cursor: pointer;
}

.n-task-relations-block__add-icon {
  width: 22px;
  height: 22px;

  pointer-events: none;
}
</style>
