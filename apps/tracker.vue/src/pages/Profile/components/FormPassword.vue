<script setup>
import { NButton, NForm, NFormItem, NInput } from '@nado/nado-vue-ui'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { reactive, ref } from 'vue'

import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { UserService } from '../../../services/UserService.js'

const isSending = ref(false)
const formRef = ref()
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()

const formData = reactive({
  currentPassword: '',
  password: '',
  passwordConfirm: '',
})

const formError = reactive({
  currentPassword: '',
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
    await UserService.changePassword(formData)
    openNotification({
      title: 'Успех',
      message: 'Пароль изменен',
      type: 'success',
    })
    resetForm()
  } catch (error) {
    if (error.response.data.errors) {
      Object.entries(error.response.data.errors).forEach(([key, errors]) => {
        console.log('key', key)
        console.log(Object.hasOwn(formError, key))

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
}

const rules = reactive({
  currentPassword: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
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
    callback(new Error('Поле обязательно для заполнения'))
  } else if (value !== formData.password) {
    callback(new Error('Пароли не совпадают!'))
  } else {
    formRef.value.validateField('password', () => null)
    callback()
  }
}
</script>

<template>
  <ElCard shadow="never" class="profile-password">
    <template #header>
      <VTitle level="2" class="profile-password__title">Изменить пароль</VTitle>
    </template>
    <NForm ref="formRef" :model="formData" :rules="rules" label-position="top">
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Текущий пароль" prop="currentPassword" :error="formError.currentPassword">
            <NInput v-model="formData.currentPassword" type="password" autocomplete="off" show-password />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Пароль" prop="password" :error="formError.password">
            <NInput v-model="formData.password" type="password" autocomplete="off" show-password />
          </NFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <NFormItem label="Подтвердить пароль" prop="passwordConfirm" :error="formError.passwordConfirm">
            <NInput v-model="formData.passwordConfirm" type="password" autocomplete="off" show-password />
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
.profile-password__title {
  margin: 0;
}
</style>
