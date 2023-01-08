<script setup>
// import { NScrollbar } from '@nado/nado-vue-ui'
</script>

<template>
  <main class="n-main">
    <slot />
  </main>
</template>

<style>
.n-main {
  display: block;
  flex: 1;
  flex-basis: auto;

  height: 100%;
  box-sizing: border-box;

  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  background-color: var(--n-ref-palette-white);

  /* box-shadow: var(--n-sys-elevation-shadow-level-1); */
}
</style>
