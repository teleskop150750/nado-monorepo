<script setup>
import { NButton, NIconSearch, NIconSettings } from '@nado/nado-vue-ui'
import { inject } from 'vue'

import { LAYOUT_DEFAULT_KEY } from '../../../../tokens/layout-default.js'
import VTitle from '../../../VTitle/VTitle.vue'
import NHeaderMenuAdd from './NHeaderMenuAdd.vue'
import NHeaderMenuUser from './NHeaderMenuUser.vue'

const layout = inject(LAYOUT_DEFAULT_KEY)
</script>

<template>
  <header class="n-header">
    <div class="n-header__container">
      <VTitle class="n-header__title">
        {{ layout.title.value }}
      </VTitle>

      <div class="n-header__left">
        <NButton :icon="NIconSearch" plain :to="{ name: 'search' }" />
        <NButton :icon="NIconSettings" :to="{ name: 'menu-edit' }" />
        <NHeaderMenuAdd />
        <NHeaderMenuUser />
      </div>
    </div>
  </header>
</template>

<style>
.n-header {
  --n-header-padding: 0 20px;
  --n-header-height: 60px;

  height: var(--n-header-height);
  box-sizing: border-box;

  border-bottom: 1px solid var(--v-border-color);
}

.n-header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
  padding: var(--n-header-padding);
}

.n-header__title {
  margin: 0;
}

.n-header__left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.n-header__avatar {
  width: 32px;
  height: 32px;
}
</style>
