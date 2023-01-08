import { NOOP } from '@vue/shared'

import { uploadListTypes } from './upload.js'

export const uploadListProps = {
  files: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  handlePreview: {
    type: Function,
    default: NOOP,
  },
  listType: {
    type: String,
    default: 'text',
    validator(val) {
      return uploadListTypes.includes(val)
    },
  },
}

export const uploadListEmits = {
  /**
   *
   * @param {import('./upload.types.js').UploadFile} file
   * @returns
   */
  remove: (file) => !!file,
}
