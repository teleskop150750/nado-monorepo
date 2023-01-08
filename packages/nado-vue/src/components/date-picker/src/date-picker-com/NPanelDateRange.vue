<script setup>
import dayjs from 'dayjs'
import { computed, inject, ref, toRef, unref } from 'vue'

import { ClickOutside as vClickOutside } from '../../../../directives/index.js'
import { useLocale } from '../../../../hooks/index.js'
import {
  NIconChevronDoubleLeft,
  NIconChevronDoubleRight,
  NIconChevronLeft,
  NIconChevronRight,
} from '../../../../icons/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../../tokens/index.js'
import { isArray } from '../../../../utils/index.js'
import { NButton } from '../../../button/index.js'
import { extractDateFormat, extractTimeFormat } from '../../../date-time-picker/index.js'
import { NInput } from '../../../input/index.js'
import { TimePickPanel } from '../../../time-picker/index.js'
import { useRangePicker } from '../composables/useRangePicker.js'
import { panelDateRangeProps } from '../props/panel-date-range.js'
import { getDefaultValue, isValidRange } from '../utils.js'
import NDatePickerTable from './NDatePickerTable.vue'

const props = defineProps(panelDateRangeProps)
const emit = defineEmits(['pick', 'set-picker-option', 'calendar-change', 'panel-change'])

const unit = 'month'
// FIXME: fix the type for ep picker
/** @type {any} pickerBase */
const pickerBase = inject(PICKER_BASE_INJECTION_KEY)
const { disabledDate, cellClassName, format, defaultTime, arrowControl, clearable } = pickerBase.props
const shortcuts = toRef(pickerBase.props, 'shortcuts')
const defaultValue = toRef(pickerBase.props, 'defaultValue')
const { lang } = useLocale()
const leftDate = ref(dayjs().locale(lang))
const rightDate = ref(dayjs().locale(lang).add(1, unit))

const {
  minDate,
  maxDate,
  rangeState,
  drpNs,

  handleChangeRange,
  handleRangeConfirm,
  handleShortcutClick,
  onSelect,
  locale,
} = useRangePicker(props, {
  defaultValue,
  leftDate,
  rightDate,
  unit,
  onParsedValueChanged,
})

const dateUserInput = ref({
  min: null,
  max: null,
})

const timeUserInput = ref({
  min: null,
  max: null,
})

const leftLabel = computed(
  () =>
    `${leftDate.value.year()} ${locale.el.datepicker.year} ${
      locale.el.datepicker[`month${leftDate.value.month() + 1}`]
    }`,
)

const rightLabel = computed(
  () =>
    `${rightDate.value.year()} ${locale.el.datepicker.year} ${
      locale.el.datepicker[`month${rightDate.value.month() + 1}`]
    }`,
)

const leftYear = computed(() => leftDate.value.year())

const leftMonth = computed(() => leftDate.value.month())

const rightYear = computed(() => rightDate.value.year())

const rightMonth = computed(() => rightDate.value.month())

const hasShortcuts = computed(() => shortcuts.value.length > 0)

const minVisibleDate = computed(() => {
  if (dateUserInput.value.min !== null) {
    return dateUserInput.value.min
  }

  if (minDate.value) {
    // eslint-disable-next-line no-use-before-define
    return minDate.value.format(dateFormat.value)
  }

  return ''
})

const maxVisibleDate = computed(() => {
  if (dateUserInput.value.max !== null) {
    return dateUserInput.value.max
  }

  if (maxDate.value || minDate.value) {
    // eslint-disable-next-line no-use-before-define
    return (maxDate.value || minDate.value).format(dateFormat.value)
  }

  return ''
})

const minVisibleTime = computed(() => {
  if (timeUserInput.value.min !== null) {
    return timeUserInput.value.min
  }

  if (minDate.value) {
    // eslint-disable-next-line no-use-before-define
    return minDate.value.format(timeFormat.value)
  }

  return ''
})

const maxVisibleTime = computed(() => {
  if (timeUserInput.value.max !== null) {
    return timeUserInput.value.max
  }

  if (maxDate.value || minDate.value) {
    // eslint-disable-next-line no-use-before-define
    return (maxDate.value || minDate.value).format(timeFormat.value)
  }

  return ''
})

const timeFormat = computed(() => extractTimeFormat(format))

const dateFormat = computed(() => extractDateFormat(format))

