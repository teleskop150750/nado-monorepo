import { panelSharedProps } from './shared.js'

export const panelDatePickProps = {
  ...panelSharedProps,
  parsedValue: {
    type: [Object, Array],
  },
  visible: {
    type: Boolean,
  },
  format: {
    type: String,
    default: '',
  },
}
