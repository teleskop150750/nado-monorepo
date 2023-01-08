import { useVModel } from '@vueuse/core'
import { isNil } from 'lodash-unified'
import { watch } from 'vue'

import { debugWarn, throwError } from '../../../utils/index.js'
import { genFileId } from './upload.js'

const SCOPE = 'NUpload'

/**
 * @param {import("./upload.types.js").UploadFile} file
 */
const revokeObjectURL = (file) => {
  if (file.url?.startsWith('blob:')) {
    URL.revokeObjectURL(file.url)
  }
}

/**
 *
 * @param {*} props
 * @param {import("vue").ShallowRef<* | undefined>} uploadRef
 * @returns
 */
export const useHandlers = (props, uploadRef) => {
  const uploadFiles = useVModel(props, 'fileList', undefined, { passive: true })

  /**
   * @param {import('./upload.types.js').UploadRawFile} rawFile
   */
  const getFile = (rawFile) => uploadFiles.value.find((file) => file.uid === rawFile.uid)

  /**
   * @param {import("./upload.types.js").UploadFile} file
   */
  function abort(file) {
    uploadRef.value?.abort(file)
  }

  function clearFiles(
    /** @default ['ready', 'uploading', 'success', 'fail'] */
    states = ['ready', 'uploading', 'success', 'fail'],
  ) {
    uploadFiles.value = uploadFiles.value.filter((row) => !states.includes(row.status))
  }

  const handleError = (err, rawFile) => {
    const file = getFile(rawFile)

    if (!file) {
      return
    }

    console.error(err)
    file.status = 'fail'
    uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1)
    props.onError(err, file, uploadFiles.value)
    props.onChange(file, uploadFiles.value)
  }

  const handleProgress = (evt, rawFile) => {
    const file = getFile(rawFile)

    if (!file) {
      return
    }

    props.onProgress(evt, file, uploadFiles.value)
    file.status = 'uploading'
    file.percentage = Math.round(evt.percent)
  }

  const handleSuccess = (response, rawFile) => {
    const file = getFile(rawFile)

    if (!file) {
      return
    }

    file.status = 'success'
    file.response = response
    props.onSuccess(response, file, uploadFiles.value)
    props.onChange(file, uploadFiles.value)
  }

  const handleStart = (file) => {
    if (isNil(file.uid)) {
      file.uid = genFileId()
    }

    /** @type{import("./upload.types.js").UploadFile} */
    const uploadFile = {
      name: file.name,
      percentage: 0,
      status: 'ready',
      size: file.size,
      raw: file,
      uid: file.uid,
    }

    if (props.listType === 'picture-card' || props.listType === 'picture') {
      try {
        uploadFile.url = URL.createObjectURL(file)
      } catch (error) {
        debugWarn(SCOPE, error.message)
        props.onError(error, uploadFile, uploadFiles.value)
      }
    }

    uploadFiles.value = [...uploadFiles.value, uploadFile]
    props.onChange(uploadFile, uploadFiles.value)
  }

  /**
   * @param {import('./upload.types.js').UploadFile | import('./upload.types.js').UploadRawFile} file
   */
  const handleRemove = async (file) => {
    const uploadFile = file instanceof File ? getFile(file) : file

    if (!uploadFile) {
      throwError(SCOPE, 'file to be removed not found')
    }

    /**
     * @param {import('./upload.types.js').UploadFile} _file
     */
    const doRemove = (_file) => {
      abort(_file)
      const fileList = uploadFiles.value

      fileList.splice(fileList.indexOf(_file), 1)
      props.onRemove(_file, fileList)
      revokeObjectURL(_file)
    }

    if (props.beforeRemove) {
      const before = await props.beforeRemove(uploadFile, uploadFiles.value)

      if (before !== false) {
        doRemove(uploadFile)
      }
    } else {
      doRemove(uploadFile)
    }
  }

  function submit() {
    uploadFiles.value
      .filter(({ status }) => status === 'ready')
      .forEach(({ raw }) => raw && uploadRef.value?.upload(raw))
  }

  watch(
    () => props.listType,
    (val) => {
      if (val !== 'picture-card' && val !== 'picture') {
        return
      }

      uploadFiles.value = uploadFiles.value.map((file) => {
        const { raw, url } = file

        if (!url && raw) {
          try {
            file.url = URL.createObjectURL(raw)
          } catch (error) {
            props.onError(error, file, uploadFiles.value)
          }
        }

        return file
      })
    },
  )

  watch(
    uploadFiles,
    (files) => {
      for (const file of files) {
        file.uid ||= genFileId()
        file.status ||= 'success'
      }
    },
    { immediate: true, deep: true },
  )

  return {
    /** @description two-way binding ref from props `fileList` */
    uploadFiles,
    abort,
    clearFiles,
    handleError,
    handleProgress,
    handleStart,
    handleSuccess,
    handleRemove,
    submit,
  }
}
