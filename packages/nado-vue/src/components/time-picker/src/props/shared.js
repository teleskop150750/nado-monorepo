export const disabledTimeListsProps = {
  disabledHours: {
    type: Function,
  },
  disabledMinutes: {
    type: Function,
  },
  disabledSeconds: {
    type: Function,
  },
}

export const timePanelSharedProps = {
  visible: Boolean,
  actualVisible: {
    type: Boolean,
    default: undefined,
  },
  format: {
    type: String,
    default: '',
  },
}
