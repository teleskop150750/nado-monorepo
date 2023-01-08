<script setup>
import { NButton } from '../../../components/index.js'
import { NIconPlus } from '../../../icons/index.js'

function buttonOnClick() {
  // eslint-disable-next-line no-console
  console.log('CLICK')
}
</script>

<template>
  <h3 class="n-title-3">Full width</h3>
  <div class="row">
    <div class="col" style="width: 100%; max-width: 300px">
      <NButton label="Кнопка" @click="buttonOnClick" />
    </div>
    <div class="col" style="width: 100%; max-width: 300px">
      <NButton :icon="NIconPlus" label="Кнопка" plain @click="buttonOnClick" />
    </div>
    <div class="col" style="width: 100%; max-width: 300px">
      <NButton :icon="NIconPlus" :icon-right="NIconPlus" label="Кнопка" @click="buttonOnClick" />
    </div>
    <div class="col" style="width: 100%; max-width: 300px">
      <NButton :icon="NIconPlus" :icon-right="NIconPlus" label="Кнопка" disabled @click="buttonOnClick" />
    </div>
  </div>
</template>
