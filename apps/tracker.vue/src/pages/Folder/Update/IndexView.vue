<script setup>
import { NButton, NForm, NFormItem, NInput, NScrollbar } from '@nado/nado-vue-ui'
import { useDebounceFn } from '@vueuse/core'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { inject, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NNotFound from '../../../components/NNotFound/NNotFound.vue'
import NUserSelect from '../../../components/NUserSelect/NUserSelect.vue'
import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { FolderService } from '../../../services/FolderService.js'
import { UserService } from '../../../services/UserService.js'
import { LAYOUT_DEFAULT_KEY } from '../../../tokens/layout-default.js'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Редактировать папку')
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const route = useRoute()
const router = useRouter()
const formRef = ref()
const isSending = ref(false)

const id = ref()
const formData = reactive({
  name: '',
  sharedUsers: [],
})

const formError = reactive({
  name: '',
})

const search = ref('')
const users = ref([])
const usersDisabled = ref([])
const folder = ref()
const isFoundFolder = ref(true)

function handleSelectUser(_users) {
  _users.forEach((user) => {
    if (!formData.sharedUsers.includes(user.value.id)) {
      formData.sharedUsers.push(user.value)
    }
  })
}

function handleUnselectUser(_users) {
  const ids = new Set(_users.map((el) => el.value.id))

  formData.sharedUsers = formData.sharedUsers.filter((el) => !ids.has(el.id))
}

const searchUsers = useDebounceFn(() => {
  getUsers(search.value)
}, 100)

function handleSearchUser(payload = null) {
  search.value = payload
  searchUsers()
}

async function submitForm(formEl) {
  if (isSending.value === true) {
    return
  }

  if (!formEl) {
    return
  }

  isSending.value = true
  openLoading()

  let isValid = true

  await formEl.validate((valid) => {
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
    const payload = { ...formData }

    payload.sharedUsers = payload.sharedUsers.map((el) => el.id)
    await FolderService.update(id.value, payload)

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

const rules = reactive({ name: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }] })

async function getData() {
  try {
    await Promise.all([getUsers(), getFolder()])
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

async function getFolder() {
  try {
    const response = await FolderService.getFolder(route.params.id)
    const responseFolder = response.data.data

    folder.value = responseFolder
    usersDisabled.value.push(responseFolder.author)

    id.value = responseFolder.id
    formData.name = responseFolder.name
    formData.sharedUsers = responseFolder.sharedUsers
  } catch (error) {
    layout.setTitle('404')
    isFoundFolder.value = false
    throw error
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
  <NScrollbar view-class="update-folder-page__scrollbar-view">
    <div v-if="isFoundFolder" class="update-folder-page">
      <ElCard shadow="never" class="update-folder-page__card">
        <NForm
          ref="formRef"
          class="form form--update-folder"
          :model="formData"
          :rules="rules"
          status-icon
          label-position="top"
        >
          <ElRow :gutter="20">
            <ElCol :span="12">
              <NFormItem label="Название папки" prop="name" :error="formError.name">
                <NInput v-model="formData.name" autocomplete="off" />
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
                :selected="[...formData.sharedUsers, ...usersDisabled]"
                :disabled="usersDisabled"
                @update:search="handleSearchUser"
                @select="handleSelectUser"
                @unselect="handleUnselectUser"
              />
            </ElCol>
          </ElRow>

          <ElRow>
            <ElCol class="form-actions">
              <NButton appearance="primary" @click="submitForm(formRef)"> Редактировать </NButton>
              <NButton plain @click="router.back()"> Назад </NButton>
            </ElCol>
          </ElRow>
        </NForm>
      </ElCard>
    </div>
    <NNotFound v-else />
  </NScrollbar>
</template>

<style>
.update-folder-page {
  padding: 2rem;
}

.update-folder-page__card {
  width: 600px;
}

.form--update-folder .form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.update-folder-page__scrollbar-view {
  height: 100%;
}
</style>
