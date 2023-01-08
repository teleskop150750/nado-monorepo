<script setup>
import { onMounted, ref } from 'vue'

import { NOption, NOptionGroup, NSelect } from '../components/index.js'
import NCard from './NCard.vue'

const value = ref()
const value1 = ref([])
const value2 = ref([])
const value3 = ref([])

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
    disabled: true,
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const value4 = ref()
const cities = [
  {
    value: 'Beijing',
    label: 'Beijing',
  },
  {
    value: 'Shanghai',
    label: 'Shanghai',
  },
  {
    value: 'Nanjing',
    label: 'Nanjing',
  },
  {
    value: 'Chengdu',
    label: 'Chengdu',
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen',
  },
  {
    value: 'Guangzhou',
    label: 'Guangzhou',
  },
]

const value5 = ref()
const groups = [
  {
    label: 'Popular cities',
    options: [
      {
        value: 'Shanghai',
        label: 'Shanghai',
      },
      {
        value: 'Beijing',
        label: 'Beijing',
      },
    ],
  },
  {
    label: 'City name',
    options: [
      {
        value: 'Chengdu',
        label: 'Chengdu',
      },
      {
        value: 'Shenzhen',
        label: 'Shenzhen',
      },
      {
        value: 'Guangzhou',
        label: 'Guangzhou',
      },
      {
        value: 'Dalian',
        label: 'Dalian',
      },
    ],
  },
]

const list = ref([])
const options6 = ref([])
const loading = ref(false)

const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options6.value = list.value.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    }, 200)
  } else {
    options6.value = []
  }
}

const statesList = [
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
const valueRemote1 = ref()
const valueRemote2 = ref()

const valueCreate = ref()

onMounted(() => {
  list.value = statesList.map((item) => ({ value: `value:${item}`, label: `label:${item}` }))
})
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Select</h2>
    <h3 class="n-title-3">Basic usage</h3>
    <div class="row">
      <div class="col">
        <NSelect v-model="value" size="large">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
      <div class="col">
        <NSelect v-model="value" size="default">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
      <div class="col">
        <NSelect v-model="value" size="small">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <NSelect v-model="value1" multiple size="large">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
      <div class="col">
        <NSelect v-model="value1" multiple size="default">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
      <div class="col">
        <NSelect v-model="value1" multiple size="small">
          <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
    </div>

    <h3 class="n-title-3">Disabled option</h3>
    <div class="row">
      <NSelect v-model="value" placeholder="Select">
        <NOption
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </NSelect>
    </div>

    <h3 class="n-title-3">Disabled select</h3>
    <div class="row">
      <NSelect v-model="value" disabled placeholder="Select">
        <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </NSelect>
    </div>

    <h3 class="n-title-3">Clearable single select</h3>
    <div class="row">
      <NSelect v-model="value" clearable placeholder="Select">
        <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </NSelect>
    </div>

    <h3 class="n-title-3">Basic multiple select</h3>
    <div class="row">
      <div class="col">
        <div style="display: inline-block">
          <p style="margin-left: 10px">default</p>
          <NSelect v-model="value1" multiple placeholder="Select" style="width: 240px">
            <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </NSelect>
        </div>
      </div>
      <div class="col">
        <div>
          <p style="margin-left: 10px">use collapse-tags</p>
          <NSelect v-model="value2" multiple collapse-tags placeholder="Select" style="width: 240px">
            <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </NSelect>
        </div>
      </div>
      <div class="col">
        <div>
          <p style="margin-left: 10px">use collapse-tags-tooltip</p>
          <NSelect
            v-model="value3"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="Select"
            style="width: 240px"
          >
            <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </NSelect>
        </div>
      </div>
    </div>

    <h3 class="n-title-3">Custom template</h3>
    <div class="row">
      <NSelect v-model="value4" placeholder="Select">
        <NOption v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
          <span>🤦‍♂️ </span>
          <span>{{ item.value }}</span>
        </NOption>
      </NSelect>
    </div>

    <h3 class="n-title-3">Grouping</h3>
    <NSelect v-model="value5" placeholder="Select">
      <NOptionGroup v-for="group in groups" :key="group.label" :label="group.label">
        <NOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
      </NOptionGroup>
    </NSelect>

    <h3 class="n-title-3">Option filtering</h3>
    <NSelect v-model="value" filterable placeholder="Select">
      <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </NSelect>

    <h3 class="n-title-3">Remote Search</h3>
    <div class="row">
      <div class="col">
        <p style="margin-left: 10px">default</p>
        <NSelect
          v-model="valueRemote1"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <NOption v-for="item in options6" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
      <div class="col">
        <p style="margin-left: 10px">use remote-show-suffix</p>
        <NSelect
          v-model="valueRemote2"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="Please enter a keyword"
          remote-show-suffix
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <NOption v-for="item in options6" :key="item.value" :label="item.label" :value="item.value" />
        </NSelect>
      </div>
    </div>
    <h3 class="n-title-3">Create item</h3>
    <div class="row">
      <NSelect
        v-model="valueCreate"
        multiple
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        placeholder="Choose tags for your article"
      >
        <NOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </NSelect>
    </div>
  </NCard>
</template>
