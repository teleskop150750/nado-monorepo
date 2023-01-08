<script setup>
import { NButton } from '../../../components/index.js'
import { NIconPlus } from '../../../icons/index.js'

function buttonOnClick() {
  // eslint-disable-next-line no-console
  console.log('CLICK')
}
</script>

<template>
  <h3 class="n-title-3">Base</h3>
  <div class="row">
    <div class="col">
      <NButton label="Кнопка" appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton label="Кнопка" loading appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton label="Кнопка" plain appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" plain appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" plain appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" plain appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" plain appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton label="Кнопка" loading plain appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading plain appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading plain appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading plain appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Кнопка" loading plain appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton label="Ссылка" link appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Ссылка" link appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Ссылка" link appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Ссылка" link appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton label="Ссылка" link appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton :icon="NIconPlus" label="Ссылка" link appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" label="Ссылка" link appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" label="Ссылка" link appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" label="Ссылка" link appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" label="Ссылка" link appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton :icon="NIconPlus" aria-label="ссылка" link appearance="secondary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" aria-label="ссылка" link appearance="primary" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" aria-label="ссылка" link appearance="success" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" aria-label="ссылка" link appearance="warn" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton :icon="NIconPlus" aria-label="ссылка" link appearance="error" @click="buttonOnClick" />
    </div>
  </div>

  <div class="row">
    <div class="col">
      <NButton disabled @click="buttonOnClick"> Кнопка </NButton>
    </div>
  </div>
</template>
