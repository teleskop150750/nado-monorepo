<script setup>
import { NButton, NForm, NFormItem, NInput } from '@nado/nado-vue-ui'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { reactive, ref } from 'vue'

import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { UserService } from '../../../services/UserService.js'

const formRef = ref()
const isSending = ref(false)
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()

const formData = reactive({
  email: '',
})
const formError = reactive({
  email: '',
})

async function handleSubmit(formElement) {
  if (!formElement) {
    return
  }

  if (isSending.value === true) {
    return
  }

  let isValid = true

  await formElement.validate((valid) => {
    if (!valid) {
      isValid = false
    }
  })

  if (!isValid) {
    return
  }

  isSending.value = false
  openLoading()

  try {
    await UserService.forgotPassword(formData)

    openNotification({
      title: 'Успех',
      message: 'Письмо отправлено',
      type: 'success',
    })
  } catch (error) {
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
})
</script>

<template>
  <div class="verification-notification-page">
    <ElCard shadow="never" class="verification-notification-page__card">
      <template #header>
        <VTitle class="verification-notification-page__title">Сбросить пароль</VTitle>
      </template>
      <NForm
        ref="formRef"
        class="form form--verification-notification"
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

        <ElRow>
          <ElCol class="form-actions">
            <NButton appearance="primary" @click="handleSubmit(formRef)"> Отправить письмо </NButton>
            <NButton :to="{ name: 'login' }"> Войти </NButton>
          </ElCol>
        </ElRow>
      </NForm>
    </ElCard>
  </div>
</template>

<style>
.verification-notification-page {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;
  padding: 1rem;
}

.verification-notification-page__card {
  width: 600px;
}

.verification-notification-page__title {
  margin: 0;
}

.form--verification-notification .form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
