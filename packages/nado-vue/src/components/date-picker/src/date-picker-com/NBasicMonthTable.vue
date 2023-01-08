<script setup>
import dayjs from 'dayjs'
import { computed, nextTick, ref, watch } from 'vue'

import { useLocale, useNamespace } from '../../../../hooks/index.js'
import { ensureArray, hasClass } from '../../../../utils/index.js'
import { rangeArr } from '../../../date-time-picker/index.js'
import { basicMonthTableProps } from '../props/basic-month-table.js'

const props = defineProps(basicMonthTableProps)

const emit = defineEmits(['change-range', 'pick', 'select'])

/**
 * @param {number} year
 * @param {number} month
 * @param {string} lang
 */
const datesInMonth = (year, month, lang) => {
  const firstDay = dayjs().locale(lang).startOf('month').month(month).year(year)
  const numOfDays = firstDay.daysInMonth()

  return rangeArr(numOfDays).map((n) => firstDay.add(n, 'day').toDate())
}

const ns = useNamespace('month-table')
const cellNs = useNamespace('month-table-cell')

const { locale, lang } = useLocale()
const tbodyRef = ref()
const currentCellRef = ref()
const months = ref(
  props.date
    .locale('en')
    .localeData()
    .monthsShort()
    .map((_) => _.toLowerCase()),
)
const tableRows = ref([[], [], []])
const lastRow = ref()
const lastColumn = ref()
const rows = computed(() => {
  const rowsRes = tableRows.value

  const now = dayjs().locale(lang).startOf('month')

  for (let i = 0; i < 3; i++) {
    const row = rowsRes[i]

    for (let j = 0; j < 4; j++) {
      // eslint-disable-next-line no-multi-assign
      const cell = (row[j] ||= {
        row: i,
        column: j,
        type: 'normal',
        inRange: false,
        start: false,
        end: false,
        text: -1,
        disabled: false,
      })

      cell.type = 'normal'

      const index = i * 4 + j
      const calTime = props.date.startOf('year').month(index)

      const calEndDate =
        props.rangeState.endDate || props.maxDate || (props.rangeState.selecting && props.minDate) || null

      cell.inRange =
        !!(
          props.minDate &&
          calTime.isSameOrAfter(props.minDate, 'month') &&
          calEndDate &&
          calTime.isSameOrBefore(calEndDate, 'month')
        ) ||
        !!(
          props.minDate &&
          calTime.isSameOrBefore(props.minDate, 'month') &&
          calEndDate &&
          calTime.isSameOrAfter(calEndDate, 'month')
        )

      if (props.minDate?.isSameOrAfter(calEndDate)) {
        cell.start = !!(calEndDate && calTime.isSame(calEndDate, 'month'))
        cell.end = props.minDate && calTime.isSame(props.minDate, 'month')
      } else {
        cell.start = !!(props.minDate && calTime.isSame(props.minDate, 'month'))
        cell.end = !!(calEndDate && calTime.isSame(calEndDate, 'month'))
      }

      const isToday = now.isSame(calTime)

      if (isToday) {
        cell.type = 'today'
      }

      cell.text = index
      cell.disabled = props.disabledDate?.(calTime.toDate()) || false
    }
  }

  return rowsRes
})

const focus = () => {
  currentCellRef.value?.focus()
}

const getCellStyle = (cell, className) => {
  const style = {}
  const year = props.date.year()
  const today = new Date()
  const month = cell.text

  // @ts-ignore
  style[`${className}--is-disabled`] = props.disabledDate
    ? datesInMonth(year, month, lang).every((el) => props.disabledDate(el))
    : false
  style[`${className}--is-current`] =
    ensureArray(props.parsedValue).findIndex(
      (date) => dayjs.isDayjs(date) && date.year() === year && date.month() === month,
    ) >= 0
  style[`${className}--is-today`] = today.getFullYear() === year && today.getMonth() === month

  if (cell.inRange) {
    style[`${className}--in-range`] = true

    if (cell.start) {
      style[`${className}--is-start-date`] = true
    }

    if (cell.end) {
      style[`${className}--is-end-date`] = true
    }
  }

  return style
}

