<script setup>
import { onMounted, ref } from 'vue'

import { NButton, NTooltip } from '../components/index.js'
import NCard from './NCard.vue'

const disabled = ref(false)
const visible = ref(false)
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

const triggerRef = ref({
  getBoundingClientRect() {
    return position.value
  },
})

onMounted(() => {
  document.addEventListener('mousemove', (evt) => {
    position.value = DOMRect.fromRect({
      width: 0,
      height: 0,
      x: evt.clientX,
      y: evt.clientY,
    })
  })
})

const visible2 = ref(false)
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Tooltip</h2>
    <h3 class="n-title-3">Basic usage</h3>

    <div class="row center">
      <div class="tooltip-base-box">
        <div class="row center">
          <NTooltip class="box-item" content="Top Left prompts info" placement="top-start">
            <NButton>top-start</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Top Center prompts info" placement="top">
            <NButton>top</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Top Right prompts info" placement="top-end">
            <NButton>top-end</NButton>
          </NTooltip>
        </div>
        <div class="row">
          <NTooltip class="box-item" content="Left Top prompts info" placement="left-start">
            <NButton>left-start</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Right Top prompts info" placement="right-start">
            <NButton>right-start</NButton>
          </NTooltip>
        </div>
        <div class="row">
          <NTooltip class="box-item" content="Left Center prompts info" placement="left">
            <NButton class="mt-3 mb-3">left</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Right Center prompts info" placement="right">
            <NButton>right</NButton>
          </NTooltip>
        </div>
        <div class="row">
          <NTooltip class="box-item" content="Left Bottom prompts info" placement="left-end">
            <NButton>left-end</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Right Bottom prompts info" placement="right-end">
            <NButton>right-end</NButton>
          </NTooltip>
        </div>
        <div class="row center">
          <NTooltip class="box-item" content="Bottom Left prompts info" placement="bottom-start">
            <NButton>bottom-start</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Bottom Center prompts info" placement="bottom">
            <NButton>bottom</NButton>
          </NTooltip>
          <NTooltip class="box-item" content="Bottom Right prompts info" placement="bottom-end">
            <NButton>bottom-end</NButton>
          </NTooltip>
        </div>
      </div>
    </div>

    <h3 class="n-title-3">Theme</h3>

    <div class="row">
      <div class="col">
        <NTooltip trigger="click" :trigger-keys="[]" content="Top center" placement="top" effect="dark">
          <NButton>Dark (Click)</NButton>
        </NTooltip>
      </div>

      <div class="col">
        <NTooltip trigger="click" :trigger-keys="[]" content="Bottom center" placement="bottom" effect="light">
          <NButton>Light (Click)</NButton>
        </NTooltip>
      </div>

      <div class="col">
        <NTooltip trigger="click" :trigger-keys="[]" content="Bottom center" effect="customized">
          <NButton>Customized theme (Click)</NButton>
        </NTooltip>
      </div>
    </div>

    <h3 class="n-title-3">More Content</h3>

    <NTooltip placement="top">
      <template #content> multiple lines<br />second line </template>
      <NButton>Top center</NButton>
    </NTooltip>

    <h3 class="n-title-3">Расширенное использование</h3>

    <NTooltip :disabled="disabled" content="click to close tooltip function" placement="bottom" effect="light">
      <NButton @click="disabled = !disabled">click to {{ disabled ? 'active' : 'close' }} tooltip function</NButton>
    </NTooltip>

    <h3 class="n-title-3">HTML как содержимое</h3>

    <NTooltip content="<span>The content can be <strong>HTML</strong></span>" raw-content>
      <NButton>hover me</NButton>
    </NTooltip>

    <h3 class="n-title-3">Виртуальный триггер</h3>

    <NTooltip
      v-model:visible="visible"
      content="Bottom center"
      placement="bottom"
      effect="light"
      trigger="click"
      virtual-triggering
      :virtual-ref="triggerRef"
    />
    <NButton @click="visible = !visible">test</NButton>

    <h3 class="n-title-3">Controlled</h3>

    <NTooltip :visible="visible2">
      <template #content>
        <span>Content</span>
      </template>
      <NButton @mouseenter="visible2 = true" @mouseleave="visible2 = false"> Hover me </NButton>
    </NTooltip>
  </NCard>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}

.tooltip-base-box .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}

.n-popper--effect-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;

  background-image: linear-gradient(90deg, rgb(159 229 151), rgb(204 229 129));
}

.n-popper--effect-customized .n-popper__arrow::before {
  right: 0;

  background-image: linear-gradient(45deg, hsl(95deg 64% 73%), hsl(87deg 65% 72%));
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.expand-fade-leave-active {
  margin-left: 20px;

  opacity: 0;
}
</style>
