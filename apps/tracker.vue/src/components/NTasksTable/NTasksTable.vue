<script setup>
import { dayjs, NAvatar, NButton, NInput } from '@nado/nado-vue-ui'
import { useResizeObserver } from '@vueuse/core'
import { ElConfigProvider, ElTable, ElTableColumn } from 'element-plus'
import ru from 'element-plus/dist/locale/ru.mjs'
import { computed, ref } from 'vue'

import { IMPORTANCE, STATUSES } from '../../tracker/task.js'
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
    list = [...list, ...el.executors]
  })

  const map = Object.fromEntries(list.map((next) => [next.id, next]))

  return Object.values(map).map((user) => ({
    value: user.id,
    text: `${user.fullName.firstName[0]}. ${user.fullName.lastName}`,
  }))
})

const filterUsers = (value, row) => {
  const _users = row.executors

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
    <div ref="el" class="n-tasks-table-wrapper">
      <ElTable class="n-tasks-table" :height="height" :data="filterTableData" style="width: 100%">
        <ElTableColumn fixed label="Название" prop="name">
          <template #default="scope">
            <span class="n-tasks-table__name">
              {{ scope.row.name }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Автор" prop="author" width="80">
          <template #default="scope">
            <NAvatar
              :user-name="`${scope.row.author.fullName.firstName[0]}. ${scope.row.author.fullName.lastName}`"
              :size="26"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="Исполнители" prop="executors" :filters="users" :filter-method="filterUsers" width="250">
          <template #default="scope">
            <NTableUsersCell :max="5" :users="scope.row.executors" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="Дата начала" sortable prop="startDate" width="140">
          <template #default="scope">
            {{ dayjs(scope.row.startDate).format('DD.MM.YYYY') }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="Дата конца" sortable prop="endDate" width="140">
          <template #default="scope">
            {{ dayjs(scope.row.endDate).format('DD.MM.YYYY') }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="Статус" prop="status" width="140">
          <template #default="scope">
            <div class="n-tasks-table__status">
              <span class="n-tasks-table__status-color" :style="{ '--bg': STATUSES[scope.row.status].color }"> </span>
              <span class="n-tasks-table__status-label">
                {{ STATUSES[scope.row.status].label }}
              </span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Важность" prop="importance" width="120">
          <template #default="scope">
            {{ IMPORTANCE[scope.row.importance].label }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="Дата создания" sortable prop="createdAt" width="160">
          <template #default="scope">
            {{ dayjs(scope.row.createdAt).format('DD.MM.YYYY') }}
          </template>
        </ElTableColumn>
        <ElTableColumn width="250" fixed="right">
          <template #header>
            <div class="n-tasks-table__search">
              <NInput v-model="search" size="small" placeholder="Поиск" />
            </div>
          </template>
          <template #default="scope">
            <div class="n-tasks-table__actions">
              <NButton
                :to="{ name: 'task-update', params: { id: scope.row.id } }"
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
.n-tasks-table-wrapper {
  height: 100%;
}

.n-tasks-table.el-table th.el-table__cell > .cell.highlight {
  color: var(--n-sys-color-primary-800);
}

.n-tasks-table.el-table thead {
  color: var(--n-sys-color-primary);
  font-weight: 500;
}

.n-tasks-table__search {
  min-width: 100px;
  padding: 4px;
}

.n-tasks-table__name {
  text-overflow: ellipsis;

  overflow: hidden;
}

.n-tasks-table__status {
  display: flex;
  gap: 4px;
  align-items: center;
}

.n-tasks-table__status-color {
  display: block;

  width: 16px;
  height: 16px;

  background-color: hsl(var(--bg));
}

.n-tasks-table__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
