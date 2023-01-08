<script setup>
import { ref } from 'vue'

import { NButton, NUpload } from '../../../components/index.js'

const fileList = ref([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
])

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}
</script>

<template>
  <NUpload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :limit="3"
  >
    <NButton appearance="primary">Click to upload</NButton>
    <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
    </template>
  </NUpload>
</template>
