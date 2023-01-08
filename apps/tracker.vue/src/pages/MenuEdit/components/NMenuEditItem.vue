<script setup>
import { NButton } from '@nado/nado-vue-ui'
import { computed } from 'vue'

import { FOLDER_TYPE } from '../../../components/layout/default/NAside/constants.js'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const link = computed(() => {
  if (props.node.data.type === FOLDER_TYPE.ALL) {
    return undefined
  }

  if (props.node.data.type === FOLDER_TYPE.AUTHOR) {
    return undefined
  }

  if (props.node.data.type === FOLDER_TYPE.EXECUTOR) {
    return undefined
  }

  if (props.node.data.type === FOLDER_TYPE.INDEFINITE) {
    return undefined
  }

  if (props.node.data.type === FOLDER_TYPE.ROOT_USER) {
    return undefined
  }

  if (props.node.data.type === FOLDER_TYPE.ROOT_SHARED) {
    return undefined
  }

  return { name: 'folder-update', params: { id: props.node.data.id } }
})

function deleteHandler() {
  emit('delete', props.node.data.id)
}
</script>

<template>
  <div class="menu-edit-node">
    <div class="menu-edit-node__inner">
      <span class="menu-edit-node__label">{{ node.label }}</span>
      <div v-if="link" class="menu-edit-node__actions">
        <NButton :to="link" label="Редактировать" plain size="small" />
        <NButton appearance="primary" plain label="Удалить" size="small" @click="deleteHandler" />
      </div>
    </div>
  </div>
</template>

<style>
.menu-edit-node {
  width: 100%;
}

.menu-edit-node__inner {
  display: flex;
  align-items: center;

  width: 100%;
  padding: 4px;

  overflow: hidden;
}

.menu-edit-node__label {
  width: 100%;

  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;

  overflow: hidden;
}

.menu-edit-node__actions {
  display: flex;
  gap: 0.5rem;
}
</style>
