<script setup>
import { dayjs } from '@nado/nado-gantt-chart'
import {
  NButton,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NOption,
  NScrollbar,
  NSelect,
  NSelectV2,
} from '@nado/nado-vue-ui'
import { useDebounceFn } from '@vueuse/core'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { computed, inject, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NEditor from '../../../components/NEditor/NEditor.vue'
import NFolderOption from '../../../components/NFolderOption/NFolderOption.vue'
import NNotFound from '../../../components/NNotFound/NNotFound.vue'
import NUserSelect from '../../../components/NUserSelect/NUserSelect.vue'
import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { FolderService } from '../../../services/FolderService.js'
import { TaskService } from '../../../services/TaskService.js'
import { UserService } from '../../../services/UserService.js'
import { LAYOUT_DEFAULT_KEY } from '../../../tokens/layout-default.js'
import { IMPORTANCE, STATUSES } from '../../../tracker/task.js'
import NTaskRelations from '../components/NTaskRelations/NTaskRelations.vue'
import { useRelationsDateRange } from '../components/NTaskRelations/useRelationsDateRange.js'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Редактировать задачу')
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const route = useRoute()
const router = useRouter()
const formRef = ref()
const isSending = ref(false)

const formData = reactive({
  id: '',
  name: '',
  folders: [],
  importance: '',
  status: '',
  executors: [],
  dateRange: [],
  description: '',
  depends: [],
  affects: [],
})

const formError = reactive({
  name: '',
  folders: '',
  status: '',
  importance: '',
  executors: '',
  dateRange: '',
  description: '',
})

const search = ref('')
const task = ref()
const users = ref([])
const folders = ref([])
const tasks = ref([])
// const wasStarted = ref(false)
const isFoundFolder = ref(true)

const { minDate } = useRelationsDateRange(tasks, formData)

const folderOptions = computed(() =>
  folders.value.map((folder) => ({
    id: folder.id,
    value: folder,
    label: `${folder.name}`,
  })),
)

const canStart = computed(() => {
  if (formData.affects.length === 0) {
    return true
  }

  const tasksIds = new Set(formData.affects)
  const _tasks = tasks.value.filter((el) => tasksIds.has(el.id))

  if (_tasks.some((el) => el.type !== STATUSES.DONE.value)) {
    return false
  }

  return true
})

function handleSelectUser(_users) {
  _users.forEach((user) => {
    if (!formData.executors.includes(user.value.id)) {
      formData.executors.push(user.value)
    }
  })
}

function handleUnselectUser(_users) {
  const ids = new Set(_users.map((el) => el.value.id))

  formData.executors = formData.executors.filter((el) => !ids.has(el.id))
}

const searchUsers = useDebounceFn(() => {
  getUsers(search.value)
}, 100)

function handleSearchUser(payload = null) {
  search.value = payload
  searchUsers()
}

const statusOptions = computed(() => {
  const statuses = Object.values(STATUSES)

  return statuses.map((status) => {
    status.disabled = false

    if (status.value === STATUSES.IN_WORK.value && canStart.value === false) {
      status.disabled = true
    }

    if (status.value === STATUSES.DONE.value && canStart.value === false) {
      status.disabled = true
    }

    return status
  })
})

async function submitForm() {
  if (isSending.value === true) {
    return
  }

  if (!formRef.value) {
    return
  }

  isSending.value = true
  openLoading()

  let isValid = true

  await formRef.value.validate((valid) => {
    if (!valid) {
      isValid = false
    }
  })

  if (!isValid) {
    isSending.value = false
    closeLoading()

    return
  }

  try {
    // if (formData.status === STATUSES.IN_WORK.value) {
    //   wasStarted.value = true
    // }

    const payload = {
      ...formData,
      startDate: formData.dateRange[0],
      endDate: formData.dateRange[1],
      executors: formData.executors.map((el) => el.id),
    }

    delete payload.dateRange

    await TaskService.update(formData.id, payload)
    await getData()

    openNotification({
      title: 'Успех',
      message: 'Задача обновлена',
      type: 'success',
    })
  } catch (error) {
    if (error.response.data.errors) {
      Object.entries(error.response.data.errors).forEach(([key, errors]) => {
        if (Object.hasOwn(formError, key)) {
          const [firstError] = errors

          formError[key] = firstError
        }
      })
    }

    if (error.response.data.title) {
      openNotification({
        title: 'Error',
        message: error.response.data.title,
        type: 'error',
      })
    }
  } finally {
    isSending.value = false
    closeLoading()
  }
}

const rules = reactive({
  name: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  importance: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  dateRange: [{ required: true, validator: validateDateRange, trigger: 'blur' }],
  status: [{ required: true, validator: validateStatus, trigger: 'change' }],
})

function validateStatus(_, value, callback) {
  if (!value) {
    callback(new Error('Поле обязательно для заполнения'))
  }

  if (value === STATUSES.IN_WORK.value && canStart.value === false) {
    callback(new Error('Невалидное значение'))
  }

  if (value === STATUSES.DONE.value && canStart.value === false) {
    callback(new Error('Невалидное значение'))
  }

  callback()
}

function validateDateRange(_, value, callback) {
  if (value.length < 2) {
    callback(new Error('Дата выполнения не указана'))
  }

  const startDate = dayjs(value[0]).utcOffset(0, true)
  const endDate = dayjs(value[1]).utcOffset(0, true)

  if (!(startDate < endDate)) {
    callback(new Error('Дата начала должна быть раньше'))
  }

  if (minDate.value && startDate < minDate.value) {
    callback(new Error('Невалидная дата начала'))
  }

  callback()
}

async function getData() {
  try {
    await getTask()
    await Promise.all([getFolders(), getUsers(), getTasks()])
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

async function getUsers(searchVal = null) {
  const response = await UserService.getUsers(searchVal)

  users.value = response.data.data
}

async function getFolders() {
  const response = await FolderService.getFolders()
  const responseFolders = response.data.data

  folders.value = responseFolders
}

async function getTask() {
  try {
    const response = await TaskService.show(route.params.id)
    const responseTask = response.data.data

    task.value = responseTask
    formData.id = responseTask.id
    formData.name = responseTask.name
    formData.importance = responseTask.importance
    formData.status = responseTask.status
    formData.dateRange = [responseTask.startDate, responseTask.endDate]
    formData.description = responseTask.description
    formData.executors = responseTask.executors
    formData.folders = responseTask.folders.map((folder) => folder.id)
    formData.depends = responseTask.taskRelationships.map((rel) => rel.right.id)
    formData.affects = responseTask.inverseTaskRelationships.map((rel) => rel.left.id)
  } catch (error) {
    layout.setTitle('404')
    isFoundFolder.value = false
    throw error
  }
}

async function getTasks() {
  const response = await TaskService.getTasks()

  tasks.value = response.data.data.filter((el) => el.id !== task.value.id)
}

async function getDataInit() {
  openLoading()
  await getData()
  closeLoading()
}

getDataInit()

const disabledDate = (time) => {
  const currentDate = dayjs(time).utcOffset(0, true)

  if (minDate.value) {
    return currentDate < minDate.value
  }

  return false
}

function handleDepends(val) {
  formData.depends = val
}

function handleAffects(val) {
  formData.affects = val
}

watch(
  () => formData.status,
  (val) => {
    if (!task.value) {
      return
    }

    if (task.value.status === STATUSES.DONE.value) {
      return
    }

    if (formData.dateRange.length < 2) {
      return
    }

    if (val === STATUSES.DONE.value) {
      const [dataStart] = formData.dateRange

      const dateEnd = dayjs()
        .utcOffset(0, true)
        .startOf('day')
        .add(1, 'day')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss[+00:00]')

      formData.dateRange = [dataStart, dateEnd]
    }
  },
)
</script>

<template>
  <NScrollbar view-class="update-task-page__scrollbar-view">
    <div class="update-task-page">
      <div class="update-task-page__inner">
        <ElCard v-if="isFoundFolder" shadow="never" class="update-task-page__card">
          <NForm
            ref="formRef"
            class="form form--update-task"
            :model="formData"
            :rules="rules"
            status-icon
            label-position="top"
          >
            <ElRow :gutter="20">
              <ElCol :span="10">
                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <NFormItem label="Название задачи" prop="name" :error="formError.name">
                      <NInput v-model="formData.name" autocomplete="off" />
                    </NFormItem>
                  </ElCol>
                </ElRow>
                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <NFormItem label="Папки" prop="folders" :error="formError.folders">
                      <NSelectV2
                        v-model="formData.folders"
                        :options="folderOptions"
                        value-key="id"
                        multiple
                        filterable
                        :item-height="52"
                        style="width: 100%"
                        placeholder="Выберите"
                      >
                        <template #default="{ item }">
                          <NFolderOption :folder="item" />
                        </template>
                      </NSelectV2>
                    </NFormItem>
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <VTitle class="form__subtitle" level="3">Участники</VTitle>
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <NUserSelect
                      :search="search"
                      :users="users"
                      :selected="formData.executors"
                      @update:search="handleSearchUser"
                      @select="handleSelectUser"
                      @unselect="handleUnselectUser"
                    />
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="12">
                    <NFormItem label="Важность" prop="importance" :error="formError.importance">
                      <NSelect v-model="formData.importance" style="width: 100%" placeholder="Выберите">
                        <NOption
                          v-for="item in Object.values(IMPORTANCE)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </NSelect>
                    </NFormItem>
                  </ElCol>

                  <ElCol :span="12">
                    <NFormItem label="Статус" prop="status" :error="formError.status">
                      <NSelect v-model="formData.status" style="width: 100%" placeholder="Выберите">
                        <NOption
                          v-for="item in statusOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="item.disabled"
                        >
                          <div class="status-option">
                            <span class="status-option__color" :style="{ '--status-color': item.color }" />
                            <span class="status-option__label">
                              {{ item.label }}
                            </span>
                          </div>
                        </NOption>
                      </NSelect>
                    </NFormItem>
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <VTitle class="form__subtitle" level="3">Связанные задачи</VTitle>
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <NTaskRelations
                      :depends="formData.depends"
                      :affects="formData.affects"
                      class="form__relations"
                      :tasks="tasks"
                      @update:depends="handleDepends"
                      @update:affects="handleAffects"
                    />
                  </ElCol>
                </ElRow>

                <ElRow :gutter="20">
                  <ElCol :span="24">
                    <NFormItem label="Дата выполнения" prop="dateRange" :error="formError.dateRange">
                      <NDatePicker
                        v-model="formData.dateRange"
                        type="daterange"
                        range-separator="До"
                        value-format="YYYY-MM-DDTHH:mm:ss[+00:00]"
                        start-placeholder="Дата начала"
                        end-placeholder="Дата конца"
                        :disabled-date="disabledDate"
                      />
                    </NFormItem>
                  </ElCol>
                </ElRow>

                <ElRow>
                  <ElCol class="form-actions">
                    <NButton appearance="primary" @click="submitForm()"> Редактировать </NButton>
                    <!-- <NButton @click="resetForm(formRef)">Сбросить</NButton> -->
                    <NButton plain @click="router.back()"> Назад </NButton>
                  </ElCol>
                </ElRow>
              </ElCol>
              <ElCol :span="14">
                <ElRow :gutter="24">
                  <ElCol :span="24">
                    <NFormItem label="Описание" hide-hint>
                      <NEditor v-model="formData.description" />
                    </NFormItem>
                  </ElCol>
                </ElRow>
              </ElCol>
            </ElRow>
          </NForm>
        </ElCard>
        <NNotFound v-else />
      </div>
    </div>
  </NScrollbar>
</template>

<style>
.update-task-page__scrollbar-view {
  height: 100%;
}

.update-task-page {
  height: 100%;
}

.update-task-page__inner {
  padding: 2rem;
}

.update-task-page__card {
  width: 100%;
}

.form--update-task .form__subtitle {
  margin: 0;
  margin-bottom: 1rem;
}

.form--update-task .form__relations {
  margin-bottom: 2rem;
}

.form--update-task .form-actions {
  display: flex;
  gap: 1rem;
}
</style>
