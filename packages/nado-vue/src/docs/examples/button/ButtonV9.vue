<script setup>
import { NButton, NButtonGroup } from '../../../components/index.js'
import { NIconPlus } from '../../../icons/index.js'

function buttonOnClick() {
  // eslint-disable-next-line no-console
  console.log('CLICK')
}
</script>

<template>
  <h3 class="n-title-3">Button Group</h3>
  <div class="row">
    <div class="col">
      <NButtonGroup>
        <NButton label="Кнопка" @click="buttonOnClick" />
        <NButton :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
    <div class="col">
      <NButtonGroup>
        <NButton plain label="Кнопка" @click="buttonOnClick" />
        <NButton plain :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton plain :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <NButtonGroup>
        <NButton appearance="primary" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="primary" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="primary" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
    <div class="col">
      <NButtonGroup>
        <NButton plain appearance="primary" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="primary" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="primary" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <NButtonGroup>
        <NButton appearance="success" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="success" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="success" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
    <div class="col">
      <NButtonGroup>
        <NButton plain appearance="success" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="success" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="success" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <NButtonGroup>
        <NButton appearance="warn" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="warn" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="warn" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
    <div class="col">
      <NButtonGroup>
        <NButton plain appearance="warn" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="warn" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="warn" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <NButtonGroup>
        <NButton appearance="error" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="error" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton appearance="error" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
    <div class="col">
      <NButtonGroup>
        <NButton plain appearance="error" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="error" :icon="NIconPlus" label="Кнопка" @click="buttonOnClick" />
        <NButton plain appearance="error" :icon="NIconPlus" @click="buttonOnClick" />
      </NButtonGroup>
    </div>
  </div>
</template>
