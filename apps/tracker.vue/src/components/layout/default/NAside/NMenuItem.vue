<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { FOLDER_TYPE } from './constants.js'

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

const link = computed(() => {
  if (props.node.data.type === FOLDER_TYPE.ALL) {
    return { name: 'tasks-all' }
  }

  if (props.node.data.type === FOLDER_TYPE.AUTHOR) {
    return { name: 'tasks-author' }
  }

  if (props.node.data.type === FOLDER_TYPE.EXECUTOR) {
    return { name: 'tasks-executor' }
  }

  if (props.node.data.type === FOLDER_TYPE.INDEFINITE) {
    return { name: 'tasks-indefinite' }
  }

  if (props.node.data.type === FOLDER_TYPE.ROOT_USER) {
    return { name: 'folder-me' }
  }

  if (props.node.data.type === FOLDER_TYPE.ROOT_SHARED) {
    return { name: 'folder-shared' }
  }

  return { name: 'folder-tasks', params: { id: props.node.data.id } }
})
// v-if="link"
</script>

<template>
  <span class="menu-tree-node">
    <RouterLink v-if="link" :to="link" class="menu-tree-node__label" exact-active-class="menu-tree-node__label--active">
      {{ node.label }}
    </RouterLink>
    <span v-else class="menu-tree-node__label">{{ node.label }}</span>
  </span>
</template>

<style>
.menu-tree-node {
  display: flex;

  width: 100%;

  overflow: hidden;
}

.menu-tree-node__label {
  width: 100%;

  color: white;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;

  overflow: hidden;
}

.menu-tree-node__label--active {
  text-decoration: underline;
}
</style>
