<script setup>
import dayjs from 'dayjs'
import { union } from 'lodash-unified'
import { computed, inject, ref, unref } from 'vue'

import { EVENT_CODE } from '../../../../constants/index.js'
import { useLocale, useNamespace } from '../../../../hooks/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../../tokens/index.js'
import { isArray } from '../../../../utils/types.js'
import { useTimePanel } from '../composables/useTimePanel.js'
import { buildAvailableTimeSlotGetter, useOldValue } from '../composables/useTimePicker.js'
import { panelTimeRangeProps } from '../props/panel-time-range-props.js'
import NBasicTimeSpinner from './NBasicTimeSpinner.vue'

const props = defineProps(panelTimeRangeProps)
const emit = defineEmits(['pick', 'select-range', 'set-picker-option'])

/**
 * @param {number} start
 * @param {number} end
 */
const makeSelectRange = (start, end) => {
  const result = []

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  return result
}

const { lang, locale } = useLocale()
const nsTime = useNamespace('time')
const nsPicker = useNamespace('picker')
const pickerBase = inject(PICKER_BASE_INJECTION_KEY)
const { arrowControl, disabledHours, disabledMinutes, disabledSeconds, defaultValue } = pickerBase.props

const startTime = computed(() => props.parsedValue[0])
const endTime = computed(() => props.parsedValue[1])
const oldValue = useOldValue(props)

const handleCancel = () => {
  emit('pick', oldValue.value, false)
}
const showSeconds = computed(() => props.format.includes('ss'))
const amPmMode = computed(() => {
  if (props.format.includes('A')) {
    return 'A'
  }

  if (props.format.includes('a')) {
    return 'a'
  }

  return ''
})

const handleConfirm = (visible = false) => {
  emit('pick', [startTime.value, endTime.value], visible)
}

const handleChange = (start, end) => {
  // TODO getRangeAvailableTime(_date).millisecond(0)
  emit('pick', [start, end], true)
}

const handleMinChange = (date) => {
  handleChange(date.millisecond(0), endTime.value)
}

const handleMaxChange = (date) => {
  handleChange(startTime.value, date.millisecond(0))
}

const isValidValue = (_date) => {
  const parsedDate = _date.map((_) => dayjs(_).locale(lang))
  // eslint-disable-next-line no-use-before-define
  const result = getRangeAvailableTime(parsedDate)

  return parsedDate[0].isSame(result[0]) && parsedDate[1].isSame(result[1])
}
const btnConfirmDisabled = computed(() => startTime.value > endTime.value)

const selectionRange = ref([0, 2])
const setMinSelectionRange = (start, end) => {
  emit('select-range', start, end, 'min')
  selectionRange.value = [start, end]
}

const offset = computed(() => (showSeconds.value ? 11 : 8))
const setMaxSelectionRange = (start, end) => {
  emit('select-range', start, end, 'max')
  const _offset = unref(offset)

  selectionRange.value = [start + _offset, end + _offset]
}

const changeSelectionRange = (step) => {
  const list = showSeconds.value ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11]
  const mapping = ['hours', 'minutes', ...(showSeconds.value ? ['seconds'] : [])]
  const index = list.indexOf(selectionRange.value[0])
  const next = (index + step + list.length) % list.length
  const half = list.length / 2

  if (next < half) {
    // eslint-disable-next-line no-use-before-define
    timePickerOptions.start_emitSelectRange(mapping[next])
  } else {
    // eslint-disable-next-line no-use-before-define
    timePickerOptions.end_emitSelectRange(mapping[next - half])
  }
}

/**
 * @param {KeyboardEvent} event
 */
const handleKeydown = (event) => {
  const { code } = event

  const { left, right, up, down } = EVENT_CODE

  if ([left, right].includes(code)) {
    const step = code === left ? -1 : 1

    changeSelectionRange(step)
    event.preventDefault()

    return
  }

  if ([up, down].includes(code)) {
    const step = code === up ? -1 : 1
    const role = selectionRange.value[0] < offset.value ? 'start' : 'end'

    // eslint-disable-next-line no-use-before-define
    timePickerOptions[`${role}_scrollDown`](step)
    event.preventDefault()
  }
}

const disabledHours_ = (role, compare) => {
  const defaultDisable = disabledHours ? disabledHours(role) : []
  const isStart = role === 'start'
  const compareDate = compare || (isStart ? endTime.value : startTime.value)
  const compareHour = compareDate.hour()
  const nextDisable = isStart ? makeSelectRange(compareHour + 1, 23) : makeSelectRange(0, compareHour - 1)

  return union(defaultDisable, nextDisable)
}

const disabledMinutes_ = (hour, role, compare) => {
  const defaultDisable = disabledMinutes ? disabledMinutes(hour, role) : []
  const isStart = role === 'start'
  const compareDate = compare || (isStart ? endTime.value : startTime.value)
  const compareHour = compareDate.hour()

  if (hour !== compareHour) {
    return defaultDisable
  }

  const compareMinute = compareDate.minute()
  const nextDisable = isStart ? makeSelectRange(compareMinute + 1, 59) : makeSelectRange(0, compareMinute - 1)

  return union(defaultDisable, nextDisable)
}

