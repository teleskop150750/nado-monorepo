<script setup>
import { ref } from 'vue'

import { NToggle } from '../components/index.js'
import NCard from './NCard.vue'

const toggle1 = ref(true)

const indeterminate1 = ref('maybe')
const indeterminate2 = ref(null)

const toggleOrder1 = ref(null)
const toggleOrder2 = ref(null)
const toggleOrder3 = ref(true)
const toggleOrder4 = ref(false)

const arrayModel = ref(['red', 'orange'])

const customModel = ref('no')
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Toggle</h2>
    <div class="row">
      <div class="col">
        <NToggle v-model="toggle1" name="toggle" />
        <NToggle v-model="toggle1" name="toggle" disabled />
      </div>
      <div class="col">
        <NToggle v-model="toggle1" name="toggle" label="Чекбокс" />
        <NToggle v-model="toggle1" name="toggle" label="Чекбокс" disabled />
      </div>
      <div class="col">
        <NToggle v-model="toggle1" name="toggle" left-label label="Чекбокс" />
        <NToggle v-model="toggle1" name="toggle" left-label label="Чекбокс" disabled />
      </div>
    </div>

    <h3 class="n-title-3">indeterminate</h3>
    <div class="row">
      <div class="col">
        <NToggle v-model="indeterminate1" indeterminate-value="maybe" label="Чекбокс" />
        <p>
          The model data: <strong>{{ JSON.stringify(indeterminate1) }}</strong>
        </p>
      </div>
      <div class="col">
        <NToggle v-model="indeterminate2" toggle-indeterminate label="Чекбокс" />
        <p>
          The model data: <strong>{{ JSON.stringify(indeterminate2) }}</strong>
        </p>
      </div>
    </div>

    <h3 class="n-title-3">Toggle order</h3>
    <div class="row">
      <div class="col">
        <NToggle v-model="toggleOrder1" label="'tf' order" color="teal" />
      </div>
      <div class="col">
        <NToggle v-model="toggleOrder2" toggle-order="ft" label="'ft' order" />
      </div>
      <div class="col">
        <NToggle v-model="toggleOrder3" toggle-indeterminate label="'tf' order + toggle-indeterminate" />
      </div>
      <div class="col">
        <NToggle
          v-model="toggleOrder4"
          toggle-indeterminate
          toggle-order="ft"
          label="'ft' order + toggle-indeterminate"
          color="cyan"
        />
      </div>
    </div>

    <h3 class="n-title-3">Array model</h3>
    <div class="row">
      <div class="col">
        <NToggle v-model="arrayModel" val="teal" label="Teal" color="teal" />
      </div>
      <div class="col">
        <NToggle v-model="arrayModel" val="orange" label="Orange" color="orange" />
      </div>
      <div class="col">
        <NToggle v-model="arrayModel" val="red" label="Red" color="red" />
      </div>
      <div class="col">
        <NToggle v-model="arrayModel" val="cyan" label="Cyan" color="cyan" />
      </div>
    </div>
    <div class="row">
      <div>
        The model data: <strong>{{ arrayModel }}</strong>
      </div>
    </div>

    <h3 class="n-title-3">Custom model values</h3>
    <div class="row">
      <div class="col">
        <NToggle
          v-model="customModel"
          color="secondary"
          label="Согласны ли вы с условиями и положениями?"
          true-value="yes"
          false-value="no"
        />
        <div>
          The model data: <strong>'{{ customModel }}'</strong>
        </div>
      </div>
    </div>
  </NCard>
</template>
