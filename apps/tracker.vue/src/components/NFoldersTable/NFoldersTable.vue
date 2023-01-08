<script setup>
import { dayjs, NAvatar, NButton, NInput } from '@nado/nado-vue-ui'
import { useResizeObserver } from '@vueuse/core'
import { ElConfigProvider, ElTable, ElTableColumn } from 'element-plus'
import ru from 'element-plus/dist/locale/ru.mjs'
import { computed, ref } from 'vue'

import NTableUsersCell from '../NTableUsersCell/NTableUsersCell.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['delete'])

const search = ref('')
const filterTableData = computed(() =>
  props.data.filter((data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())),
)

const users = computed(() => {
  let list = []

  filterTableData.value.forEach((el) => {
    list = [...list, ...el.sharedUsers]
  })

  const map = Object.fromEntries(list.map((next) => [next.id, next]))

  return Object.values(map).map((user) => ({
    value: user.id,
    text: `${user.fullName.firstName[0]}. ${user.fullName.lastName}`,
  }))
})

const filterUsers = (value, row) => {
  const _users = row.sharedUsers

  return _users.some((el) => el.id === value)
}

const el = ref()
const height = ref(0)

useResizeObserver(el, (entries) => {
  const entry = entries[0]

  height.value = entry.contentRect.height
})

function handleDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <ElConfigProvider :locale="ru">
    <div ref="el" class="n-folders-table-wrapper">
      <ElTable class="n-folders-table" :height="height" :data="filterTableData" style="width: 100%">
        <ElTableColumn fixed label="Название" prop="name">
          <template #default="scope">
            <span class="n-folders-table__name">
              {{ scope.row.name }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Автор" prop="author" width="80">
          <template #default="scope">
            <NAvatar
              :size="26"
              :user-name="`${scope.row.author.fullName.firstName[0]}. ${scope.row.author.fullName.lastName}`"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="Участники" prop="sharedUsers" :filters="users" :filter-method="filterUsers" width="250">
          <template #default="scope">
            <NTableUsersCell :max="5" :users="scope.row.sharedUsers" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="Дата создания" sortable prop="createdAt" width="160">
          <template #default="scope">
            {{ dayjs(scope.row.createdAt).format('DD.MM.YYYY') }}
          </template>
        </ElTableColumn>
        <ElTableColumn width="250" fixed="right">
          <template #header>
            <div class="n-folders-table__search">
              <NInput v-model="search" size="small" placeholder="Поиск" />
            </div>
          </template>
          <template #default="scope">
            <div class="n-folders-table__actions">
              <NButton
                :to="{ name: 'folder-update', params: { id: scope.row.id } }"
                label="Редактировать"
                plain
                size="small"
              />
              <NButton appearance="primary" plain label="Удалить" size="small" @click="handleDelete(scope.row.id)" />
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </ElConfigProvider>
</template>

<style>
.n-folders-table-wrapper {
  height: 100%;
}

.n-folders-table.el-table th.el-table__cell > .cell.highlight {
  color: var(--n-sys-color-primary-800);
}

.n-folders-table.el-table thead {
  color: var(--n-sys-color-primary);
  font-weight: 500;
}

.n-folders-table__search {
  padding: 4px;
}

.n-folders-table__name {
  text-overflow: ellipsis;

  overflow: hidden;
}

.n-folders-table__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
