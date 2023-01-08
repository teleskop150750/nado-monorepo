<script setup>
import { reactive, ref } from 'vue'

import { NButton, NForm, NFormItem, NInput } from '../components/index.js'
import FormV2 from './examples/form/FormV2.vue'
import NCard from './NCard.vue'

const formRef = ref()

const formModel = reactive({ text: 'text', desc: 'desc' })

const resetForm = (formEl) => {
  if (!formEl) {
    return
  }

  formEl.resetFields()
}
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Form</h2>

    <div class="row">
      <NForm ref="formRef" size="small" :model="formModel">
        <NFormItem label="Label" prop="text">
          <NInput v-model="formModel.text" />
        </NFormItem>
        <NFormItem label="Label" prop="desc">
          <NInput v-model="formModel.desc" />
        </NFormItem>
        <NButton @click="resetForm(formRef)">Reset</NButton>
      </NForm>
    </div>

    <div class="row">
      <FormV2 />
    </div>
  </NCard>
</template>
