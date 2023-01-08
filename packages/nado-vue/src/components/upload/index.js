import { withInstall } from '../../utils/index.js'
import _NUpload from './src/NUpload.vue'

export const NUpload = withInstall(_NUpload)

export * from './src/upload.js'
export * from './src/upload-content.js'
export * from './src/upload-dragger.js'
export * from './src/upload-list.js'
