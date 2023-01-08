<script setup>
import { NButton } from '@nado/nado-vue-ui'
import { ElCard, ElCol, ElRow } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import VTitle from '../../../components/VTitle/VTitle.vue'
import { useLoading } from '../../../composables/useLoading.js'
import { useNotification } from '../../../composables/useNotification.js'
import { UserService } from '../../../services/UserService.js'
import { useUserStore } from '../../../store/user.js'

const userStore = useUserStore()
const router = useRouter()

const isSending = ref(false)
const { open: openLoading, close: closeLoading } = useLoading()
const { open: openNotification } = useNotification()

async function sendNewEmail() {
  if (isSending.value === true) {
    return
  }

  isSending.value = false
  openLoading()

  try {
    await UserService.sendNewEmail()

    openNotification({
      title: 'Успех',
      message: 'Письмо с подтверждением отправлено',
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

function logout() {
  router.push({ name: 'login' })
  userStore.logout()
}
</script>

<template>
  <div class="verification-notification-page">
    <ElCard shadow="never" class="verification-notification-page__card">
      <template #header>
        <VTitle class="verification-notification__title">Подтвердите почту</VTitle>
      </template>
      <p>
        Прежде чем продолжить, пожалуйста, проверьте свою электронную почту на наличие ссылки для подтверждения. Если вы
        не получили электронное письмо, нажмите здесь, чтобы запросить другое.
      </p>
      <ElRow>
        <ElCol class="verification-notification__actions">
          <NButton @click="sendNewEmail">Запросить другое</NButton>
          <NButton @click="logout"> Выйти </NButton>
        </ElCol>
      </ElRow>
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

.verification-notification__title {
  margin: 0;
}

.verification-notification__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}
</style>
