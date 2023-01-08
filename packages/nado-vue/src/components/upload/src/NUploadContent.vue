<script setup>
import { shallowRef } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { entriesOf } from '../../../utils/index.js'
import NUploadDragger from './NUploadDragger.vue'
import { genFileId } from './upload.js'
import { uploadContentProps } from './upload-content.js'

const props = defineProps(uploadContentProps)

defineOptions({
  name: 'NUploadContent',
  inheritAttrs: false,
})

const ns = useNamespace('upload')

const requests = shallowRef({})
const inputRef = shallowRef()

/**
 * @param {File[]} files
 */
const uploadFiles = (files) => {
  if (files.length === 0) {
    return
  }

  const { autoUpload, limit, fileList, multiple, onStart, onExceed } = props

  if (limit && fileList.length + files.length > limit) {
    onExceed(files, fileList)

    return
  }

  if (!multiple) {
    files = files.slice(0, 1)
  }

  for (const file of files) {
    /** @type{import('./upload.types.js').UploadRawFile} */
    // @ts-ignore
    const rawFile = file

    // @ts-ignore
    rawFile.uid = genFileId()
    onStart(rawFile)

    if (autoUpload) {
      // eslint-disable-next-line no-use-before-define
      upload(rawFile)
    }
  }
}

/**
 * @param {import('./upload.types.js').UploadRawFile} rawFile
 */
async function upload(rawFile) {
  inputRef.value.value = ''

  if (!props.beforeUpload) {
    // eslint-disable-next-line no-use-before-define
    return doUpload(rawFile)
  }

  let hookResult = undefined

  try {
    hookResult = await props.beforeUpload(rawFile)
  } catch {
    hookResult = false
  }

  if (hookResult === false) {
    props.onRemove(rawFile)

    return
  }

  let file = rawFile

  if (hookResult instanceof Blob) {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (hookResult instanceof File) {
      // @ts-ignore
      file = hookResult
    } else {
      // @ts-ignore
      file = new File([hookResult], rawFile.parsedUserName, {
        type: rawFile.type,
      })
    }
  }

  doUpload(
    Object.assign(file, {
      uid: rawFile.uid,
    }),
  )
}

function doUpload(rawFile) {
  const {
    headers,
    data,
    method,
    withCredentials,
    name: filename,
    action,
    onProgress,
    onSuccess,
    onError,
    httpRequest,
  } = props

  const { uid } = rawFile
  const options = {
    headers: headers || {},
    withCredentials,
    file: rawFile,
    data,
    method,
    filename,
    action,
    onProgress: (evt) => {
      onProgress(evt, rawFile)
    },
    onSuccess: (res) => {
      onSuccess(res, rawFile)
      delete requests.value[uid]
    },
    onError: (err) => {
      onError(err, rawFile)
      delete requests.value[uid]
    },
  }
  const request = httpRequest(options)

  requests.value[uid] = request

  if (request instanceof Promise) {
    // eslint-disable-next-line promise/catch-or-return
    request.then(options.onSuccess, options.onError)
  }
}

function handleChange(evt) {
  const { files } = evt.target

  if (!files) {
    return
  }

  uploadFiles([...files])
}

function handleClick() {
  if (!props.disabled) {
    inputRef.value.value = ''
    inputRef.value.click()
  }
}

const handleKeydown = () => {
  handleClick()
}

/**
 * @param {import('./upload.types.js').UploadFile} [file]
 */
const abort = (file) => {
  const _reqs = entriesOf(requests.value).filter(file ? ([uid]) => String(file.uid) === uid : () => true)

  _reqs.forEach(([uid, req]) => {
    if (req instanceof XMLHttpRequest) {
      req.abort()
    }

    delete requests.value[uid]
  })
}

defineExpose({
  abort,
  upload,
})
</script>

<template>
  <div
    :class="[ns.b(), ns.m(listType), ns.is('drag', drag)]"
    tabindex="0"
    @click="handleClick"
    @keydown.self.enter.space="handleKeydown"
  >
    <template v-if="drag">
      <NUploadDragger :disabled="disabled" @file="uploadFiles">
        <slot />
      </NUploadDragger>
    </template>
    <template v-else>
      <slot />
    </template>
    <input
      ref="inputRef"
      :class="ns.e('input')"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      type="file"
      @change="handleChange"
      @click.stop
    />
  </div>
</template>
