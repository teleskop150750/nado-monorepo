<script setup>
import { Icons } from '../icons.js'
import NCard from './NCard.vue'

function getName(rawName = '') {
  return rawName.replace('NIcon', '')
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Icons</h2>
    <div class="icons">
      <template v-for="icon in Icons" :key="icon.name">
        <div class="icon-box">
          <component :is="icon" class="icon" />
          <div class="icon-name">{{ getName(icon.parsedUserName) }}</div>
        </div>
      </template>
    </div>
  </NCard>
</template>

<style scope>
.icons {
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 2rem;

  max-width: 60rem;
}

.icon-box {
  display: grid;
  justify-items: center;
}

.icon {
  width: 2.5rem;
  height: 2.5rem;

  color: hsl(220deg 70% 44%);

  box-shadow: 0 0 0 1px hsl(220deg 70% 44% / 50%);
}

.icon-name {
  margin-top: 6px;

  font-size: 12px;
}
</style>
