<script setup>
import { provide, ref } from 'vue'

import NAside from '../components/layout/default/NAside/NAside.vue'
import NHeader from '../components/layout/default/NHeader/NHeader.vue'
import NMain from '../components/layout/default/NMain/NMain.vue'
import { LAYOUT_DEFAULT_KEY } from '../tokens/index.js'

const title = ref('')

function setTitle(val) {
  title.value = val
}

provide(LAYOUT_DEFAULT_KEY, {
  title,
  setTitle,
})
</script>

<template>
  <div class="n-layout">
    <div class="n-layout__aside">
      <NAside> aside </NAside>
    </div>
    <div class="n-layout__body">
      <div class="n-layout__body-header">
        <NHeader class="n-layout__header"> Header </NHeader>
      </div>
      <div class="n-layout__body-main">
        <NMain>
          <slot />
        </NMain>
      </div>
    </div>
  </div>
</template>

<style>
.n-layout {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: min-content 1fr;

  /* height: 100dvh; */
}

.n-layout__body {
  height: 100vh;

  background-color: var(--n-sys-color-info-100);
}

.n-layout__body-main {
  height: calc(100% - 60px);
  padding: 0 1rem 1rem;
}
</style>
