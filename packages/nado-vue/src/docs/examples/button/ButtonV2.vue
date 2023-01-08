<script setup>
import { NButton } from '../../../components/index.js'
import { NIconPlus } from '../../../icons/index.js'

function buttonOnClick() {
  // eslint-disable-next-line no-console
  console.log('CLICK')
}
</script>

<template>
  <h3 class="n-title-3">Alignment</h3>
  <div class="row">
    <div class="col">
      <NButton class="btn-fixed-width" :icon-right="NIconPlus" label="Кнопка" align="left" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton class="btn-fixed-width" :icon-right="NIconPlus" label="Кнопка" align="right" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton class="btn-fixed-width" :icon-right="NIconPlus" label="Кнопка" align="center" @click="buttonOnClick" />
    </div>
    <div class="col">
      <NButton class="btn-fixed-width" :icon-right="NIconPlus" label="Кнопка" align="between" @click="buttonOnClick" />
    </div>
  </div>
</template>
