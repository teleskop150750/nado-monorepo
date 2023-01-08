<script setup>
import { computed, onBeforeUnmount, provide, shallowRef, toRef, useSlots } from 'vue'

import { useDisabled } from '../../../hooks/index.js'
import { UPLOAD_CONTEXT_INJECTION_KEY } from '../../../tokens/index.js'
import NUploadContent from './NUploadContent.vue'
import NUploadList from './NUploadList.vue'
import { uploadProps } from './upload.js'
import { useHandlers } from './useHandlers.js'

const props = defineProps(uploadProps)

defineOptions({
  name: 'NUpload',
})

const slots = useSlots()
const disabled = useDisabled()

const uploadRef = shallowRef()
const {
  abort,
  submit,
  clearFiles,
  uploadFiles,
  handleStart,
  handleError,
  handleRemove,
  handleSuccess,
  handleProgress,
} = useHandlers(props, uploadRef)

const isPictureCard = computed(() => props.listType === 'picture-card')

const uploadContentProps = computed(() => ({
  ...props,
  fileList: uploadFiles.value,
  onStart: handleStart,
  onProgress: handleProgress,
  onSuccess: handleSuccess,
  onError: handleError,
  onRemove: handleRemove,
}))

onBeforeUnmount(() => {
  uploadFiles.value.forEach(({ url }) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
})

provide(UPLOAD_CONTEXT_INJECTION_KEY, {
  accept: toRef(props, 'accept'),
})

defineExpose({
  /** @description cancel upload request */
  abort,
  /** @description upload the file list manually */
  submit,
  /** @description clear the file list  */
  clearFiles,
  /** @description select the file manually */
  handleStart,
  /** @description remove the file manually */
  handleRemove,
})
</script>

<template>
  <div class="n-upload-wrapper">
    <NUploadList
      v-if="isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file }">
        <slot name="file" :file="file" />
      </template>
      <template #append>
        <NUploadContent ref="uploadRef" v-bind="uploadContentProps">
          <slot v-if="slots.trigger" name="trigger" />
          <slot v-if="!slots.trigger && slots.default" />
        </NUploadContent>
      </template>
    </NUploadList>

    <NUploadContent
      v-if="!isPictureCard || (isPictureCard && !showFileList)"
      ref="uploadRef"
      v-bind="uploadContentProps"
    >
      <slot v-if="slots.trigger" name="trigger" />
      <slot v-if="!slots.trigger && slots.default" />
    </NUploadContent>

    <slot v-if="$slots.trigger" />
    <slot name="tip" />
    <NUploadList
      v-if="!isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file }">
        <slot name="file" :file="file" />
      </template>
    </NUploadList>
  </div>
</template>
