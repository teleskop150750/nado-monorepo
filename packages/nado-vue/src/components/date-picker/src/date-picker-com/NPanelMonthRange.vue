<script setup>
import dayjs from 'dayjs'
import { computed, inject, ref, toRef } from 'vue'

import { useLocale } from '../../../../hooks/index.js'
import { NIconArrowLeft, NIconChevronRight } from '../../../../icons/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../../tokens/index.js'
import { useMonthRangeHeader } from '../composables/useMonthRangeHeader.js'
import { useRangePicker } from '../composables/useRangePicker.js'
import { panelMonthRangeEmits, panelMonthRangeProps } from '../props/panel-month-range.js'
import MonthTable from './NBasicMonthTable.vue'

const props = defineProps(panelMonthRangeProps)

const emit = defineEmits(panelMonthRangeEmits)

defineOptions({
  name: 'DatePickerMonthRange',
})

const unit = 'year'

const { lang } = useLocale()
const pickerBase = inject(PICKER_BASE_INJECTION_KEY)
const { shortcuts, disabledDate, format } = pickerBase.props
const defaultValue = toRef(pickerBase.props, 'defaultValue')
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
} = useRangePicker(props, {
  defaultValue,
  leftDate,
  rightDate,
  unit,
  onParsedValueChanged,
})

const hasShortcuts = computed(() => shortcuts.length > 0)

const { leftPrevYear, rightNextYear, leftNextYear, rightPrevYear, leftLabel, rightLabel, leftYear, rightYear } =
  useMonthRangeHeader({
    unlinkPanels: toRef(props, 'unlinkPanels'),
    leftDate,
    rightDate,
  })

const enableYearArrow = computed(() => props.unlinkPanels && rightYear.value > leftYear.value + 1)

const handleRangePick = (val, close = true) => {
  // const defaultTime = props.defaultTime || []
  // const minDate_ = modifyWithTimeString(val.minDate, defaultTime[0])
  // const maxDate_ = modifyWithTimeString(val.maxDate, defaultTime[1])
  // TODO
  const minDate_ = val.minDate
  const maxDate_ = val.maxDate

  if (maxDate.value === maxDate_ && minDate.value === minDate_) {
    return
  }

  maxDate.value = maxDate_
  minDate.value = minDate_

  if (!close) {
    return
  }

  handleRangeConfirm()
}

/**
 * @param {import('../props/date.type.js').TDayjs[]} days
 */
const formatToString = (days) => days.map((day) => day.format(format))

/**
 * @param {import('../props/date.type.js').TDayjs | undefined} _minDate
 * @param {import('../props/date.type.js').TDayjs | undefined} _maxDate
 */
function onParsedValueChanged(_minDate, _maxDate) {
  if (props.unlinkPanels && _maxDate) {
    const minDateYear = _minDate?.year() || 0
    const maxDateYear = _maxDate.year()

    rightDate.value = minDateYear === maxDateYear ? _maxDate.add(1, unit) : _maxDate
  } else {
    rightDate.value = leftDate.value.add(1, unit)
  }
}

emit('set-picker-option', ['formatToString', formatToString])
</script>

<template>
  <div :class="[drpNs.b(), drpNs.has('sidebar', Boolean($slots.sidebar) || hasShortcuts)]">
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
        <div :class="[drpNs.e('content')]" class="is-left">
          <div :class="drpNs.e('header')">
            <button type="button" :class="drpNs.e('icon-btn')" class="d-arrow-left" @click="leftPrevYear">
              <span class="n-icon"><NIconArrowLeft /></span>
            </button>
            <button
              v-if="unlinkPanels"
              type="button"
              :disabled="!enableYearArrow"
              :class="[drpNs.e('arrow-right'), drpNs.e('icon-btn'), drpNs.eIs('icon-', 'disabled', !enableYearArrow)]"
              @click="leftNextYear"
            >
              <span class="n-icon"><NIconChevronRight /></span>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <MonthTable
            selection-mode="range"
            :date="leftDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @change-range="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
        <div :class="[drpNs.e('content')]" class="is-right">
          <div :class="drpNs.e('header')">
            <button
              v-if="unlinkPanels"
              type="button"
              :disabled="!enableYearArrow"
              :class="[drpNs.e('arrow-left'), drpNs.e('icon-btn'), drpNs.eIs('icon', 'disabled', !enableYearArrow)]"
              @click="rightPrevYear"
            >
              <span class="n-icon"><NIconArrowLeft /></span>
            </button>
            <button type="button" :class="[drpNs.e('arrow-right'), drpNs.e('icon-btn')]" @click="rightNextYear">
              <span class="n-icon"><NIconChevronRight /></span>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
          <MonthTable
            selection-mode="range"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @change-range="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>