const isSelectedCell = (cell) => {
  const year = props.date.year()
  const month = cell.text

  // @ts-ignore
  return ensureArray(props.date).findIndex((date) => date.year() === year && date.month() === month) >= 0
}

/**
 * @param {MouseEvent} event
 */
const handleMouseMove = (event) => {
  if (!props.rangeState.selecting) {
    return
  }

  /** @type {HTMLElement} */
  // @ts-ignore
  let { target } = event

  if (target.tagName === 'A') {
    target = target.parentNode?.parentNode
  }

  if (target.tagName === 'DIV') {
    target = target.parentNode
  }

  if (target.tagName !== 'TD') {
    return
  }

  const row = target.parentNode.rowIndex
  const column = target.cellIndex

  // не удается выбрать отключенную дату
  if (rows.value[row][column].disabled) {
    return
  }

  // обновлять rangeState можно только при перемещении мыши в новую ячейку
  // это позволяет избежать частого создания объекта даты и повышает производительность
  if (row !== lastRow.value || column !== lastColumn.value) {
    lastRow.value = row
    lastColumn.value = column

    emit('change-range', {
      selecting: true,
      endDate: props.date.startOf('year').month(row * 4 + column),
    })
  }
}

/**
 * @param {MouseEvent | KeyboardEvent} event
 */
const handleMonthTableClick = (event) => {
  // @ts-ignore
  const target = event.target?.closest('td')

  if (target?.tagName !== 'TD') {
    return
  }

  if (hasClass(target, 'disabled')) {
    return
  }

  const column = target.cellIndex
  const row = target.parentNode.rowIndex
  const month = row * 4 + column
  const newDate = props.date.startOf('year').month(month)

  if (props.selectionMode === 'range') {
    if (!props.rangeState.selecting) {
      emit('pick', { minDate: newDate, maxDate: null })
      emit('select', true)
    } else {
      if (props.minDate && newDate >= props.minDate) {
        emit('pick', { minDate: props.minDate, maxDate: newDate })
      } else {
        emit('pick', { minDate: newDate, maxDate: props.minDate })
      }

      emit('select', false)
    }
  } else {
    emit('pick', month)
  }
}

watch(
  () => props.date,
  async () => {
    if (tbodyRef.value?.contains(document.activeElement)) {
      await nextTick()
      currentCellRef.value?.focus()
    }
  },
)

defineExpose({
  /**
   * @description focus current cell
   */
  focus,
})
</script>

<template>
  <table
    role="grid"
    :aria-label="locale.el.datepicker.monthTablePrompt"
    :class="ns.b()"
    @click="handleMonthTableClick"
    @mousemove="handleMouseMove"
  >
    <tbody ref="tbodyRef" :class="ns.e('body')">
      <tr v-for="(row, key) in rows" :key="key" :class="ns.e('row')">
        <td
          v-for="(cell, key_) in row"
          :key="key_"
          :ref="(el) => isSelectedCell(cell) && (currentCellRef = el)"
          :class="[getCellStyle(cell, ns.e('cell')), ns.e('cell')]"
          :aria-selected="`${isSelectedCell(cell)}`"
          :aria-label="locale.el.datepicker['month' + (Number(cell.text) + 1)]"
          :tabindex="isSelectedCell(cell) ? 0 : -1"
          @keydown.space.prevent.stop="handleMonthTableClick"
          @keydown.enter.prevent.stop="handleMonthTableClick"
        >
          <div :class="[getCellStyle(cell, cellNs.b()), cellNs.b()]">
            <span :class="[cellNs.e('text')]">
              {{ locale.el.datepicker.months[months[cell.text]] }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
