import { withInstall, withNoopInstall } from '../../utils/index.js'
import { NForm as _NForm } from './src/NForm.jsx'
import { NFormItem as _NFormItem } from './src/NFormItem.jsx'

export const NForm = withInstall(_NForm, {
  NFormItem: _NFormItem,
})
export const NFormItem = withNoopInstall(_NFormItem)
