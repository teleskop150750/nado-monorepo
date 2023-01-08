<script setup>
import { NScrollbar } from '@nado/nado-vue-ui'
import { inject, ref } from 'vue'

import { FOLDER_TYPE } from '../../components/layout/default/NAside/constants.js'
import NFoldersTable from '../../components/NFoldersTable/NFoldersTable.vue'
import NTasksTable from '../../components/NTasksTable/NTasksTable.vue'
import VTitle from '../../components/VTitle/VTitle.vue'
import { useLoading } from '../../composables/useLoading.js'
import { useNotification } from '../../composables/useNotification.js'
import { FolderService } from '../../services/FolderService.js'
import { TaskService } from '../../services/TaskService.js'
import { LAYOUT_DEFAULT_KEY } from '../../tokens/layout-default.js'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Поиск')
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const folders = ref([])
const tasks = ref([])

async function getDataInit() {
  openLoading()
  try {
    await Promise.all([getFolders(), getTasks()])
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

async function getFolders() {
  const response = await FolderService.getFolders()
  const responseFolders = response.data.data.filter((el) => el.type !== FOLDER_TYPE.ROOT_USER)

  folders.value = responseFolders
}

async function getTasks() {
  const response = await TaskService.getTasks()

  tasks.value = response.data.data
}

getDataInit()

async function deleteFolder(id) {
  openLoading()
  try {
    await FolderService.delete(id)
    await Promise.all([getFolders(), getTasks()])
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

async function handleDelete(id) {
  openLoading()
  try {
    await TaskService.delete(id)
    await Promise.all([getFolders(), getTasks()])
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
</script>

<template>
  <NScrollbar>
    <div class="page-search">
      <div class="page-search-box">
        <VTitle class="page-search-box__title" level="2">Папки</VTitle>

        <div class="page-search-box__table">
          <NFoldersTable :data="folders" @delete="deleteFolder" />
        </div>
      </div>

      <div class="page-search-box">
        <VTitle class="page-search-box__title" level="2">Задачи</VTitle>

        <div class="page-search-box__table">
          <NTasksTable :data="tasks" @delete="handleDelete" />
        </div>
      </div>
    </div>
  </NScrollbar>
</template>

<style>
.page-search {
  display: grid;
  grid-template-columns: 100%;

  width: 100%;
  padding: 2rem 1rem 3rem 0;

  overflow: hidden;
}

.page-search-box {
  display: grid;
  grid-template-columns: 100%;

  width: 100%;

  overflow: hidden;
}

.page-search-box + .page-search-box {
  margin-top: 2rem;
}

.page-search-box__title {
  margin: 0;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.page-search-box__table {
  height: 400px;
}
</style>
