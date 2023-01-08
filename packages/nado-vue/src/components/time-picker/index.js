import { withInstall } from '../../utils/index.js'
import _NTimePicker from './src/NTimePicker.jsx'

export const NTimePicker = withInstall(_NTimePicker)

export * from '../date-time-picker/src/time-picker-default-props.js'
export * from './src/constants.js'
export { default as TimePickPanel } from './src/time-picker-com/NPanelTimePick.vue'
