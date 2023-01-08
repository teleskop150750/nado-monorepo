<script setup>
import { NScrollbar } from '@nado/nado-vue-ui'
import { ElTree } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useLoading } from '../../../../composables/useLoading.js'
import { useNotification } from '../../../../composables/useNotification.js'
import { FolderService } from '../../../../services/FolderService.js'
import { useMenuStore } from '../../../../store/menu.js'
import NIconLogo from '../../../icons/NIconLogo.vue'
import NMenuItem from './NMenuItem.vue'

const menuStore = useMenuStore()
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const defaultProps = {
  children: 'children',
  label: 'name',
}

const menu = menuStore.getMenu()
const route = useRoute()
const defaultExpandedKeys = computed(() => {
  if (route.name !== 'folder-tasks') {
    return []
  }

  return [route.params.id]
})

async function getFolders() {
  const response = await FolderService.getFolders()

  menuStore.setUserFolders(response.data.data)
}

async function getData() {
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
}

async function getDataInit() {
  openLoading()
  await getData()
  closeLoading()
}

getDataInit()
</script>

<template>
  <aside class="n-aside">
    <div class="n-aside__header">
      <RouterLink class="n-aside__header-link" :to="{ name: 'home' }">
        <span class="n-aside__header-link-icon">
          <NIconLogo />
        </span>
        <span class="n-aside__header-link-text"> nado </span>
      </RouterLink>
    </div>
    <div class="n-aside__body">
      <NScrollbar class="n-aside__body-scroll">
        <ElTree
          class="n-aside__tree"
          :data="menu"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <NMenuItem :node="node" :data="data" />
          </template>
        </ElTree>
      </NScrollbar>
    </div>
  </aside>
</template>

<style>
.n-aside {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 250px;

  width: 250px;
  height: 100vh;
  padding: 1.5rem 0;

  background-color: var(--n-sys-color-secondary-800);

  overflow: hidden;

  transition: width 0.3s;
}

.n-aside__header {
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 0.75rem;
}

.n-aside__header-link {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 100%;

  color: var(--n-ref-palette-white);
  font-weight: var(--n-sys-font-weight-bold);
  font-size: 2rem;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
}

.n-aside__header-link-icon {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  width: 54px;
  height: 54px;
  padding: calc((54px - 32px) / 2);
}

.n-aside__body {
  overflow: hidden;
}

.n-aside__body-scroll {
  height: 100%;
}

.n-aside__tree {
  color: var(--n-ref-palette-white);

  background-color: transparent;
}

.n-aside__tree .el-tree-node__content:hover {
  background-color: hsl(216deg 8% 60% / 30%);
}

.n-aside__tree .el-tree-node:focus > .el-tree-node__content {
  background-color: hsl(216deg 8% 60% / 30%);
}
</style>
