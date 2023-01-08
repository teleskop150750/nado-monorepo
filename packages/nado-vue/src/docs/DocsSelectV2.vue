<script setup>
import { ref } from 'vue'

import { NSelectV2 } from '../components/index.js'
import NCard from './NCard.vue'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const value = ref()
const options = Array.from({ length: 100 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))
const mValue = ref([])
const mValue2 = ref([])
const mValue3 = ref([])
const fValue = ref([])
const dValue = ref([])
const dValue2 = ref([])

const dOptions = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
  disabled: idx % 2 === 0,
}))

const gValue = ref([])
const gOptions = Array.from({ length: 10 }).map((_, idx) => {
  const label = idx + 1

  return {
    value: `Group ${label}`,
    label: `Group ${label}`,
    options: Array.from({ length: 10 }).map((__, innerIdx) => ({
      value: `Option ${innerIdx + 1 + 10 * label}`,
      label: `${initials[innerIdx % 10]}${innerIdx + 1 + 10 * label}`,
    })),
  }
})

const cValue = ref([])
const clValue1 = ref([])
// const clValue2 = ref([])
const clValue22 = ref()

const crValue1 = ref([])
const crValue2 = ref()
const crValue3 = ref([])

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]
const list = states.map((item) => ({ value: `value:${item}`, label: `label:${item}` }))
const lValue = ref([])
const lOptions = ref([])
const loading = ref(false)

const remoteMethod = (query) => {
  if (query !== '') {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      lOptions.value = list.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    }, 200)
  } else {
    lOptions.value = []
  }
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Tag</h2>

    <h3 class="n-title-3">Basic usage</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="value"
          size="large"
          :item-height="(i) => 40"
          :options="options"
          placeholder="Please select"
        />
      </div>
      <div class="col">
        <NSelectV2 v-model="value" size="default" :options="options" placeholder="Please select" />
      </div>
      <div class="col">
        <NSelectV2 v-model="value" size="small" :options="options" placeholder="Please select" />
      </div>
    </div>

    <h3 class="n-title-3">Multi select</h3>
    <div>{{ mValue }}</div>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="mValue"
          size="large"
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
        />
      </div>
      <div class="col">
        <NSelectV2
          v-model="mValue"
          size="default"
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
        />
      </div>
      <div class="col">
        <NSelectV2
          v-model="mValue"
          size="small"
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
        />
      </div>
    </div>

    <h3 class="n-title-3">Hide extra tags when the selected items are too many.</h3>
    <div class="row">
      <div class="col">
        <div style="margin: 10px">use collapse-tags</div>
        <NSelectV2
          v-model="mValue2"
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
          collapse-tags
        />
      </div>
      <div class="col">
        <div>use collapse-tags-tooltip</div>
        <NSelectV2
          v-model="mValue3"
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
          collapse-tags
          collapse-tags-tooltip
        />
      </div>
    </div>

    <h3 class="n-title-3">Filterable multi-select.</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="fValue"
          filterable
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
        />
      </div>
    </div>

    <h3 class="n-title-3">Disabled selector and select options</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="dValue"
          filterable
          :options="dOptions"
          placeholder="Please select"
          style="
            width: 240px;
            margin-right: 16px;

            vertical-align: middle;
          "
          multiple
        />
      </div>
      <div class="col">
        <NSelectV2
          v-model="dValue2"
          disabled
          filterable
          :options="dOptions"
          placeholder="Please select"
          style="
            width: 240px;

            vertical-align: middle;
          "
          multiple
        />
      </div>
    </div>

    <h3 class="n-title-3">Option Grouping</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="gValue"
          filterable
          :options="gOptions"
          placeholder="Please select"
          style="width: 240px"
          multiple
        />
      </div>
    </div>

    <h3 class="n-title-3">Customized option renderer</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="cValue"
          filterable
          :options="options"
          placeholder="Please select"
          style="width: 240px"
          multiple
        >
          <template #default="{ item }">
            <span style="margin-right: 8px">{{ item.label }}</span>
            <span style="color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.value }}
            </span>
          </template>
        </NSelectV2>
      </div>
    </div>

    <h3 class="n-title-3">Clearable selector</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="clValue1"
          :options="options"
          placeholder="Please select"
          style="
            width: 240px;
            margin-right: 16px;

            vertical-align: middle;
          "
          multiple
          clearable
        />
      </div>
      <div class="col">
        <NSelectV2
          v-model="clValue22"
          :options="options"
          placeholder="Please select2"
          style="
            width: 240px;

            vertical-align: middle;
          "
          clearable
        />
      </div>
    </div>

    <h3 class="n-title-3">Create Option</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="crValue1"
          :options="options"
          placeholder="Please select"
          style="
            width: 240px;
            margin-right: 16px;

            vertical-align: middle;
          "
          allow-create
          filterable
          multiple
          clearable
        />
      </div>
      <div class="col">
        <NSelectV2
          v-model="crValue2"
          :options="options"
          placeholder="Please select"
          style="
            width: 240px;

            vertical-align: middle;
          "
          allow-create
          filterable
          clearable
        />
      </div>
      <div class="col">
        <div>set reserve-keyword false</div>
        <NSelectV2
          v-model="crValue3"
          :options="options"
          placeholder="Please select"
          style="
            width: 240px;
            margin-right: 16px;

            vertical-align: middle;
          "
          allow-create
          filterable
          multiple
          clearable
          :reserve-keyword="false"
        />
      </div>
    </div>

    <h3 class="n-title-3">Удаленный поиск</h3>
    <div class="row">
      <div class="col">
        <NSelectV2
          v-model="lValue"
          style="width: 240px"
          multiple
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
          :options="lOptions"
          :loading="loading"
          placeholder="Please enter a keyword"
        />
      </div>
    </div>
  </NCard>
</template>
