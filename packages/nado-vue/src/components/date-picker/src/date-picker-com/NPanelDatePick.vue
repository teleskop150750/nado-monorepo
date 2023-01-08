<script setup>
import dayjs from 'dayjs'
import { computed, inject, nextTick, ref, toRef, useAttrs, useSlots, watch } from 'vue'

import { EVENT_CODE } from '../../../../constants/aria.js'
import { ClickOutside as vClickOutside } from '../../../../directives/index.js'
import { useLocale, useNamespace } from '../../../../hooks/index.js'
import {
  NIconChevronDoubleLeft,
  NIconChevronDoubleRight,
  NIconChevronLeft,
  NIconChevronRight,
} from '../../../../icons/index.js'
import { PICKER_BASE_INJECTION_KEY, TOOLTIP_INJECTION_KEY } from '../../../../tokens/index.js'
import { isArray, isFunction } from '../../../../utils/index.js'
import { NButton } from '../../../button/index.js'
import { extractDateFormat, extractTimeFormat } from '../../../date-time-picker/index.js'
import { NInput } from '../../../input/index.js'
import { TimePickPanel } from '../../../time-picker/index.js'
import { panelDatePickProps } from '../props/panel-date-pick.js'
import NBasicMonthTable from './NBasicMonthTable.vue'
import NBasicYearTable from './NBasicYearTable.vue'
import NDatePickerTable from './NDatePickerTable.vue'

const props = defineProps(panelDatePickProps)
const contextEmit = defineEmits(['pick', 'set-picker-option', 'panel-change'])
// todo
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timeWithinRange = (_, __, ___) => true
const dpNs = useNamespace('date-picker')
const attrs = useAttrs()
const slots = useSlots()

const { locale, lang } = useLocale()
/** @type {any} pickerBase */
const pickerBase = inject(PICKER_BASE_INJECTION_KEY)
const popper = inject(TOOLTIP_INJECTION_KEY)
const { shortcuts, disabledDate, cellClassName, defaultTime, arrowControl } = pickerBase.props
const defaultValue = toRef(pickerBase.props, 'defaultValue')

const currentViewRef = ref()

const innerDate = ref(dayjs().locale(lang))

const defaultTimeD = computed(() => dayjs(defaultTime).locale(lang))

const month = computed(() => innerDate.value.month())

const year = computed(() => innerDate.value.year())

const selectableRange = ref([])
const userInputDate = ref(null)
const userInputTime = ref(null)
// todo update to disableHour
/**
 * @param {import('dayjs').ConfigType} date
 */
const checkDateWithinRange = (date) =>
  selectableRange.value.length > 0 ? timeWithinRange(date, selectableRange.value, props.format || 'HH:mm:ss') : true
/**
 * @param {import('../props/date.type.js').TDayjs} emitDayjs
 */
const formatEmit = (emitDayjs) => {
  // eslint-disable-next-line no-use-before-define
  if (defaultTime && !visibleTime.value) {
    return defaultTimeD.value.year(emitDayjs.year()).month(emitDayjs.month()).date(emitDayjs.date())
  }

  // eslint-disable-next-line no-use-before-define
  if (showTime.value) {
    return emitDayjs.millisecond(0)
  }

  return emitDayjs.startOf('day')
}
/**
 * @param {import('../props/date.type.js').TDayjs | import('../props/date.type.js').TDayjs[]} value
 * @param  {...any} args
 */
const emit = (value, ...args) => {
  if (!value) {
    contextEmit('pick', value, ...args)
  } else if (isArray(value)) {
    const dates = value.map(formatEmit)

    contextEmit('pick', dates, ...args)
  } else {
    contextEmit('pick', formatEmit(value), ...args)
  }

  userInputDate.value = null
  userInputTime.value = null
}

/**
 * @param {boolean} [keepOpen]
 */
const handleDatePick = (value, keepOpen) => {
  // eslint-disable-next-line no-use-before-define
  switch (selectionMode.value) {
    case 'date': {
      // eslint-disable-next-line no-unused-expressions
      value
      let newDate = props.parsedValue
        ? // @ts-ignore
          props.parsedValue.year(value.year()).month(value.month()).date(value.date())
        : value

      // change default time while out of selectableRange
      if (!checkDateWithinRange(newDate)) {
        // @ts-ignore
        newDate = selectableRange.value[0][0].year(value.year()).month(value.month()).date(value.date())
      }

      innerDate.value = newDate
      // eslint-disable-next-line no-use-before-define
      emit(newDate, showTime.value || keepOpen)

      break
    }
    case 'week': {
      // @ts-ignore
      emit(value.date)

      break
    }
    case 'dates': {
      // @ts-ignore
      emit(value, true) // set true to keep panel open

      break
    }
    default:
    // No default
  }
}

