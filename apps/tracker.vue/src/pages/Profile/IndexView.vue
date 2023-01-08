<script setup>
import { NScrollbar } from '@nado/nado-vue-ui'
import { ElCol, ElRow } from 'element-plus'
import { inject } from 'vue'

import { LAYOUT_DEFAULT_KEY } from '../../tokens/layout-default.js'
import FormInfo from './components/FormInfo.vue'
import FormPassword from './components/FormPassword.vue'

const layout = inject(LAYOUT_DEFAULT_KEY)

layout.setTitle('Профиль')
</script>

<template>
  <NScrollbar>
    <div class="profile-page">
      <div class="profile-page__form">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <FormInfo />
          </ElCol>
          <ElCol :span="12">
            <FormPassword />
          </ElCol>
        </ElRow>
      </div>
    </div>
  </NScrollbar>
</template>

<style>
.profile-page__form {
  padding: 2rem;
}
</style>
