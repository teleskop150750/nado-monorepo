import { isArray } from '../../../utils/index.js'

export const uploadDraggerProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
}

export const uploadDraggerEmits = {
  file: (file) => isArray(file),
}
