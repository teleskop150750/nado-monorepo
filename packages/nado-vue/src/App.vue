<script setup>
import { RouterView } from 'vue-router'

import { NButton, NScrollbar } from './components/index.js'
</script>

<template>
  <div class="docs">
    <NScrollbar always height="100vh">
      <aside>
        <NButton :to="{ name: 'home' }" label="Home" />
        <NButton :to="{ name: 'typography' }" label="Typography" />
        <NButton :to="{ name: 'icons' }" label="Icon" />
        <NButton :to="{ name: 'spinner' }" label="Spinner" />
        <NButton :to="{ name: 'scrollbar' }" label="Scrollbar" />
        <NButton :to="{ name: 'tag' }" label="Tag" />
        <NButton :to="{ name: 'button' }" label="Button" />
        <NButton :to="{ name: 'form' }" label="Form" />
        <NButton :to="{ name: 'input' }" label="Input" />
        <NButton :to="{ name: 'select' }" label="Select" />
        <NButton :to="{ name: 'virtualSelect' }" label="Virtual Select" />
        <NButton :to="{ name: 'radio' }" label="Radio" />
        <NButton :to="{ name: 'checkbox' }" label="Checkbox" />
        <NButton :to="{ name: 'toggle' }" label="Toggle" />
        <NButton :to="{ name: 'time-picker' }" label="Time picker" />
        <NButton :to="{ name: 'date-picker' }" label="Date picker" />
        <NButton :to="{ name: 'progress' }" label="Progress" />
        <NButton :to="{ name: 'upload' }" label="Upload" />
        <NButton :to="{ name: 'tooltip' }" label="Tooltip" />
        <NButton :to="{ name: 'popover' }" label="Popover" />
        <NButton :to="{ name: 'dropdown' }" label="Dropdown" />
        <NButton :to="{ name: 'upload' }" label="Upload" />
        <NButton :to="{ name: 'virtualList' }" label="Virtual list" />
        <NButton :to="{ name: 'virtualGrid' }" label="Virtual grid" />
      </aside>
    </NScrollbar>
    <NScrollbar always height="100vh">
      <main>
        <RouterView />
      </main>
    </NScrollbar>
  </div>
</template>

<style>
.docs {
  display: grid;
  grid-template-columns: 200px 1fr;

  height: 100vh;
}

aside {
  display: grid;
  grid-auto-rows: min-content;
  gap: 8px;

  min-height: 100vh;
  padding: 32px 24px;

  background-color: white;

  overflow: hidden;
}

main {
  min-height: 100vh;
  padding: 32px 24px;

  background-color: hsl(213deg 39% 95%);
}
</style>