const leftPrevYear = () => {
  leftDate.value = leftDate.value.subtract(1, 'year')

  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

const leftPrevMonth = () => {
  leftDate.value = leftDate.value.subtract(1, 'month')

  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

const rightNextYear = () => {
  if (!props.unlinkPanels) {
    leftDate.value = leftDate.value.add(1, 'year')
    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = rightDate.value.add(1, 'year')
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

const rightNextMonth = () => {
  if (!props.unlinkPanels) {
    leftDate.value = leftDate.value.add(1, 'month')
    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = rightDate.value.add(1, 'month')
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

const leftNextYear = () => {
  leftDate.value = leftDate.value.add(1, 'year')

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

const leftNextMonth = () => {
  leftDate.value = leftDate.value.add(1, 'month')

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

const rightPrevYear = () => {
  rightDate.value = rightDate.value.subtract(1, 'year')

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

const rightPrevMonth = () => {
  rightDate.value = rightDate.value.subtract(1, 'month')

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

/**
 * @param {'month' | 'year'} mode
 */
const handlePanelChange = (mode) => {
  emit('panel-change', [leftDate.value.toDate(), rightDate.value.toDate()], mode)
}

const enableMonthArrow = computed(() => {
  const nextMonth = (leftMonth.value + 1) % 12
  const yearOffset = leftMonth.value + 1 >= 12 ? 1 : 0

  return (
    props.unlinkPanels && new Date(leftYear.value + yearOffset, nextMonth) < new Date(rightYear.value, rightMonth.value)
  )
})

const enableYearArrow = computed(
  () =>
    props.unlinkPanels && rightYear.value * 12 + rightMonth.value - (leftYear.value * 12 + leftMonth.value + 1) >= 12,
)

const btnDisabled = computed(
  () =>
    !(minDate.value && maxDate.value && !rangeState.value.selecting && isValidRange([minDate.value, maxDate.value])),
)

const showTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')

/**
 *
 * @param {import('../props/date.type.js').TDayjs | null} emitDayjs
 * @param {number} [index]
 */
const formatEmit = (emitDayjs, index) => {
  if (!emitDayjs) {
    return
  }

  if (defaultTime) {
    const defaultTimeD = dayjs(defaultTime[index] || defaultTime).locale(lang)

    return defaultTimeD.year(emitDayjs.year()).month(emitDayjs.month()).date(emitDayjs.date())
  }

  return emitDayjs
}

const handleRangePick = (val, close = true) => {
  const min_ = val.minDate
  const max_ = val.maxDate
  const minDate_ = formatEmit(min_, 0)
  const maxDate_ = formatEmit(max_, 1)

  if (maxDate.value === maxDate_ && minDate.value === minDate_) {
    return
  }

  emit('calendar-change', [min_.toDate(), max_ && max_.toDate()])
  maxDate.value = maxDate_
  minDate.value = minDate_

  if (!close || showTime.value) {
    return
  }

  handleRangeConfirm()
}

const minTimePickerVisible = ref(false)
const maxTimePickerVisible = ref(false)

const handleMinTimeClose = () => {
  minTimePickerVisible.value = false
}

const handleMaxTimeClose = () => {
  maxTimePickerVisible.value = false
}

/**
 *
 * @param {string | null} value
 * @param {any} type
 */
const handleDateInput = (value, type) => {
  dateUserInput.value[type] = value
  const parsedValueD = dayjs(value, dateFormat.value).locale(lang)

  if (parsedValueD.isValid()) {
    if (disabledDate && disabledDate(parsedValueD.toDate())) {
      return
    }

    if (type === 'min') {
      leftDate.value = parsedValueD
      minDate.value = (minDate.value || leftDate.value)
        .year(parsedValueD.year())
        .month(parsedValueD.month())
        .date(parsedValueD.date())

      if (!props.unlinkPanels) {
        rightDate.value = parsedValueD.add(1, 'month')
        maxDate.value = minDate.value.add(1, 'month')
      }
    } else {
      rightDate.value = parsedValueD
      maxDate.value = (maxDate.value || rightDate.value)
        .year(parsedValueD.year())
        .month(parsedValueD.month())
        .date(parsedValueD.date())

      if (!props.unlinkPanels) {
        leftDate.value = parsedValueD.subtract(1, 'month')
        minDate.value = maxDate.value.subtract(1, 'month')
      }
    }
  }
}

const handleDateChange = (_, type) => {
  dateUserInput.value[type] = null
}

const handleTimeInput = (value, type) => {
  timeUserInput.value[type] = value
  const parsedValueD = dayjs(value, timeFormat.value).locale(lang)

  if (parsedValueD.isValid()) {
    if (type === 'min') {
      minTimePickerVisible.value = true
      minDate.value = (minDate.value || leftDate.value)
        .hour(parsedValueD.hour())
        .minute(parsedValueD.minute())
        .second(parsedValueD.second())

      if (!maxDate.value || maxDate.value.isBefore(minDate.value)) {
        maxDate.value = minDate.value
      }
    } else {
      maxTimePickerVisible.value = true
      maxDate.value = (maxDate.value || rightDate.value)
        .hour(parsedValueD.hour())
        .minute(parsedValueD.minute())
        .second(parsedValueD.second())
      rightDate.value = maxDate.value

      if (maxDate.value && maxDate.value.isBefore(minDate.value)) {
        minDate.value = maxDate.value
      }
    }
  }
}

const handleTimeChange = (value, type) => {
  timeUserInput.value[type] = null

  if (type === 'min') {
    leftDate.value = minDate.value
    minTimePickerVisible.value = false
  } else {
    rightDate.value = maxDate.value
    maxTimePickerVisible.value = false
  }
}

/**
 *
 * @param {import('../props/date.type.js').TDayjs} value
 * @param {boolean} visible
 * @param {boolean} first
 */
const handleMinTimePick = (value, visible, first) => {
  if (timeUserInput.value.min) {
    return
  }

  if (value) {
    leftDate.value = value
    minDate.value = (minDate.value || leftDate.value).hour(value.hour()).minute(value.minute()).second(value.second())
  }

  if (!first) {
    minTimePickerVisible.value = visible
  }

  if (!maxDate.value || maxDate.value.isBefore(minDate.value)) {
    maxDate.value = minDate.value
    rightDate.value = value
  }
}

/**
 * @param {import('../props/date.type.js').TDayjs | null} value
 * @param {boolean} visible
 * @param {boolean} first
 */
const handleMaxTimePick = (value, visible, first) => {
  if (timeUserInput.value.max) {
    return
  }

  if (value) {
    rightDate.value = value
    maxDate.value = (maxDate.value || rightDate.value).hour(value.hour()).minute(value.minute()).second(value.second())
  }

  if (!first) {
    maxTimePickerVisible.value = visible
  }

  if (maxDate.value && maxDate.value.isBefore(minDate.value)) {
    minDate.value = maxDate.value
  }
}

const handleClear = () => {
  // eslint-disable-next-line prefer-destructuring
  leftDate.value = getDefaultValue(unref(defaultValue), {
    lang: unref(lang),
    unit: 'month',
    unlinkPanels: props.unlinkPanels,
  })[0]
  rightDate.value = leftDate.value.add(1, 'month')
  emit('pick', null)
}

/**
 * @param {import('../props/date.type.js').TDayjs | import('../props/date.type.js').TDayjs[]} value
 */
const formatToString = (value) => (isArray(value) ? value.map((_) => _.format(format)) : value.format(format))

/**
 * @param {import('../props/date.type.js').TDayjs | import('../props/date.type.js').TDayjs[]} value
 */
const parseUserInput = (value) =>
  isArray(value) ? value.map((_) => dayjs(_, format).locale(lang)) : dayjs(value, format).locale(lang)

/**
 *
 * @param {import('../props/date.type.js').TDayjs | undefined} _minDate
 * @param {import('../props/date.type.js').TDayjs | undefined} _maxDate
 */
function onParsedValueChanged(_minDate, _maxDate) {
  if (props.unlinkPanels && _maxDate) {
    const minDateYear = _minDate?.year() || 0
    const minDateMonth = _minDate?.month() || 0
    const maxDateYear = _maxDate.year()
    const maxDateMonth = _maxDate.month()

    rightDate.value = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? _maxDate.add(1, unit) : _maxDate
  } else {
    rightDate.value = leftDate.value.add(1, unit)

    if (_maxDate) {
      rightDate.value = rightDate.value.hour(_maxDate.hour()).minute(_maxDate.minute()).second(_maxDate.second())
    }
  }
}

emit('set-picker-option', ['isValidValue', isValidRange])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['formatToString', formatToString])
emit('set-picker-option', ['handleClear', handleClear])
</script>

<template>
  <div :class="[drpNs.b(), drpNs.has('sidebar', Boolean($slots.sidebar) || hasShortcuts), drpNs.has('time', showTime)]">
    <div :class="drpNs.e('body-wrapper')">
      <slot name="sidebar" :class="drpNs.e('sidebar')" />
      <div v-if="hasShortcuts" :class="drpNs.e('sidebar')">
        <button
          v-for="(shortcut, key) in shortcuts"
          :key="key"
          type="button"
          :class="drpNs.e('shortcut')"
          @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div :class="drpNs.e('body')">
        <div v-if="showTime" :class="drpNs.e('time-header')">
          <span :class="drpNs.e('editors-wrap')">
            <span :class="drpNs.e('time-picker-wrap')">
              <NInput
                size="small"
                :disabled="rangeState.selecting"
                :placeholder="locale.el.datepicker.startDate"
                :class="drpNs.e('editor')"
                :model-value="minVisibleDate"
                :validate-event="false"
                @input="(val) => handleDateInput(val, 'min')"
                @change="(val) => handleDateChange(val, 'min')"
              />
            </span>
            <span v-click-outside="handleMinTimeClose" :class="drpNs.e('time-picker-wrap')">
              <NInput
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="locale.el.datepicker.startTime"
                :model-value="minVisibleTime"
                :validate-event="false"
                @focus="minTimePickerVisible = true"
                @input="(val) => handleTimeInput(val, 'min')"
                @change="(val) => handleTimeChange(val, 'min')"
              />
              <TimePickPanel
                :visible="minTimePickerVisible"
                :format="timeFormat"
                datetime-role="start"
                :time-arrow-control="arrowControl"
                :parsed-value="leftDate"
                @pick="handleMinTimePick"
              />
            </span>
          </span>
          <span>
            <span class="n-icon"><NIconChevronDoubleRight /></span>
          </span>
          <span :class="drpNs.e('editors-wrap')" class="is-right">
            <span :class="drpNs.e('time-picker-wrap')">
              <NInput
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="locale.el.datepicker.endDate"
                :model-value="maxVisibleDate"
                :readonly="!minDate"
                :validate-event="false"
                @input="(val) => handleDateInput(val, 'max')"
                @change="(val) => handleDateChange(val, 'max')"
              />
            </span>
            <span v-click-outside="handleMaxTimeClose" :class="drpNs.e('time-picker-wrap')">
              <NInput
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="locale.el.datepicker.endTime"
                :model-value="maxVisibleTime"
                :readonly="!minDate"
                :validate-event="false"
                @focus="minDate && (maxTimePickerVisible = true)"
                @input="(val) => handleTimeInput(val, 'max')"
                @change="(val) => handleTimeChange(val, 'max')"
              />
              <TimePickPanel
                datetime-role="end"
                :visible="maxTimePickerVisible"
                :format="timeFormat"
                :time-arrow-control="arrowControl"
                :parsed-value="rightDate"
                @pick="handleMaxTimePick"
              />
            </span>
          </span>
        </div>
        <div :class="[drpNs.e('content')]" class="is-left">
          <div :class="drpNs.e('header')">
            <div :class="drpNs.e('header-buttons')">
              <button type="button" :class="drpNs.e('icon-btn')" class="d-arrow-left" @click="leftPrevYear">
                <span class="n-icon"><NIconChevronDoubleLeft /></span>
              </button>
              <button type="button" :class="drpNs.e('icon-btn')" class="arrow-left" @click="leftPrevMonth">
                <span class="n-icon"><NIconChevronLeft /></span>
              </button>
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="[drpNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
                class="d-arrow-right"
                @click="leftNextMonth"
              >
                <span class="n-icon"><NIconChevronRight /></span>
              </button>
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="[drpNs.e('icon-btn'), { 'is-disabled': !enableMonthArrow }]"
                class="arrow-right"
                @click="leftNextYear"
              >
              <span class="n-icon"><NIconChevronDoubleRight /></span>
              </button>
            </div>
            <div :class="drpNs.e('header-label')">{{ leftLabel }}</div>
          </div>
          <NDatePickerTable
            selection-mode="range"
            :date="leftDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            @change-range="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
        <div :class="[drpNs.e('content')]" class="is-right">
          <div :class="drpNs.e('header')">
            <div :class="drpNs.e('header-label')">{{ rightLabel }}</div>
            <div :class="drpNs.e('header-buttons')">
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="[drpNs.e('icon-btn'), drpNs.eIs('icon-btn', 'disabled', !enableMonthArrow)]"
                class="d-arrow-left"
                @click="rightPrevYear"
              >
                <span class="n-icon"><NIconChevronDoubleLeft /></span>
              </button>
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="[drpNs.e('icon-btn'), drpNs.eIs('icon-btn', 'disabled', !enableMonthArrow)]"
                class="arrow-left"
                @click="rightPrevMonth"
              >
                <span class="n-icon"><NIconChevronLeft /></span>
              </button>
              <button type="button" :class="[drpNs.e('icon-btn'), drpNs.e('arrow-right')]" @click="rightNextMonth">
                <span class="n-icon"><NIconChevronRight /></span>
              </button>
              <button type="button" :class="[drpNs.e('icon-btn'), drpNs.e('arrow-right')]" @click="rightNextYear">
                <span class="n-icon"><NIconChevronDoubleRight /></span>
              </button>
            </div>
          </div>
          <NDatePickerTable
            selection-mode="range"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            @change-range="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
      </div>
    </div>
    <div v-if="showTime" :class="drpNs.e('footer')">
      <NButton v-if="clearable" text size="small" :class="drpNs.e('link-btn')" @click="handleClear">
        {{ locale.el.datepicker.clear }}
      </NButton>
      <NButton
        plain
        size="small"
        :class="drpNs.e('link-btn')"
        :disabled="btnDisabled"
        @click="handleRangeConfirm(false)"
      >
        {{ locale.el.datepicker.confirm }}
      </NButton>
    </div>
  </div>
</template>
