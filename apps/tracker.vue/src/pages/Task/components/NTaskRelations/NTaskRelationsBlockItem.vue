<script setup>
import { NIconDelete } from '@nado/nado-vue-ui'

defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

function deleteTask(id) {
  emit('delete', id)
}
</script>

<template>
  <div class="n-task-relations-block-item">
    <div class="n-task-relations-block-item__name">{{ task.value.name }}</div>
    <button class="n-task-relations-block-item__delete" type="button" aria-label="delete" @click="deleteTask(task.id)">
      <NIconDelete class="n-task-relations-block-item__delete-icon" />
    </button>
  </div>
</template>

<style>
.n-task-relations-block-item {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;

  white-space: nowrap;
}

.n-task-relations-block-item__name {
  flex-grow: 1;

  height: 30px;
  padding: 0 0.5rem;

  line-height: 30px;
  text-overflow: ellipsis;

  border: 1px solid var(--n-ref-palette-neutral-400);
  border-radius: 4px;

  overflow: hidden;
}

.n-task-relations-block-item__delete {
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

  background-color: var(--n-ref-palette-red-500);

  cursor: pointer;
}

.n-task-relations-block-item__delete-icon {
  width: 22px;
  height: 22px;

  pointer-events: none;
}
</style>
