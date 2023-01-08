<script setup>
import { ref } from 'vue'

import { NDatePicker } from '../components/index.js'
import NCard from './NCard.vue'

const value1 = ref()

const value2 = ref('2022-11-10')

const shortcuts = [
  {
    text: 'Сегодня',
    value: new Date(),
  },
  {
    text: 'Вчера',
    value: () => {
      const date = new Date()

      date.setTime(date.getTime() - 3600 * 1000 * 24)

      return date
    },
  },
  {
    text: 'Неделю назад',
    value: () => {
      const date = new Date()

      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)

      return date
    },
  },
]

const disabledDate = (time) => time.getTime() > Date.now()
const otherValue1 = ref('')
const otherValue2 = ref('')
const otherValue3 = ref('')
const otherValue4 = ref('')

const rValue1 = ref('')
const rValue2 = ref('')

// const shortcuts2 = [
//   {
//     text: 'Last week',
//     value: () => {
//       const end = new Date()
//       const start = new Date()

//       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)

//       return [start, end]
//     },
//   },
//   {
//     text: 'Last month',
//     value: () => {
//       const end = new Date()
//       const start = new Date()

//       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)

//       return [start, end]
//     },
//   },
//   {
//     text: 'Last 3 months',
//     value: () => {
//       const end = new Date()
//       const start = new Date()

//       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)

//       return [start, end]
//     },
//   },
// ]
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Date Picker</h2>
    <h3 class="n-title-3">Enter Date</h3>
    <div class="row">
      <div class="col">
        <NDatePicker v-model="value1" type="datetime" size="small" placeholder="Pick a day" />
      </div>
      <div class="col">
        <NDatePicker v-model="value1" type="date" size="default" placeholder="Pick a day" />
      </div>
      <div class="col">
        <NDatePicker v-model="value1" type="date" size="large" placeholder="Pick a day" />
      </div>
    </div>

    <h3 class="n-title-3">Picker with quick options</h3>

    <div class="row">
      <div class="col">
        <NDatePicker
          v-model="value2"
          type="date"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          size="small"
          placeholder="Pick a day"
        />
      </div>
    </div>

    <h3 class="n-title-3">Other measurements</h3>
    <div class="row">
      <div class="col">
        <span class="demonstration">Week</span>
        <NDatePicker v-model="otherValue1" type="week" format="[Week] ww" placeholder="Pick a week" />
      </div>
      <div class="col">
        <span class="demonstration">Month</span>
        <NDatePicker v-model="otherValue2" type="month" placeholder="Pick a month" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="demonstration">Year</span>
        <NDatePicker v-model="otherValue3" type="year" placeholder="Pick a year" />
      </div>
      <div class="col">
        <span class="demonstration">Dates</span>
        <NDatePicker v-model="otherValue4" type="dates" placeholder="Pick one or more dates" />
      </div>
    </div>

    <h3 class="n-title-3">Date Range</h3>
    <div class="row">
      <div class="col">
        <NDatePicker
          v-model="rValue1"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>
      <div class="col">
        <NDatePicker
          v-model="rValue2"
          unlink-panels
          type="daterange"
          range-separator="До"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>
    </div>
  </NCard>
</template>
