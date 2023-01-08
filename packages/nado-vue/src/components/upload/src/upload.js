import { NOOP } from '@vue/shared'

import { ajaxUpload } from './ajax.js'

export const uploadListTypes = ['text', 'picture', 'picture-card']

let fileId = 1

export const genFileId = () => {
  fileId += 1

  return Date.now() + fileId
}

export const uploadBaseProps = {
  action: {
    type: String,
    default: '#',
  },
  headers: {
    type: Object,
  },
  method: {
    type: String,
    default: 'post',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'file',
  },
  drag: {
    type: Boolean,
    default: false,
  },
  withCredentials: {
    type: Boolean,
    default: true,
  },
  showFileList: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'select',
  },
  fileList: {
    type: Array,
    default: () => [],
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  listType: {
    type: String,
    values: uploadListTypes,
    default: 'text',
  },
  httpRequest: {
    type: Function,
    default: ajaxUpload,
  },
  disabled: Boolean,
  limit: Number,
}

export const uploadProps = {
  ...uploadBaseProps,
  beforeUpload: {
    type: Function,
    default: NOOP,
  },
  beforeRemove: {
    type: Function,
    default: NOOP,
  },
  onRemove: {
    type: Function,
    default: NOOP,
  },
  onChange: {
    type: Function,
    default: NOOP,
  },
  onPreview: {
    type: Function,
    default: NOOP,
  },
  onSuccess: {
    type: Function,
    default: NOOP,
  },
  onProgress: {
    type: Function,
    default: NOOP,
  },
  onError: {
    type: Function,
    default: NOOP,
  },
  onExceed: {
    type: Function,
    default: NOOP,
  },
}
