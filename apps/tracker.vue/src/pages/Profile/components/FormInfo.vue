<script setup>
import { NButton, NForm, NFormItem, NInput } from '@nado/nado-vue-ui'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { reactive, ref } from 'vue'

import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { UserService } from '../../../services/UserService.js'
import { useUserStore } from '../../../store/user.js'

const userStore = useUserStore()
const user = userStore.getUser()
const formRef = ref()
const isSending = ref(false)
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()

const formData = reactive({
  firstName: user.value.fullName.firstName,
  lastName: user.value.fullName.lastName,
  patronymic: user.value.fullName.patronymic,
  post: user.value.post,
  department: user.value.department,
  phone: user.value.phone,
})

const formError = reactive({
  firstName: '',
  lastName: '',
  patronymic: '',
  post: '',
  department: '',
  phone: '',
})

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
    await UserService.updateMe(formData)
    const newUser = {
      fullName: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic,
      },
      post: formData.post,
      department: formData.department,
      phone: formData.phone,
    }

    userStore.updateUser(newUser)
    openNotification({
      title: 'Успех',
      message: 'Данные обновлены',
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
  firstName: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  lastName: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
})
</script>

<template>
  <ElCard shadow="never" class="profile-info">
    <template #header>
      <VTitle level="2" class="profile-info__title">Личные данные</VTitle>
    </template>
    <NForm
      ref="formRef"
      class="form form--profile-info"
      :model="formData"
      :rules="rules"
      status-icon
      label-position="top"
    >
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Email">
            <NInput :model-value="user.email" disabled />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Фамилия" prop="lastName" :error="formError.lastName">
            <NInput v-model="formData.lastName" autocomplete="off" />
          </NFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Имя" prop="firstName" :error="formError.firstName">
            <NInput v-model="formData.firstName" autocomplete="off" />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Отчество" prop="patronymic" :error="formError.patronymic">
            <NInput v-model="formData.patronymic" autocomplete="off" />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Должность" :error="formError.post">
            <NInput v-model="formData.post" autocomplete="off" />
          </NFormItem>
        </ElCol>
        <ElCol :span="24">
          <NFormItem label="Отдел" :error="formError.post">
            <NInput v-model="formData.department" autocomplete="off" />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Телефон" :error="formError.phone">
            <NInput v-model="formData.phone" autocomplete="off" />
          </NFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol class="form-actions">
          <NButton appearance="primary" @click="submitForm(formRef)"> Обновить </NButton>
        </ElCol>
      </ElRow>
    </NForm>
  </ElCard>
</template>

<style>
.profile-info__title {
  margin: 0;
}

.form--profile-info .form-actions {
  margin: 0;
}
</style>