/**
 * @param {boolean} forward
 */
const moveByMonth = (forward) => {
  const action = forward ? 'add' : 'subtract'

  innerDate.value = innerDate.value[action](1, 'month')
  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

/**
 * @param {boolean} forward
 */
const moveByYear = (forward) => {
  const currentDate = innerDate.value
  const action = forward ? 'add' : 'subtract'

  // eslint-disable-next-line no-use-before-define
  innerDate.value = currentView.value === 'year' ? currentDate[action](10, 'year') : currentDate[action](1, 'year')

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

const currentView = ref('date')

const yearLabel = computed(() => {
  const yearTranslation = locale.el.datepicker.year

  if (currentView.value === 'year') {
    const startYear = Math.floor(year.value / 10) * 10

    if (yearTranslation) {
      return `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`
    }

    return `${startYear} - ${startYear + 9}`
  }

  return `${year.value} ${yearTranslation}`
})

/**
 *
 * @param {import('../composables/useShortcut.js').Shortcut} shortcut
 */
const handleShortcutClick = (shortcut) => {
  const shortcutValue = isFunction(shortcut.value) ? shortcut.value() : shortcut.value

  if (shortcutValue) {
    // @ts-ignore
    emit(dayjs(shortcutValue).locale(lang))

    return
  }

  if (shortcut.onClick) {
    shortcut.onClick({
      attrs,
      slots,
      emit: contextEmit,
    })
  }
}

const selectionMode = computed(() => {
  const { type } = props

  if (['week', 'month', 'year', 'dates'].includes(type)) {
    return type
  }

  return 'date'
})

const keyboardMode = computed(() => (selectionMode.value === 'date' ? currentView.value : selectionMode.value))

const hasShortcuts = computed(() => shortcuts.length > 0)

/**
 * @param {number} _month
 */
const handleMonthPick = async (_month) => {
  innerDate.value = innerDate.value.startOf('month').month(_month)

  if (selectionMode.value === 'month') {
    emit(innerDate.value, false)
  } else {
    currentView.value = 'date'

    if (['month', 'year', 'date', 'week'].includes(selectionMode.value)) {
      emit(innerDate.value, true)
      await nextTick()
      // eslint-disable-next-line no-use-before-define
      handleFocusPicker()
    }
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('month')
}

/**
 * @param {number} _year
 */
const handleYearPick = async (_year) => {
  if (selectionMode.value === 'year') {
    innerDate.value = innerDate.value.startOf('year').year(_year)
    emit(innerDate.value, false)
  } else {
    innerDate.value = innerDate.value.year(_year)
    currentView.value = 'month'

    if (['month', 'year', 'date', 'week'].includes(selectionMode.value)) {
      emit(innerDate.value, true)
      await nextTick()
      // eslint-disable-next-line no-use-before-define
      handleFocusPicker()
    }
  }

  // eslint-disable-next-line no-use-before-define
  handlePanelChange('year')
}

/**
 * @param {'month' | 'year'} view
 */
const showPicker = async (view) => {
  currentView.value = view
  await nextTick()
  // eslint-disable-next-line no-use-before-define
  handleFocusPicker()
}

const showTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')

const footerVisible = computed(() => showTime.value || selectionMode.value === 'dates')

const onConfirm = () => {
  if (selectionMode.value === 'dates') {
    // @ts-ignore
    emit(props.parsedValue)
  } else {
    // TODO разберитесь со сценарием, в котором: пользователь открывает средство выбора даты и времени, затем подтверждает, ничего не делая
    let result = props.parsedValue

    if (!result) {
      // eslint-disable-next-line no-shadow
      const defaultTimeD = dayjs(defaultTime).locale(lang)
      // eslint-disable-next-line no-use-before-define
      const defaultValueD = getDefaultValue()

      result = defaultTimeD.year(defaultValueD.year()).month(defaultValueD.month()).date(defaultValueD.date())
    }

    // @ts-ignore
    innerDate.value = result
    // @ts-ignore
    emit(result)
  }
}

const changeToNow = () => {
  // TODO: не является постоянным решением
  // рассмотрите возможность отключения кнопки "сейчас" в будущем
  const now = dayjs().locale(lang)
  const nowDate = now.toDate()

  if ((!disabledDate || !disabledDate(nowDate)) && checkDateWithinRange(nowDate)) {
    innerDate.value = dayjs().locale(lang)
    emit(innerDate.value)
  }
}

const timeFormat = computed(() => extractTimeFormat(props.format))

const dateFormat = computed(() => extractDateFormat(props.format))

const visibleTime = computed(() => {
  if (userInputTime.value) {
    return userInputTime.value
  }

  if (!props.parsedValue && !defaultValue.value) {
    return
  }

  // @ts-ignore
  return (props.parsedValue || innerDate.value).format(timeFormat.value)
})

const visibleDate = computed(() => {
  if (userInputDate.value) {
    return userInputDate.value
  }

  if (!props.parsedValue && !defaultValue.value) {
    return
  }

  // @ts-ignore
  return (props.parsedValue || innerDate.value).format(dateFormat.value)
})

const timePickerVisible = ref(false)
const onTimePickerInputFocus = () => {
  timePickerVisible.value = true
}
const handleTimePickClose = () => {
  timePickerVisible.value = false
}

/**
 * @param {import('../props/date.type.js').TDayjs} date
 */
const getUnits = (date) => ({
  hour: date.hour(),
  minute: date.minute(),
  second: date.second(),
  year: date.year(),
  month: date.month(),
  date: date.date(),
})

/**
 * @param {import('../props/date.type.js').TDayjs} value
 * @param {boolean} visible
 * @param {boolean} first
 */
const handleTimePick = (value, visible, first) => {
  const { hour, minute, second } = getUnits(value)
  // @ts-ignore
  const newDate = props.parsedValue ? props.parsedValue.hour(hour).minute(minute).second(second) : value

  innerDate.value = newDate
  emit(innerDate.value, true)

  if (!first) {
    timePickerVisible.value = visible
  }
}

/**
 * @param {string} value
 */
const handleVisibleTimeChange = (value) => {
  const newDate = dayjs(value, timeFormat.value).locale(lang)

  if (newDate.isValid() && checkDateWithinRange(newDate)) {
    // eslint-disable-next-line no-shadow
    const { year, month, date } = getUnits(innerDate.value)

    innerDate.value = newDate.year(year).month(month).date(date)
    userInputTime.value = null
    timePickerVisible.value = false
    emit(innerDate.value, true)
  }
}

/**
 * @param {string} value
 */
const handleVisibleDateChange = (value) => {
  const newDate = dayjs(value, dateFormat.value).locale(lang)

  if (newDate.isValid()) {
    if (disabledDate && disabledDate(newDate.toDate())) {
      return
    }

    const { hour, minute, second } = getUnits(innerDate.value)

    innerDate.value = newDate.hour(hour).minute(minute).second(second)
    userInputDate.value = null
    emit(innerDate.value, true)
  }
}

// @ts-ignore
const isValidValue = (date) =>
  dayjs.isDayjs(date) && date.isValid() && (disabledDate ? !disabledDate(date.toDate()) : true)

/**
 * @param {import('../props/date.type.js').TDayjs| import('../props/date.type.js').TDayjs[]} value
 */
const formatToString = (value) => {
  if (selectionMode.value === 'dates') {
    // @ts-ignore
    return value.map((_) => _.format(props.format))
  }

  // @ts-ignore
  return value.format(props.format)
}

/**
 * @param {import('../props/date.type.js').TDayjs} value
 */
const parseUserInput = (value) => dayjs(value, props.format).locale(lang)

const getDefaultValue = () => {
  const parseDate = dayjs(defaultValue.value).locale(lang)

  if (!defaultValue.value) {
    const defaultTimeDValue = defaultTimeD.value

    return (
      dayjs()
        // .hour(defaultTimeDValue.hour())
        .minute(defaultTimeDValue.minute())
        .second(defaultTimeDValue.second())
        .locale(lang)
    )
  }

  return parseDate
}

const handleFocusPicker = async () => {
  if (['week', 'month', 'year', 'date'].includes(selectionMode.value)) {
    currentViewRef.value?.focus()

    if (selectionMode.value === 'week') {
      // eslint-disable-next-line no-use-before-define
      handleKeyControl(EVENT_CODE.down)
    }
  }
}

/**
 * @param {KeyboardEvent} event
 */
const handleKeydownTable = (event) => {
  const { code } = event
  const validCode = [
    EVENT_CODE.up,
    EVENT_CODE.down,
    EVENT_CODE.left,
    EVENT_CODE.right,
    EVENT_CODE.home,
    EVENT_CODE.end,
    EVENT_CODE.pageUp,
    EVENT_CODE.pageDown,
  ]

  if (validCode.includes(code)) {
    // eslint-disable-next-line no-use-before-define
    handleKeyControl(code)
    event.stopPropagation()
    event.preventDefault()
  }

  if (
    [EVENT_CODE.enter, EVENT_CODE.space].includes(code) &&
    userInputDate.value === null &&
    userInputTime.value === null
  ) {
    event.preventDefault()

    // TODO Нет возжности навигации с клавиатуры
    if (selectionMode.value !== 'dates') {
      emit(innerDate.value, false)
    }
  }
}

/**
 * @param {string} code
 */
const handleKeyControl = (code) => {
  const { up, down, left, right, home, end, pageUp, pageDown } = EVENT_CODE
  const mapping = {
    year: {
      [up]: -4,
      [down]: 4,
      [left]: -1,
      [right]: 1,
      offset: (date, step) => date.setFullYear(date.getFullYear() + step),
    },
    month: {
      [up]: -4,
      [down]: 4,
      [left]: -1,
      [right]: 1,
      offset: (date, step) => date.setMonth(date.getMonth() + step),
    },
    week: {
      [up]: -1,
      [down]: 1,
      [left]: -1,
      [right]: 1,
      offset: (date, step) => date.setDate(date.getDate() + step * 7),
    },
    date: {
      [up]: -7,
      [down]: 7,
      [left]: -1,
      [right]: 1,
      [home]: (date) => -date.getDay(),
      [end]: (date) => -date.getDay() + 6,
      [pageUp]: (date) => -new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
      [pageDown]: (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      offset: (date, step) => date.setDate(date.getDate() + step),
    },
  }

  const newDate = innerDate.value.toDate()

  // eslint-disable-next-line no-unreachable-loop
  while (Math.abs(innerDate.value.diff(newDate, 'year', true)) < 1) {
    const map = mapping[keyboardMode.value]

    if (!map) {
      return
    }

    map.offset(newDate, isFunction(map[code]) ? map[code](newDate) : map[code] ?? 0)

    if (disabledDate && disabledDate(newDate)) {
      break
    }

    const result = dayjs(newDate).locale(lang)

    innerDate.value = result
    contextEmit('pick', result, true)
    break
  }
}

/**
 * @param {'month' | 'year'} mode
 */
const handlePanelChange = (mode) => {
  contextEmit('panel-change', innerDate.value.toDate(), mode, currentView.value)
}

watch(
  () => selectionMode.value,
  (val) => {
    if (['month', 'year'].includes(val)) {
      currentView.value = val

      return
    }

    currentView.value = 'date'
  },
  { immediate: true },
)

watch(
  () => currentView.value,
  () => {
    popper?.updatePopper()
  },
)

watch(
  () => defaultValue.value,
  (val) => {
    if (val) {
      innerDate.value = getDefaultValue()
    }
  },
  { immediate: true },
)

watch(
  () => props.parsedValue,
  (val) => {
    if (val) {
      if (selectionMode.value === 'dates') {
        return
      }

      if (Array.isArray(val)) {
        return
      }

      // @ts-ignore
      innerDate.value = val
    } else {
      innerDate.value = getDefaultValue()
    }
  },
  { immediate: true },
)

contextEmit('set-picker-option', ['isValidValue', isValidValue])
contextEmit('set-picker-option', ['formatToString', formatToString])
contextEmit('set-picker-option', ['parseUserInput', parseUserInput])
contextEmit('set-picker-option', ['handleFocusPicker', handleFocusPicker])
</script>

<template>
  <div :class="[dpNs.b(), dpNs.has('sidebar', Boolean($slots.sidebar) || hasShortcuts), dpNs.has('time', showTime)]">
    <div :class="dpNs.e('body-wrapper')">
      <slot name="sidebar" :class="dpNs.e('sidebar')" />
      <div v-if="hasShortcuts" :class="dpNs.e('sidebar')">
        <button
          v-for="(shortcut, key) in shortcuts"
          :key="key"
          type="button"
          :class="dpNs.e('shortcut')"
          @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div :class="dpNs.e('body')">
        <div v-if="showTime" :class="dpNs.e('time-header')">
          <span :class="dpNs.e('editor-wrap')">
            <NInput
              :placeholder="locale.el.datepicker.selectDate"
              :model-value="visibleDate"
              size="small"
              :validate-event="false"
              @input="(val) => (userInputDate = val)"
              @change="handleVisibleDateChange"
            />
          </span>
          <span v-click-outside="handleTimePickClose" :class="dpNs.e('editor-wrap')">
            <NInput
              :placeholder="locale.el.datepicker.selectTime"
              :model-value="visibleTime"
              size="small"
              :validate-event="false"
              @focus="onTimePickerInputFocus"
              @input="(val) => (userInputTime = val)"
              @change="handleVisibleTimeChange"
            />
            <TimePickPanel
              :visible="timePickerVisible"
              :format="timeFormat"
              :time-arrow-control="arrowControl"
              :parsed-value="innerDate"
              @pick="handleTimePick"
            />
          </span>
        </div>
        <div
          v-show="currentView !== 'time'"
          :class="[dpNs.e('header'), (currentView === 'year' || currentView === 'month') && dpNs.e('header--bordered')]"
        >
          <span :class="[dpNs.e('header-date')]">
            <span
              v-show="currentView === 'date'"
              role="button"
              aria-live="polite"
              tabindex="0"
              :class="[dpNs.e('header-label'), dpNs.eIs('header-label', 'active', currentView === 'month')]"
              @keydown.enter="showPicker('month')"
              @click="showPicker('month')"
            >
              {{ locale.el.datepicker['month' + (month + 1)] }}
            </span>
            <span
              role="button"
              :class="dpNs.e('header-label')"
              aria-live="polite"
              tabindex="0"
              @keydown.enter="showPicker('year')"
              @click="showPicker('year')"
            >
              {{ yearLabel }}
            </span>
          </span>

          <span :class="[dpNs.e('header-buttons')]">
            <span :class="dpNs.e('prev-btn')">
              <button
                type="button"
                :aria-label="locale.el.datepicker.prevYear"
                class="d-arrow-left"
                :class="dpNs.e('icon-btn')"
                @click="moveByYear(false)"
              >
                <span class="n-icon"><NIconChevronDoubleLeft /></span>
              </button>
              <button
                v-show="currentView === 'date'"
                type="button"
                :aria-label="locale.el.datepicker.prevMonth"
                :class="dpNs.e('icon-btn')"
                class="arrow-left"
                @click="moveByMonth(false)"
              >
                <span class="n-icon"><NIconChevronLeft /></span>
              </button>
            </span>
            <span :class="dpNs.e('next-btn')">
              <button
                v-show="currentView === 'date'"
                type="button"
                :aria-label="locale.el.datepicker.nextMonth"
                :class="dpNs.e('icon-btn')"
                class="arrow-right"
                @click="moveByMonth(true)"
              >
                <span class="n-icon"><NIconChevronRight /></span>
              </button>
              <button
                type="button"
                :aria-label="locale.el.datepicker.nextYear"
                :class="dpNs.e('icon-btn')"
                class="d-arrow-right"
                @click="moveByYear(true)"
              >
                <span class="n-icon"><NIconChevronDoubleRight /></span>
              </button>
            </span>
          </span>
        </div>
        <div :class="dpNs.e('content')" @keydown="handleKeydownTable">
          <NDatePickerTable
            v-if="currentView === 'date'"
            ref="currentViewRef"
            :selection-mode="selectionMode"
            :date="innerDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            @pick="handleDatePick"
          />
          <NBasicYearTable
            v-if="currentView === 'year'"
            ref="currentViewRef"
            :date="innerDate"
            :disabled-date="disabledDate"
            :parsed-value="parsedValue"
            @pick="handleYearPick"
          />
          <NBasicMonthTable
            v-if="currentView === 'month'"
            ref="currentViewRef"
            :date="innerDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            @pick="handleMonthPick"
          />
        </div>
      </div>
    </div>
    <div v-show="footerVisible && currentView === 'date'" :class="dpNs.e('footer')">
      <NButton v-show="selectionMode !== 'dates'" text size="small" :class="dpNs.e('link-btn')" @click="changeToNow">
        {{ locale.el.datepicker.now }}
      </NButton>
      <NButton plain size="small" :class="dpNs.e('link-btn')" @click="onConfirm">
        {{ locale.el.datepicker.confirm }}
      </NButton>
    </div>
  </div>
</template>
