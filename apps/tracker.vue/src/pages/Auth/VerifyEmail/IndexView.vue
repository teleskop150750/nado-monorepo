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

async function verifyEmail() {
  if (isSending.value === true) {
    return
  }

  isSending.value = false
  openLoading()

  try {
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries())

    await UserService.verifyEmail(params)
    openNotification({
      title: 'Успех',
      message: 'Подтверждение прошло успешно',
      type: 'success',
    })
    userStore.verify()
    router.push({ name: 'home' })
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
    <ElCard shadow="never" class="card-verification-notification verification-notification-page__card">
      <template #header>
        <VTitle class="verification-notification-page__title">Подтвердить почту</VTitle>
      </template>
      <ElRow>
        <ElCol class="card-verification-notification__actions">
          <div>
            <NButton @click="verifyEmail">Подтвердить</NButton>
          </div>
          <div>
            <NButton @click="logout"> Выйти </NButton>
          </div>
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

.verification-notification-page__title {
  margin: 0;
}

.card-verification-notification__actions {
  display: flex;
  justify-content: space-between;
}
</style>
