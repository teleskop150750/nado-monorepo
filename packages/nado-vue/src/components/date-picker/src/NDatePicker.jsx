import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import localeData from 'dayjs/plugin/localeData.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import weekYear from 'dayjs/plugin/weekYear.js'
import { defineComponent, provide, reactive, ref, toRef } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { ROOT_PICKER_INJECTION_KEY } from '../../../tokens/index.js'
import { NDateTimePicker } from '../../date-time-picker/index.js'
import { POPPER_OPTIONS_INJECTION_KEY } from '../../date-time-picker/src/tokens.js'
import { DEFAULT_FORMATS_DATE, DEFAULT_FORMATS_DATE_PICKER, timePickerDefaultProps } from '../../time-picker/index.js'
import { getPanel } from './panel-utils.js'
import { datePickerProps } from './props/date-picker.js'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(dayOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default defineComponent({
  name: 'NDatePicker',
  install: null,
  props: {
    // FIXME: move this to date-picker.ts
    ...timePickerDefaultProps,
    ...datePickerProps,
  },
  emits: ['update:modelValue'],
  setup(props, { expose, emit, slots }) {
    const ns = useNamespace('picker-panel')

    provide(POPPER_OPTIONS_INJECTION_KEY, reactive(toRef(props, 'popperOptions')))
    provide(ROOT_PICKER_INJECTION_KEY, {
      slots,
      pickerNs: ns,
    })

    const commonPicker = ref()
    const refProps = {
      focus: (focusStartInput = true) => {
        commonPicker.value?.focus(focusStartInput)
      },
      handleOpen: () => {
        commonPicker.value?.handleOpen()
      },
      handleClose: () => {
        commonPicker.value?.handleClose()
      },
    }

    expose(refProps)

    const onModelValueUpdated = (val) => {
      emit('update:modelValue', val)
    }

    return () => {
      // since props always have all defined keys on it, {format, ...props} will always overwrite format
      // pick props.format or provide default value here before spreading
      const format = props.format ?? (DEFAULT_FORMATS_DATE_PICKER[props.type] || DEFAULT_FORMATS_DATE)

      // @ts-ignore
      const Component = getPanel(props.type)

      return (
        <NDateTimePicker
          {...props}
          format={format}
          type={props.type}
          ref={commonPicker}
          onUpdate:modelValue={onModelValueUpdated}
        >
          {{
            default: (scopedProps) => <Component {...scopedProps} />,
            'range-separator': slots['range-separator'],
          }}
        </NDateTimePicker>
      )
    }
  },
})
