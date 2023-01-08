<script setup>
import { NButton, NForm, NFormItem, NInput } from '@nado/nado-vue-ui'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { v4 as uuid } from 'uuid'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { UserService } from '../../../services/UserService.js'

const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()
const router = useRouter()
const formRef = ref()
const isSending = ref(false)

const formData = reactive({
  userId: uuid(),
  folderId: uuid(),
  email: '',
  firstName: '',
  lastName: '',
  patronymic: '',
  post: '',
  department: '',
  phone: '',
  password: '',
  passwordConfirm: '',
})

const formError = reactive({
  email: '',
  firstName: '',
  lastName: '',
  patronymic: '',
  post: '',
  department: '',
  phone: '',
  password: '',
  passwordConfirm: '',
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
    await UserService.register(formData)
    router.push({ name: 'login' })
    openNotification({
      title: 'Успех',
      message: 'Успешная регистрация',
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
  email: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  firstName: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  lastName: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  passwordConfirm: [{ required: true, validator: validatePasswordConfirm, trigger: 'blur' }],
})

function validatePassword(rule, value, callback) {
  if (value === '') {
    return callback(new Error('Поле обязательно для заполнения'))
  }

  if (value.length < 8) {
    return callback(new Error('Минимальная длина пароля 8'))
  }

  if (formData.passwordConfirm !== '') {
    formRef.value.validateField('passwordConfirm', () => null)

    return callback()
  }
}

function validatePasswordConfirm(rule, value, callback) {
  if (value === '') {
    return callback(new Error('Поле обязательно для заполнения'))
  }

  if (value !== formData.password) {
    return callback(new Error('Пароли не совпадают!'))
  }

  formRef.value.validateField('password', () => null)

  return callback()
}
</script>

<template>
  <div class="registration-page">
    <ElCard shadow="never" class="registration-page__card">
      <template #header>
        <VTitle class="registration-page__title">Регистрация</VTitle>
      </template>
      <NForm
        ref="formRef"
        class="form form--registration"
        :model="formData"
        :rules="rules"
        status-icon
        label-position="top"
      >
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Email" prop="email" :error="formError.email">
              <NInput v-model="formData.email" autocomplete="off" />
            </NFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Фамилия" prop="lastName" :error="formError.lastName">
              <NInput v-model="formData.lastName" autocomplete="off" />
            </NFormItem>
          </ElCol>
          <ElCol :span="12">
            <NFormItem label="Имя" prop="firstName" :error="formError.firstName">
              <NInput v-model="formData.firstName" autocomplete="off" />
            </NFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Отчество" prop="patronymic" :error="formError.patronymic">
              <NInput v-model="formData.patronymic" autocomplete="off" />
            </NFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Должность" prop="post" :error="formError.post">
              <NInput v-model="formData.post" autocomplete="off" />
            </NFormItem>
          </ElCol>
          <ElCol :span="12">
            <NFormItem label="Отдел" prop="department" :error="formError.department">
              <NInput v-model="formData.department" autocomplete="off" />
            </NFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Телефон" prop="phone" :error="formError.phone">
              <NInput v-model="formData.phone" autocomplete="off" />
            </NFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <NFormItem label="Пароль" prop="password" :error="formError.password">
              <NInput v-model="formData.password" type="password" autocomplete="off" show-password />
            </NFormItem>
          </ElCol>
          <ElCol :span="12">
            <NFormItem label="Подтверждение пароля" prop="passwordConfirm" :error="formError.passwordConfirm">
              <NInput v-model="formData.passwordConfirm" type="password" autocomplete="off" show-password />
            </NFormItem>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol class="form-actions">
            <NButton appearance="primary" @click="submitForm(formRef)"> Зарегистрироваться </NButton>
            <NButton :to="{ name: 'login' }"> Войти </NButton>
          </ElCol>
        </ElRow>
      </NForm>
    </ElCard>
  </div>
</template>

<style>
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;
  padding: 1rem;
}

.registration-page__title {
  margin: 0;
}

.registration-page__card {
  width: 600px;
}

.form--registration .form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
</style>
