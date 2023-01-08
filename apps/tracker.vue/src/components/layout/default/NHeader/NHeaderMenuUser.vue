<script setup>
import { NAvatar, NButton, NDropdown, NDropdownItem, NDropdownMenu, NIconPersonCircle } from '@nado/nado-vue-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '../../../../store/user.js'
import NIconExit from '../../../icons/NIconExit.vue'

const userStore = useUserStore()
const user = userStore.getUser()
const router = useRouter()

const isVisible = ref(false)

function logout() {
  close()
  router.push({ name: 'login' })
  userStore.logout()
}

function close() {
  isVisible.value = false
}

function toggle() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <template v-if="user">
    <NDropdown>
      <button class="n-header-menu-user-trigger" type="button" aria-label="menu" @click="toggle">
        <NAvatar :user-name="`${user.fullName.firstName[0]}. ${user.fullName.lastName}`" />
        <!-- <NIconPersonCircle class="n-header-menu-user-trigger__icon" /> -->
      </button>
      <template #dropdown>
        <NDropdownMenu>
          <div class="n-header-menu-user__title">
            {{ `${user.fullName.firstName[0]}. ${user.fullName.lastName}` }}
          </div>
          <NDropdownItem>
            <NButton :icon="NIconPersonCircle" :to="{ name: 'profile' }" link label="Профиль" @click="close" />
          </NDropdownItem>
          <NDropdownItem>
            <NButton :icon="NIconExit" link label="Выйти" @click="logout" />
          </NDropdownItem>
        </NDropdownMenu>
      </template>
    </NDropdown>
  </template>
</template>

<style>
.n-header-menu-user-trigger {
  display: flex;

  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;

  color: var(--n-sys-color-secondary);

  border: 0;

  cursor: pointer;
}

.n-header-menu-user-trigger__icon {
  display: block;

  width: 100%;
  height: 100%;
}

.n-header-menu-user__title {
  margin-bottom: 0.5rem;
  padding: 0 1rem;
  padding-top: 0.5rem;

  font-weight: 700;
}

.n-header-menu-user__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
</style>
