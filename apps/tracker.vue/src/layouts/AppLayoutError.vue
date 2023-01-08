<script setup></script>

<template>
  <div class="v-layout">
    <div>
      <slot />
    </div>
  </div>
</template>

<style>
.v-layout {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;

  min-height: 100vh;
}

.v-layout__header {
  grid-column: 1 / -1;
}
</style>
