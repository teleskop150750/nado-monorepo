import { withInstall, withNoopInstall } from '../../utils/index.js'
import _NDropdown from './src/NDropdown.vue'
import _NDropdownItem from './src/NDropdownItem.vue'
import _NDropdownMenu from './src/NDropdownMenu.vue'

export const NDropdown = withInstall(_NDropdown, {
  NDropdownItem: _NDropdownItem,
  NDropdownMenu: _NDropdownMenu,
})

export const NDropdownItem = withNoopInstall(_NDropdownItem)
export const NDropdownMenu = withNoopInstall(_NDropdownMenu)
export * from './src/dropdown.js'
export * from './src/tokens.js'
