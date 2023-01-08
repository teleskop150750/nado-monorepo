<script setup>
import { NScrollbar } from '@nado/nado-vue-ui'
import { ElTree } from 'element-plus'
import { inject } from 'vue'

import { useLoading } from '../../composables/useLoading.js'
import { useNotification } from '../../composables/useNotification.js'
import { FolderService } from '../../services/FolderService.js'
import { useMenuStore } from '../../store/menu.js'
import { LAYOUT_DEFAULT_KEY } from '../../tokens/layout-default.js'
import NMenuEditItem from './components/NMenuEditItem.vue'

const menuStore = useMenuStore()
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Редактировать меню')

const menu = menuStore.getMenu()
const defaultProps = {
  children: 'children',
  label: 'name',
}

async function getDataInit() {
  openLoading()
  try {
    await Promise.all([getFolders()])
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

  menuStore.setUserFolders(response.data.data)
}

getDataInit()

async function deleteFolder(id) {
  openLoading()
  try {
    await FolderService.delete(id)
    await Promise.all([getFolders()])
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
    <div class="menu-edit-page">
      <ElTree
        class="menu-edit-tree"
        :data="menu"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <NMenuEditItem :node="node" :data="data" @delete="deleteFolder" />
        </template>
      </ElTree>
    </div>
  </NScrollbar>
</template>

<style>
.menu-edit-page {
  padding: 2rem;
}

.menu-edit-page .el-tree-node__content {
  height: 32px;
}
</style>
