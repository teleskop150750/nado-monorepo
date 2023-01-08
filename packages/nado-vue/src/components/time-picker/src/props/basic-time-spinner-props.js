import { disabledTimeListsProps } from './shared.js'

export const basicTimeSpinnerProps = {
  role: {
    type: String,
    required: true,
  },
  spinnerDate: {
    type: Object,
    required: true,
  },
  showSeconds: {
    type: Boolean,
    default: true,
  },
  arrowControl: Boolean,
  amPmMode: {
    // 'a': am/pm; 'A': AM/PM
    type: String,
    default: '',
  },
  ...disabledTimeListsProps,
}
