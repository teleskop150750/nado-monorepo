import { timePanelSharedProps } from './shared.js'

export const panelTimePickerProps = {
  ...timePanelSharedProps,
  datetimeRole: String,
  parsedValue: {
    type: Object,
  },
}
