<script setup>
import { onMounted, ref } from 'vue'

import { NVirtualList } from '../components/index.js'
import NCard from './NCard.vue'

const fixVertical = ref()
const dynamicVertical = ref()

const fixVerticalData = Array.from({ length: 100_000 }).map((_, i) => `Item #${i}`)
const dynamicVerticalItems = Array.from({ length: 100_000 }).map((_, i) => ({
  size: i % 2 === 0 ? 50 : 100,
}))

const fixVerticalItem = ref(0)

const fixVerticalMax = ref(0)
const fixVerticalRange = ref(0)
const fixVerticalOffset = ref(0)

onMounted(() => {
  fixVerticalOffset.value = fixVertical.value.states.scrollOffset
  fixVerticalMax.value = fixVertical.value.innerRef.clientHeight - 400
})

const fixVerticalMaxSlider = (event) => {
  fixVertical.value.scrollTo(Number(event.target.value))
}

function fixVerticalJump() {
  fixVertical.value.scrollToItem(fixVerticalItem.value, 'auto')
}

function getSize(idx) {
  return dynamicVerticalItems[idx].size
}

function handleScroll(_, scrollOffset) {
  fixVerticalRange.value = scrollOffset
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Virtual list</h2>

    <h3 class="n-title-3">Fixed size</h3>
    <div>
      <div>
        <p>Jump to index</p>
        <input v-model.number="fixVerticalItem" type="number" />
        <button type="button" @click="fixVerticalJump">Go</button>
      </div>

      <div class="row">
        <NVirtualList
          ref="fixVertical"
          :scrollbar-always-on="true"
          :cache="3"
          :height="400"
          :width="400"
          :item-size="62"
          :data="fixVerticalData"
          class="window"
          @scroll="handleScroll"
        >
          <template #default="{ index, style }">
            <div class="scrollbar-demo-item" :class="[index % 2 === 0 && 'scrollbar-demo-item--white']" :style="style">
              Item {{ index }}
            </div>
          </template>
        </NVirtualList>
      </div>
      <div>
        <input :value="fixVerticalRange" type="range" min="0" :max="fixVerticalMax" @input="fixVerticalMaxSlider" />
        <br />
        <span>{{ fixVerticalRange }}</span>
        <br />
        <span>{{ fixVerticalMax }}</span>
      </div>
    </div>

    <h3 class="n-title-3">Horizontal</h3>
    <div class="row">
      <NVirtualList
        :scrollbar-always-on="true"
        layout="horizontal"
        :cache="3"
        :height="400"
        :width="400"
        :item-size="100"
        :data="fixVerticalData"
        class="window"
      >
        <template #default="{ index, style }">
          <div class="scrollbar-demo-item" :class="[index % 2 === 0 && 'scrollbar-demo-item--white']" :style="style">
            Item {{ index }}
          </div>
        </template>
      </NVirtualList>
    </div>

    <h3 class="n-title-3">Dynamic size</h3>
    <div>
      <div>
        <p>Jump to index</p>
      </div>
      <div class="row">
        <NVirtualList
          ref="dynamicVertical"
          :cache="3"
          :height="400"
          :width="400"
          :item-size="getSize"
          :data="dynamicVerticalItems"
          class="window"
        >
          <template #default="{ index, style }">
            <div class="scrollbar-demo-item" :class="[index % 2 === 0 && 'scrollbar-demo-item--white']" :style="style">
              Item {{ index }}
            </div>
          </template>
        </NVirtualList>
      </div>
    </div>

    <h3 class="n-title-3">Horizontal</h3>
    <div class="row">
      <NVirtualList
        :cache="3"
        :estimated-item-size="75"
        layout="horizontal"
        :height="400"
        :width="400"
        :item-size="getSize"
        :data="dynamicVerticalItems"
        class="window"
      >
        <template #default="{ index, style }">
          <div class="scrollbar-demo-item" :class="[index % 2 === 0 && 'scrollbar-demo-item--white']" :style="style">
            {{ index }}
          </div>
        </template>
      </NVirtualList>
    </div>
  </NCard>
</template>

<style scoped>
.window {
  box-shadow: 0 0 0 2px rgb(17 17 17);
}

.scrollbar-demo-item {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;

  color: var(--n-sys-color-secondary-600);
  text-align: center;

  background: var(--n-sys-color-secondary-100);
}

.scrollbar-demo-item--white {
  background: var(--n-ref-palette-white);
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
  margin: 10px;

  color: var(--n-sys-color-primary-600);
  text-align: center;

  border-radius: 4px;

  background: var(--n-sys-color-primary-100);
}
</style>
