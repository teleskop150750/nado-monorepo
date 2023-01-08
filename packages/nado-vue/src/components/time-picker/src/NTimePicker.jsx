import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import { defineComponent, provide, ref } from 'vue'

import { NDateTimePicker, timePickerDefaultProps } from '../../date-time-picker/index.js'
// import NDateTimePicker from './common/NPicker.vue'
// import { timePickerDefaultProps } from './common/time-picker-default-props.js'
import { DEFAULT_FORMATS_TIME } from './constants.js'
import NPanelTimePick from './time-picker-com/NPanelTimePick.vue'
import NPanelTimeRange from './time-picker-com/NPanelTimeRange.vue'
import { POPPER_OPTIONS_INJECTION_KEY } from './tokens.js'

// NDateTimePicker
dayjs.extend(customParseFormat)

export default defineComponent({
  name: 'NTimePicker',
  install: null,
  props: {
    ...timePickerDefaultProps,
    isRange: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const commonPicker = ref()
    const [type, Panel] = props.isRange ? ['timerange', NPanelTimeRange] : ['time', NPanelTimePick]

    const modelUpdater = (value) => ctx.emit('update:modelValue', value)

    provide(POPPER_OPTIONS_INJECTION_KEY, props.popperOptions)
    ctx.expose({
      /**
       * @param {FocusEvent} [evt]
       * @description focus on the input element
       */
      focus: (evt) => {
        commonPicker.value?.handleFocusInput(evt)
      },
      /**
       * @param {FocusEvent} [evt]
       * @description blur from the input element
       */
      blur: (evt) => {
        commonPicker.value?.handleBlurInput(evt)
      },
      /**
       * @description opens the picker element
       */
      handleOpen: () => {
        commonPicker.value?.handleOpen()
      },
      /**
       * @description closes the picker element
       */
      handleClose: () => {
        commonPicker.value?.handleClose()
      },
    })

    return () => {
      const format = props.format ?? DEFAULT_FORMATS_TIME

      return (
        <NDateTimePicker {...props} ref={commonPicker} type={type} format={format} onUpdate:modelValue={modelUpdater}>
          {{
            // default: () => <div>111</div>,
            default: (scope) => <Panel {...scope} />,
          }}
        </NDateTimePicker>
      )
    }
  },
})
