<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NChart from '../../../components/NChart/NChart.vue'
import NNotFound from '../../../components/NNotFound/NNotFound.vue'
import NTasksTable from '../../../components/NTasksTable/NTasksTable.vue'
import NTrackerTabPanel from '../../../components/NTrackerTabPanel/NTrackerTabPanel.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { FolderService } from '../../../services/FolderService.js'
import { TaskService } from '../../../services/TaskService.js'
import { LAYOUT_DEFAULT_KEY } from '../../../tokens/layout-default.js'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Папка')
const route = useRoute()
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const isFoundFolder = ref(true)
const tasks = ref([])

const tableTasks = computed(() =>
  tasks.value.filter((taskEl) => taskEl.folders.some((folderEl) => folderEl.id === route.params.id)),
)

async function getDataInit() {
  openLoading()
  try {
    await Promise.all([getTasks(), getFolder()])
  } catch (error) {
    if (error.response.data.title) {
      openNotification({
        title: 'Error',
        message: error.response.data.title,
        type: 'error',
      })
    }
  }
  closeLoading()
}

async function getTasks() {
  const response = await TaskService.getFolderTasks(route.params.id)

  tasks.value = response.data.data
}

async function getFolder() {
  try {
    const response = await FolderService.getFolder(route.params.id)
    const responseFolder = response.data.data

    layout.setTitle(responseFolder.name)
  } catch (error) {
    isFoundFolder.value = false
    layout.setTitle('404')
    throw error
  }
}

getDataInit()

async function handleDelete(id) {
  openLoading()
  try {
    await TaskService.delete(id)
    await Promise.all([getTasks()])
  } catch (error) {
    if (error.response.data.title) {
      openNotification({
        title: 'Error',
        message: error.response.data.title,
        type: 'error',
      })
    }
  }
  closeLoading()
}

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      getDataInit()
    }
  },
)
</script>

<template>
  <NTrackerTabPanel v-if="isFoundFolder">
    <template #table>
      <NTasksTable :data="tableTasks" @delete="handleDelete" />
    </template>
    <template #chart>
      <NChart :tasks="tasks" />
    </template>
  </NTrackerTabPanel>
  <NNotFound v-else />
</template>
