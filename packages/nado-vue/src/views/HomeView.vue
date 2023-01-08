<script setup>
const imageUrl = new URL('/src/assets/doggo.gif', import.meta.url)
</script>

<template>
  <div>
    <img class="doggo" :src="imageUrl.toString()" alt="img" />
  </div>
</template>

<style scoped>
.doggo {
  display: block;

  width: 100%;
}
</style>