const disabledSeconds_ = (hour, minute, role, compare) => {
  const defaultDisable = disabledSeconds ? disabledSeconds(hour, minute, role) : []
  const isStart = role === 'start'
  const compareDate = compare || (isStart ? endTime.value : startTime.value)
  const compareHour = compareDate.hour()
  const compareMinute = compareDate.minute()

  if (hour !== compareHour || minute !== compareMinute) {
    return defaultDisable
  }

  const compareSecond = compareDate.second()
  const nextDisable = isStart ? makeSelectRange(compareSecond + 1, 59) : makeSelectRange(0, compareSecond - 1)

  return union(defaultDisable, nextDisable)
}

const getRangeAvailableTime = ([start, end]) => [
  // eslint-disable-next-line no-use-before-define
  getAvailableTime(start, 'start', true, end),
  // eslint-disable-next-line no-use-before-define
  getAvailableTime(end, 'end', false, start),
]

const { getAvailableHours, getAvailableMinutes, getAvailableSeconds } = buildAvailableTimeSlotGetter(
  // @ts-ignore
  disabledHours_,
  // @ts-ignore
  disabledMinutes_,
  // @ts-ignore
  disabledSeconds_,
)

const {
  timePickerOptions,

  getAvailableTime,
  onSetOption,
} = useTimePanel({
  getAvailableHours,
  getAvailableMinutes,
  getAvailableSeconds,
})

const parseUserInput = (days) => {
  if (!days) {
    return null
  }

  if (isArray(days)) {
    return days.map((d) => dayjs(d, props.format).locale(lang))
  }

  return dayjs(days, props.format).locale(lang)
}

const formatToString = (days) => {
  if (!days) {
    return null
  }

  if (isArray(days)) {
    return days.map((d) => d.format(props.format))
  }

  return days.format(props.format)
}

const getDefaultValue = () => {
  if (isArray(defaultValue)) {
    return defaultValue.map((d) => dayjs(d).locale(lang))
  }

  const defaultDay = dayjs(defaultValue).locale(lang)

  return [defaultDay, defaultDay.add(60, 'm')]
}

emit('set-picker-option', ['formatToString', formatToString])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['isValidValue', isValidValue])
emit('set-picker-option', ['handleKeydownInput', handleKeydown])
emit('set-picker-option', ['getDefaultValue', getDefaultValue])
emit('set-picker-option', ['getRangeAvailableTime', getRangeAvailableTime])
</script>

<template>
  <div v-if="actualVisible" :class="[nsTime.b('range-picker'), nsPicker.b('panel')]">
    <div :class="nsTime.be('range-picker', 'content')">
      <div :class="nsTime.be('range-picker', 'cell')">
        <div :class="nsTime.be('range-picker', 'header')">
          {{ locale.el.datepicker.startTime }}
        </div>
        <div
          :class="[
            nsTime.be('range-picker', 'body'),
            nsTime.be('panel', 'content'),
            nsTime.is('arrow', arrowControl),
            nsTime.beHas('panel', 'content', 'seconds', showSeconds),
          ]"
        >
          <NBasicTimeSpinner
            ref="minSpinner"
            role="start"
            :show-seconds="showSeconds"
            :am-pm-mode="amPmMode"
            :arrow-control="arrowControl"
            :spinner-date="startTime"
            :disabled-hours="disabledHours_"
            :disabled-minutes="disabledMinutes_"
            :disabled-seconds="disabledSeconds_"
            @change="handleMinChange"
            @set-option="onSetOption"
            @select-range="setMinSelectionRange"
          />
        </div>
      </div>
      <div :class="nsTime.be('range-picker', 'cell')">
        <div :class="nsTime.be('range-picker', 'header')">
          {{ locale.el.datepicker.endTime }}
        </div>
        <div
          :class="[
            nsTime.be('range-picker', 'body'),
            nsTime.be('panel', 'content'),
            nsTime.beHas('panel', 'content', 'seconds', showSeconds),
            nsTime.is('arrow', arrowControl),
          ]"
        >
          <NBasicTimeSpinner
            ref="maxSpinner"
            role="end"
            :show-seconds="showSeconds"
            :am-pm-mode="amPmMode"
            :arrow-control="arrowControl"
            :spinner-date="endTime"
            :disabled-hours="disabledHours_"
            :disabled-minutes="disabledMinutes_"
            :disabled-seconds="disabledSeconds_"
            @change="handleMaxChange"
            @set-option="onSetOption"
            @select-range="setMaxSelectionRange"
          />
        </div>
      </div>
    </div>
    <div :class="nsTime.be('panel', 'footer')">
      <button type="button" class="cancel" :class="[nsTime.be('panel', 'btn')]" @click="handleCancel()">
        {{ locale.el.datepicker.cancel }}
      </button>
      <button
        type="button"
        class="confirm"
        :class="[nsTime.be('panel', 'btn')]"
        :disabled="btnConfirmDisabled"
        @click="handleConfirm()"
      >
        {{ locale.el.datepicker.confirm }}
      </button>
    </div>
  </div>
</template>
