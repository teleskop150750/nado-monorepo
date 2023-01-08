import { withInstall, withNoopInstall } from '../../utils/index.js'
import { NOption as _NOption } from './src/NOption.jsx'
import { NOptionGroup as _NOptionGroup } from './src/NOptionGroup.jsx'
import { NSelect as _NSelect } from './src/NSelect.jsx'

export const NSelect = withInstall(_NSelect, {
  NOption: _NOption,
  NOptionGroup: _NOptionGroup,
})
export const NOption = withNoopInstall(_NOption)
export const NOptionGroup = withNoopInstall(_NOptionGroup)
