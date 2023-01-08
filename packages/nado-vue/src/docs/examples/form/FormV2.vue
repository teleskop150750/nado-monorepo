<script setup>
import { reactive, ref } from 'vue'

import NDatePicker from '../../../components/date-picker/src/NDatePicker.jsx'
import {
  NButton,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NOption,
  NRadio,
  NSelect,
  NSelectV2,
} from '../../../components/index.js'

const ruleFormRef = ref()
const ruleForm = reactive({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '06.11.12',
  delivery: false,
  type: [],
  resource: '',
  desc: '22334324324',
})

const rules = reactive({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
})

const submitForm = async (formEl) => {
  if (!formEl) {
    return
  }

  await formEl.validate((valid, fields) => {
    if (valid) {
      // eslint-disable-next-line no-console
      console.log('submit!')
    } else {
      // eslint-disable-next-line no-console
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) {
    return
  }

  formEl.resetFields()
}

const options = Array.from({ length: 10_000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
</script>

<template>
  <NForm ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
    <NFormItem label="Activity name" prop="name">
      <NInput v-model="ruleForm.name" />
    </NFormItem>
    <NFormItem label="Activity zone" prop="region">
      <NSelect v-model="ruleForm.region" placeholder="Activity zone">
        <NOption label="Zone one" value="shanghai" />
        <NOption label="Zone two" value="beijing" />
      </NSelect>
    </NFormItem>
    <NFormItem label="Activity count" prop="count">
      <NSelectV2 v-model="ruleForm.count" placeholder="Activity count" :options="options" />
    </NFormItem>
    <NFormItem label="Activity time" required>
      <div>
        <NFormItem prop="date1">
          <NDatePicker
            v-model="ruleForm.date1"
            type="date"
            label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </NFormItem>
      </div>
      <div class="text-center" :span="2">
        <span class="text-gray-500">-</span>
      </div>
      <div>
        <NFormItem prop="date2">
          <NDatePicker v-model="ruleForm.date2" label="Pick a time" placeholder="Pick a time" style="width: 100%" />
        </NFormItem>
      </div>
    </NFormItem>
    <NFormItem label="Activity type" prop="type">
      <NCheckbox v-model="ruleForm.type" val="Online" label="Online activities" name="type" />
      <NCheckbox v-model="ruleForm.type" val="Promotion" label="Promotion activities" name="type" />
      <NCheckbox v-model="ruleForm.type" val="Offline" label="Offline activities" name="type" />
      <NCheckbox v-model="ruleForm.type" val="Simple" label="Simple brand exposure" name="type" />
    </NFormItem>
    <NFormItem label="Resources" prop="resource">
      <div class="col">
        <NRadio v-model="ruleForm.resource" name="radio" val="line" label="Line" />
        <NRadio v-model="ruleForm.resource" name="radio" val="rectangle" label="Rectangle" disabled />
        <NRadio v-model="ruleForm.resource" name="radio" val="ellipse" label="Ellipse" />
      </div>
    </NFormItem>
    <NFormItem label="Activity form" prop="desc">
      <NInput v-model="ruleForm.desc" type="textarea" />
    </NFormItem>
    <NFormItem>
      <NButton appearance="primary" @click="submitForm(ruleFormRef)">Create</NButton>
      <NButton @click="resetForm(ruleFormRef)">Reset</NButton>
    </NFormItem>
  </NForm>
</template>
