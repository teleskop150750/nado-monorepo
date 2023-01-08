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
import { v4 as uuid } from 'uuid'
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import NEditor from '../../../components/NEditor/NEditor.vue'
import NFolderOption from '../../../components/NFolderOption/NFolderOption.vue'
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

layout.setTitle('Добавить задачу')
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const router = useRouter()
const formRef = ref()
const isSending = ref(false)

const formData = reactive({
  id: uuid(),
  name: '',
  folders: [],
  importance: IMPORTANCE.NORMAL.value,
  status: STATUSES.NEW.value,
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
const folders = ref([])
const users = ref([])
const tasks = ref([])

const { minDate, maxDate } = useRelationsDateRange(tasks, formData)

const folderOptions = computed(() =>
  folders.value.map((folder) => ({
    id: folder.id,
    value: folder,
    label: `${folder.name}`,
  })),
)

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

async function submitForm(formElement) {
  if (isSending.value === true) {
    return
  }

  if (!formElement) {
    return
  }

  isSending.value = true
  openLoading()

  let isValid = true

  await formElement.validate((valid) => {
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
    const payload = {
      ...formData,
      startDate: formData.dateRange[0],
      endDate: formData.dateRange[1],
      executors: formData.executors.map((el) => el.id),
    }

    delete payload.dateRange

    await TaskService.create(payload)
    await getDataInit()

    resetForm(formRef.value)
    formData.id = uuid()
    formData.description = ''
    formData.executors = []
    openNotification({
      title: 'Успех',
      message: 'Задача создана',
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

function resetForm(formElement) {
  if (!formElement) {
    return
  }

  formElement.resetFields()
  formData.affects = []
  formData.depends = []
}

const rules = reactive({
  name: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  importance: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  dateRange: [{ required: true, validator: validateDateRange, trigger: 'blur' }],
  status: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'change' }],
})

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

  if (maxDate.value && endDate > maxDate.value) {
    callback(new Error('Невалидная дата конца'))
  }

  callback()
}

async function getDataInit() {
  openLoading()
  try {
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
  closeLoading()
}

async function getUsers(searchVal = null) {
  const response = await UserService.getUsers(searchVal)

  users.value = response.data.data
}

async function getFolders() {
  const response = await FolderService.getFolders()
  const responseFolders = response.data.data

  folders.value = responseFolders

  const rootFolder = response.data.data.find((folder) => folder.type === 'ROOT') || null

  if (rootFolder) {
    formData.folders.push(rootFolder.id)
  }
}

async function getTasks() {
  const response = await TaskService.getTasks()

  tasks.value = response.data.data
}

getDataInit()

const disabledDate = (time) => {
  const currentDate = dayjs(time).utcOffset(0, true)

  if (minDate.value && maxDate.value) {
    return currentDate < minDate.value || currentDate > maxDate.value
  }

  if (minDate.value) {
    return currentDate < minDate.value
  }

  if (maxDate.value) {
    return currentDate > maxDate.value
  }

  return false
}
</script>

<template>
  <NScrollbar>
    <div class="create-task-page">
      <div class="create-task-page__inner">
        <ElCard shadow="never" class="create-task-page__card">
          <NForm
            ref="formRef"
            class="form form--create-task"
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
                      <NSelect v-model="formData.status" style="width: 100%" placeholder="Выберите" disabled>
                        <NOption
                          v-for="item in Object.values(STATUSES)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
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
                      v-model:depends="formData.depends"
                      v-model:affects="formData.affects"
                      class="form__relations"
                      :tasks="tasks"
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
                        unlink-panels
                        value-format="YYYY-MM-DDTHH:mm:ss[+00:00]"
                        format="DD-MM-YYYY"
                        start-placeholder="Дата начала"
                        end-placeholder="Дата конца"
                        :disabled-date="disabledDate"
                      />
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
                      :selected="[...formData.executors]"
                      @update:search="handleSearchUser"
                      @select="handleSelectUser"
                      @unselect="handleUnselectUser"
                    />
                  </ElCol>
                </ElRow>

                <ElRow>
                  <ElCol class="form-actions">
                    <NButton appearance="primary" @click="submitForm(formRef)"> Создать </NButton>
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
      </div>
    </div>
  </NScrollbar>
</template>

<style>
.create-task-page {
  height: 100%;
}

.create-task-page__inner {
  padding: 2rem;
}

.create-task-page__card {
  width: 100%;
}

.form--create-task .form__subtitle {
  margin: 0;
  margin-bottom: 1rem;
}

.form--create-task .form__relations {
  margin-bottom: 2rem;
}

.form--create-task .form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
</style>
