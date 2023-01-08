<script setup>
import { onMounted, ref } from 'vue'

import { NButton, NScrollbar } from '../components/index.js'
import NCard from './NCard.vue'

const count = ref(3)

const add = () => {
  count.value += 1
}

const handleDelete = () => {
  if (count.value > 0) {
    count.value -= 1
  }
}

const max = ref(0)
const value = ref(0)
const innerRef = ref()
const scrollbarRef = ref()

onMounted(() => {
  // Вычитаем margin из высоты
  max.value = innerRef.value.clientHeight - (400 - 12 * 2)
})

const inputSlider = (evt) => {
  scrollbarRef.value.setScrollTop(Number(evt.target.value))
}

const handleScroll = ({ scrollTop }) => {
  value.value = scrollTop
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Scrollbar</h2>

    <h3 class="n-title-3">Basic</h3>
    <NScrollbar always height="400px" :style="{ width: '400px' }">
      <p v-for="item in 50" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </NScrollbar>

    <h3 class="n-title-3">Horizontal scroll</h3>
    <NScrollbar always :style="{ width: '400px' }">
      <div class="scrollbar-flex-content">
        <p v-for="item in 50" :key="item" class="scrollbar-flex-demo-item">
          {{ item }}
        </p>
      </div>
    </NScrollbar>

    <h3 class="n-title-3">Max height</h3>
    <NButton @click="add"> Add Item </NButton>
    <NButton @click="handleDelete"> Delete Item </NButton>
    <NScrollbar max-height="400px" always :style="{ width: '400px' }">
      <p v-for="item in count" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </NScrollbar>

    <h3 class="n-title-3">Manual scroll</h3>
    <NScrollbar ref="scrollbarRef" height="400px" always :style="{ width: '400px' }" @scroll="handleScroll">
      <div ref="innerRef">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
          {{ item }}
        </p>
      </div>
    </NScrollbar>
    <div>
      <input v-model="value" type="range" min="0" :max="max" @input="inputSlider" />
      <br />
      <span>{{ value }}</span>
      <br />
      <span>{{ max }}</span>
    </div>
  </NCard>
</template>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;
  margin: 0;

  color: var(--n-sys-color-secondary-600);
  text-align: center;

  background-color: var(--n-sys-color-secondary-100);
}

.scrollbar-demo-item:nth-child(even) {
  color: var(--n-sys-color-primary-100);

  background-color: var(--n-sys-color-secondary-400);
}

.scrollbar-flex-content {
  display: flex;
}

.scrollbar-flex-demo-item {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 50px;
  margin: 0;

  color: var(--n-sys-color-secondary-600);
  text-align: center;

  background-color: var(--n-sys-color-secondary-100);
}

.scrollbar-flex-demo-item:nth-child(even) {
  color: var(--n-sys-color-secondary-100);

  background-color: var(--n-sys-color-secondary-400);
}
</style>
