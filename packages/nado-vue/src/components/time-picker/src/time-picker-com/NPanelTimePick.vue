<script setup>
import dayjs from 'dayjs'
import { computed, inject, ref } from 'vue'

import { EVENT_CODE } from '../../../../constants/aria.js'
import { useLocale, useNamespace } from '../../../../hooks/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../../tokens/index.js'
import { isUndefined } from '../../../../utils/index.js'
import { useTimePanel } from '../composables/useTimePanel.js'
import { buildAvailableTimeSlotGetter, useOldValue } from '../composables/useTimePicker.js'
import { panelTimePickerProps } from '../props/panel-time-picker-props.js'
import NBasicTimeSpinner from './NBasicTimeSpinner.vue'

const props = defineProps(panelTimePickerProps)
const emit = defineEmits(['pick', 'select-range', 'set-picker-option'])

// Injections
const pickerBase = inject(PICKER_BASE_INJECTION_KEY)
const { arrowControl, disabledHours, disabledMinutes, disabledSeconds, defaultValue } = pickerBase.props
const { getAvailableHours, getAvailableMinutes, getAvailableSeconds } = buildAvailableTimeSlotGetter(
  disabledHours,
  disabledMinutes,
  disabledSeconds,
)

const ns = useNamespace('time')
const { lang, locale } = useLocale()
// data
const selectionRange = ref([0, 2])
const oldValue = useOldValue(props)
const { timePickerOptions, onSetOption, getAvailableTime } = useTimePanel({
  getAvailableHours,
  getAvailableMinutes,
  getAvailableSeconds,
})
// computed
const transitionName = computed(() => (isUndefined(props.actualVisible) ? `${ns.namespace}-zoom-in-top` : ''))
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
// method
const getRangeAvailableTime = (date) => getAvailableTime(date, props.datetimeRole || '', true)

const isValidValue = (_date) => {
  const parsedDate = dayjs(_date).locale(lang)

  const result = getRangeAvailableTime(parsedDate)

  return parsedDate.isSame(result)
}
const handleCancel = () => {
  emit('pick', oldValue.value, false)
}
const handleConfirm = (visible = false, first = false) => {
  if (first) {
    return
  }

  emit('pick', props.parsedValue, visible)
}

const handleChange = (_date) => {
  // visible avoids edge cases, when use scrolls during panel closing animation
  if (!props.visible) {
    return
  }

  const result = getRangeAvailableTime(_date).millisecond(0)

  emit('pick', result, true)
}

const setSelectionRange = (start, end) => {
  emit('select-range', start, end)
  selectionRange.value = [start, end]
}

const changeSelectionRange = (step) => {
  const list = [0, 3, ...(showSeconds.value ? [6] : [])]
  const mapping = ['hours', 'minutes', ...(showSeconds.value ? ['seconds'] : [])]
  const index = list.indexOf(selectionRange.value[0])
  const next = (index + step + list.length) % list.length

  timePickerOptions.start_emitSelectRange(mapping[next])
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

    timePickerOptions.start_scrollDown(step)
    event.preventDefault()
  }
}
const parseUserInput = (value) => {
  if (!value) {
    return null
  }

  return dayjs(value, props.format).locale(lang)
}

const formatToString = (value) => {
  if (!value) {
    return null
  }

  return value.format(props.format)
}

const getDefaultValue = () => dayjs(defaultValue).locale(lang)

emit('set-picker-option', ['isValidValue', isValidValue])
emit('set-picker-option', ['formatToString', formatToString])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['handleKeydownInput', handleKeydown])
emit('set-picker-option', ['getRangeAvailableTime', getRangeAvailableTime])
emit('set-picker-option', ['getDefaultValue', getDefaultValue])
</script>

<template>
  <transition :name="transitionName">
    <div v-if="actualVisible || visible" :class="ns.b('panel')">
      <div :class="[ns.be('panel', 'content'), ns.beHas('panel', 'content', 'seconds', showSeconds)]">
        <NBasicTimeSpinner
          ref="spinner"
          :role="datetimeRole || 'start'"
          :arrow-control="arrowControl"
          :show-seconds="showSeconds"
          :am-pm-mode="amPmMode"
          :spinner-date="parsedValue"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
          @change="handleChange"
          @set-option="onSetOption"
          @select-range="setSelectionRange"
        />
      </div>
      <div :class="ns.be('panel', 'footer')">
        <button type="button" class="cancel" :class="[ns.be('panel', 'btn')]" @click="handleCancel">
          {{ locale.el.datepicker.cancel }}
        </button>
        <button type="button" class="confirm" :class="[ns.be('panel', 'btn')]" @click="handleConfirm()">
          {{ locale.el.datepicker.confirm }}
        </button>
      </div>
    </div>
  </transition>
</template>
