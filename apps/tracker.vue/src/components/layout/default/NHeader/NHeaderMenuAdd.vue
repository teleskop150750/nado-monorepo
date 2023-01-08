<script setup>
import { NButton, NDropdown, NDropdownItem, NDropdownMenu, NIconFolder, NIconPlus } from '@nado/nado-vue-ui'
import { ref } from 'vue'

const isVisible = ref(false)

function close() {
  isVisible.value = false
}

function toggle() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <NDropdown>
    <NButton :icon="NIconPlus" @click="toggle" />
    <template #dropdown>
      <NDropdownMenu>
        <NDropdownItem>
          <NButton :icon="NIconFolder" :to="{ name: 'folders-create' }" link label="Создать папку" @click="close" />
        </NDropdownItem>
        <NDropdownItem>
          <NButton :icon="NIconFolder" :to="{ name: 'tasks-create' }" link label="Создать задачу" @click="close" />
        </NDropdownItem>
      </NDropdownMenu>
    </template>
  </NDropdown>
</template>

<style>
.n-header-menu-add__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
</style>
