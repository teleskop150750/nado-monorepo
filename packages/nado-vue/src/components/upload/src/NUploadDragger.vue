<script setup>
import { inject, ref } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { UPLOAD_CONTEXT_INJECTION_KEY } from '../../../tokens/upload.js'
import { throwError } from '../../../utils/error.js'
import { uploadDraggerEmits, uploadDraggerProps } from './upload-dragger.js'

const props = defineProps(uploadDraggerProps)

const emit = defineEmits(uploadDraggerEmits)

const COMPONENT_NAME = 'NUploadDrag'

defineOptions({
  name: 'NUploadDrag',
})

const uploaderContext = inject(UPLOAD_CONTEXT_INJECTION_KEY)

if (!uploaderContext) {
  throwError(COMPONENT_NAME, 'usage: <n-upload><n-upload-dragger /></n-upload>')
}

const ns = useNamespace('upload')
const dragover = ref(false)

/**
 * @param {DragEvent} evt
 */
const onDrop = (evt) => {
  if (props.disabled) {
    return
  }

  dragover.value = false

  const files = [...evt.dataTransfer.files]
  const accept = uploaderContext.accept.value

  if (!accept) {
    emit('file', files)

    return
  }

  const filesFiltered = files.filter((file) => {
    const { type, parsedUserName: name } = file
    const extension = name.includes('.') ? `.${name.split('.').pop()}` : ''
    const baseType = type.replace(/\/.*$/, '')

    return accept
      .split(',')
      .map((_type) => _type.trim())
      .filter(Boolean)
      .some((acceptedType) => {
        if (acceptedType.startsWith('.')) {
          return extension === acceptedType
        }

        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '')
        }

        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
          return type === acceptedType
        }

        return false
      })
  })

  emit('file', filesFiltered)
}

const onDragover = () => {
  if (!props.disabled) {
    dragover.value = true
  }
}
</script>

<template>
  <div
    :class="[ns.b('dragger'), ns.is('dragover', dragover)]"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot />
  </div>
</template>
