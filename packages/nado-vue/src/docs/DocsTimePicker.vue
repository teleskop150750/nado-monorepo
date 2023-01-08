<script setup>
import { ref } from 'vue'

import { NTimePicker } from '../components/index.js'
import NCard from './NCard.vue'

const value1 = ref()
const value2 = ref()
const value3 = ref(new Date(2016, 9, 10, 18, 30))

const makeRange = (start, end) => {
  const result = []

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  return result
}
const disabledHours = () => [...makeRange(0, 16), ...makeRange(19, 23)]
const disabledMinutes = (hour) => {
  if (hour === 17) {
    return makeRange(0, 29)
  }

  if (hour === 18) {
    return makeRange(31, 59)
  }
}
const disabledSeconds = (hour, minute) => {
  if (hour === 18 && minute === 30) {
    return makeRange(1, 59)
  }
}

const value4 = ref([new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)])
const value5 = ref([new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)])
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Time Picker</h2>

    <h3 class="n-title-3">Base</h3>
    <div class="row">
      <div class="col">
        <NTimePicker v-model="value1" size="small" placeholder="Arbitrary time" />
      </div>
      <div class="col">
        <NTimePicker v-model="value1" size="default" placeholder="Arbitrary time" />
      </div>
      <div class="col">
        <NTimePicker v-model="value1" size="large" placeholder="Arbitrary time" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <NTimePicker v-model="value1" disabled placeholder="Arbitrary time" />
      </div>
    </div>

    <h3 class="n-title-3">Arbitrary time picker</h3>
    <div class="row">
      <div class="col">
        <NTimePicker v-model="value1" placeholder="Arbitrary time" />
      </div>
      <div class="col">
        <NTimePicker v-model="value2" arrow-control placeholder="Arbitrary time" />
      </div>
    </div>

    <h3 class="n-title-3">Limit the time range</h3>
    <div class="row">
      <div class="col">
        <NTimePicker
          v-model="value3"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
          placeholder="Arbitrary time"
        />
      </div>
    </div>

    <h3 class="n-title-3">Arbitrary time range</h3>
    <div class="row">
      <div class="col">
        <NTimePicker
          v-model="value4"
          is-range
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
      <div class="col">
        <NTimePicker
          v-model="value5"
          is-range
          arrow-control
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <NTimePicker
          v-model="value5"
          size="small"
          is-range
          arrow-control
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
      <div class="col">
        <NTimePicker
          v-model="value5"
          size="default"
          is-range
          arrow-control
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
      <div class="col">
        <NTimePicker
          v-model="value5"
          size="large"
          is-range
          arrow-control
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <NTimePicker
          v-model="value5"
          disabled
          is-range
          arrow-control
          range-separator="До"
          start-placeholder="Start time"
          end-placeholder="End time"
        />
      </div>
    </div>
  </NCard>
</template>
