import { withInstall, withNoopInstall } from '../../utils/index.js'
import _NButton from './src/NButton.vue'
import _NButtonGroup from './src/NButtonGroup.vue'

export const NButton = withInstall(_NButton, {
  NButtonGroup: _NButtonGroup,
})
export const NButtonGroup = withNoopInstall(_NButtonGroup)
export default NButton
