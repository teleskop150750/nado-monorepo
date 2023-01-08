<script setup>
import { ref } from 'vue'

import { NButton, NPopover } from '../components/index.js'
import NCard from './NCard.vue'

const visible = ref(false)
const visible2 = ref(false)

const buttonRef = ref()
const popoverRef = ref()
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Popover</h2>

    <h3 class="n-title-3">Controlled</h3>
    <div class="row">
      <div class="col">
        <NPopover
          :trigger-keys="[]"
          placement="top-start"
          title="Title"
          :width="200"
          trigger="hover"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <NButton>Hover to activate</NButton>
          </template>
        </NPopover>
      </div>

      <div class="col">
        <NPopover
          :trigger-keys="[]"
          placement="bottom"
          title="Title"
          :width="200"
          trigger="click"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <NButton>Click to activate</NButton>
          </template>
        </NPopover>
      </div>

      <div class="col">
        <NPopover
          ref="popover"
          placement="right"
          title="Title"
          :width="200"
          trigger="focus"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <NButton>Focus to activate</NButton>
          </template>
        </NPopover>
      </div>

      <div class="col">
        <NPopover
          ref="popover"
          :trigger-keys="[]"
          title="Title"
          :width="200"
          trigger="contextmenu"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <NButton>contextmenu to activate</NButton>
          </template>
        </NPopover>
      </div>

      <div class="col">
        <NPopover
          :trigger-keys="[]"
          :visible="visible"
          placement="bottom"
          title="Title"
          :width="200"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <NButton @click="visible = !visible">Manual to activate</NButton>
          </template>
        </NPopover>
      </div>
    </div>

    <h3 class="n-title-3">Virtual triggering</h3>
    <NButton ref="buttonRef">Click me</NButton>

    <NPopover
      ref="popoverRef"
      :trigger-keys="[]"
      :virtual-ref="buttonRef"
      trigger="click"
      title="With title"
      virtual-triggering
    >
      <span> Some content </span>
    </NPopover>

    <h3 class="n-title-3">Rich content</h3>
    <NPopover
      :width="300"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
      <template #reference>
        <NButton>NButton</NButton>
      </template>
      <template #default>
        <div class="demo-rich-content">
          <div>
            <p class="demo-rich-content__name">Nado</p>
            <p class="demo-rich-content__mention">@nado</p>
          </div>

          <p class="demo-rich-content__desc" style="margin: 0">
            Nado, a Vue 3 based component library for developers, designers and product managers
          </p>
        </div>
      </template>
    </NPopover>

    <h3 class="n-title-3">Nested operation</h3>

    <NPopover :visible="visible2" placement="top" :width="190">
      <p>Are you sure to delete this?</p>
      <div style="display: flex; gap: 0.5rem">
        <NButton mode="secondary" @click="visible2 = false">cancel</NButton>
        <NButton mode="primary" @click="visible2 = false">confirm</NButton>
      </div>
      <template #reference>
        <NButton @click="visible2 = true">Delete</NButton>
      </template>
    </NPopover>
  </NCard>
</template>
