import { NOOP } from '@vue/shared'

import { uploadBaseProps } from './upload.js'

export const uploadContentProps = {
  ...uploadBaseProps,

  beforeUpload: {
    type: Function,
    default: NOOP,
  },
  onRemove: {
    type: Function,
    default: NOOP,
  },
  onStart: {
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
