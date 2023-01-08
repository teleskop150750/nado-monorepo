<script setup>
import dayjs from 'dayjs'
import { flatten } from 'lodash-unified'
import { computed, nextTick, ref, unref, watch } from 'vue'

import { useLocale, useNamespace } from '../../../../hooks/index.js'
import { ensureArray } from '../../../../utils/arrays.js'
import { basicDateTableProps } from '../props/basic-date-table.js'
import { buildPickerTable } from '../utils.js'
import NDatePickerCell from './NDatePickerTableCell.jsx'

const props = defineProps(basicDateTableProps)
const emit = defineEmits(['change-range', 'pick', 'select'])

const ns = useNamespace('date-table')

const { locale, lang } = useLocale()

const tbodyRef = ref()
const currentCellRef = ref()
// data
const lastRow = ref()
const lastColumn = ref()
const tableRows = ref([[], [], [], [], [], []])

let focusWithClick = false

// todo лучший способ получить Day.js объект локали
const firstDayOfWeek = props.date.$locale().weekStart || 1
const WEEKS_CONSTANT = props.date
  .locale('en')
  .localeData()
  .weekdaysShort()
  .map((_) => _.toLowerCase())

const offsetDay = computed(() =>
  // Воскресенье 7(0), выберите дни смещения влево и вправо, 3217654,
  // например, понедельник равен -1, это для корректировки положения первых двух строк дат
  firstDayOfWeek > 3 ? 7 - firstDayOfWeek : -firstDayOfWeek,
)

const startDate = computed(() => {
  const startDayOfMonth = props.date.startOf('month')

  return startDayOfMonth.subtract(startDayOfMonth.day() || 7, 'day')
})

// eslint-disable-next-line unicorn/prefer-spread
const WEEKS = computed(() => WEEKS_CONSTANT.concat(WEEKS_CONSTANT).slice(firstDayOfWeek, firstDayOfWeek + 7))

// eslint-disable-next-line no-use-before-define
const hasCurrent = computed(() => flatten(rows.value).some((row) => row.isCurrent))

const days = computed(() => {
  const startOfMonth = props.date.startOf('month')
  const startOfMonthDay = startOfMonth.day() || 7 // день первого дня
  const dateCountOfMonth = startOfMonth.daysInMonth()

  const dateCountOfLastMonth = startOfMonth.subtract(1, 'month').daysInMonth()

  return {
    startOfMonthDay,
    dateCountOfMonth,
    dateCountOfLastMonth,
  }
})

const selectedDate = computed(() => (props.selectionMode === 'dates' ? ensureArray(props.parsedValue) : []))

// Возвращаемое значение указывает, следует ли увеличивать счетчик
/**
 *
 * @param {*} cell
 * @param {{
 *  count: number
 *  rowIndex: number
 *  columnIndex: number
 * }} param1
 */
const setDateText = (cell, { count, rowIndex, columnIndex }) => {
  const { startOfMonthDay, dateCountOfMonth, dateCountOfLastMonth } = unref(days)
  const offset = unref(offsetDay)

  if (rowIndex >= 0 && rowIndex <= 1) {
    const numberOfDaysFromPreviousMonth =
      startOfMonthDay + offset < 0 ? 7 + startOfMonthDay + offset : startOfMonthDay + offset

    if (columnIndex + rowIndex * 7 >= numberOfDaysFromPreviousMonth) {
      cell.text = count

      return true
    }

    cell.text = dateCountOfLastMonth - (numberOfDaysFromPreviousMonth - (columnIndex % 7)) + 1 + rowIndex * 7
    cell.type = 'prev-month'
  } else {
    if (count <= dateCountOfMonth) {
      cell.text = count
    } else {
      cell.text = count - dateCountOfMonth
      cell.type = 'next-month'
    }

    return true
  }

  return false
}

/**
 *
 * @param {import('../date-picker.type.js').DateCell} cell
 * @param {{
 *   columnIndex: number
 *   rowIndex: number
 * }} param1
 * @param {number} count
 */
const setCellMetadata = (cell, { columnIndex, rowIndex }, count) => {
  const { disabledDate, cellClassName } = props
  const _selectedDate = unref(selectedDate)
  const shouldIncrement = setDateText(cell, { count, rowIndex, columnIndex })

  const cellDate = cell.dayjs.toDate()

  // TODO
  cell.selected = _selectedDate.find((d) => d.valueOf() === cell.dayjs.valueOf())
  cell.isSelected = !!cell.selected
  // eslint-disable-next-line no-use-before-define
  cell.isCurrent = isCurrent(cell)
  cell.disabled = disabledDate?.(cellDate)
  cell.customClass = cellClassName?.(cellDate)

  return shouldIncrement
}

/**
 * @param {import('../date-picker.type.js').DateCell[]} row
 */
const setRowMetadata = (row) => {
  if (props.selectionMode === 'week') {
    const [start, end] = props.showWeekNumber ? [1, 7] : [0, 6]
    // eslint-disable-next-line no-use-before-define
    const isActive = isWeekActive(row[start + 1])

    row[start].inRange = isActive
    row[start].start = isActive
    row[end].inRange = isActive
    row[end].end = isActive
  }
}

const rows = computed(() => {
  const { minDate, maxDate, rangeState, showWeekNumber } = props

  const offset = offsetDay.value
  const rows_ = tableRows.value
  const dateUnit = 'day'
  let count = 1

  if (showWeekNumber) {
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      rows_[rowIndex][0] = {
        type: 'week',
        text: startDate.value.add(rowIndex * 7 + 1, dateUnit).week(),
      }
    }
  }

  buildPickerTable({ row: 6, column: 7 }, rows_, {
    // @ts-ignore
    startDate: minDate,
    columnIndexOffset: showWeekNumber ? 1 : 0,
    nextEndDate: rangeState.endDate || maxDate || (rangeState.selecting && minDate) || null,
    now: dayjs().locale(unref(lang)).startOf(dateUnit),
    unit: dateUnit,
    relativeDateGetter: (idx) => startDate.value.add(idx - offset, dateUnit),
    setCellMetadata: (...args) => {
      if (setCellMetadata(...args, count)) {
        count += 1
      }
    },

    setRowMetadata,
  })

  return rows_
})

watch(
  () => props.date,
  async () => {
    if (tbodyRef.value?.contains(document.activeElement)) {
      await nextTick()
      currentCellRef.value?.focus()
    }
  },
)

const focus = async () => {
  currentCellRef.value?.focus()
}

const isNormalDay = (type = '') => ['normal', 'today'].includes(type)

/**
 * @param {import('../date-picker.type.js').DateCell} cell
 */
const isCurrent = (cell) =>
  // @ts-ignore
  // eslint-disable-next-line no-use-before-define
  props.selectionMode === 'date' && isNormalDay(cell.type) && cellMatchesDate(cell, props.parsedValue)

/**
 *
 * @param {import('../date-picker.type.js').DateCell} cell
 * @param {import('../props/date.type.js').TDayjs} date
 */
const cellMatchesDate = (cell, date) => {
  if (!date) {
    return false
  }

  return dayjs(date)
    .locale(lang)
    .isSame(props.date.date(Number(cell.text)), 'day')
}

/**
 * @param {import('../date-picker.type.js').DateCell} cell
 * @param {string} className
 */
const getCellClasses = (cell, className, columnKey) => {
  const classes = []

  classes.push(`${className}--number-${columnKey}`)

  if (isNormalDay(cell.type) && !cell.disabled) {
    classes.push(`${className}--is-available`)

    if (cell.type === 'today') {
      classes.push(`${className}--is-today`)
    }
  } else {
    classes.push(`${className}--type-${cell.type}`)
  }

  if (isCurrent(cell)) {
    classes.push(`${className}--is-current`)
  }

  if (cell.inRange && (isNormalDay(cell.type) || props.selectionMode === 'week')) {
    classes.push(`${className}--in-range`)

    if (cell.start) {
      classes.push(`${className}--is-start-date`)
    }

    if (cell.end) {
      classes.push(`${className}--is-end-date`)
    }
  }

  if (cell.disabled) {
    classes.push(`${className}--is-disabled`)
  }

  if (cell.selected) {
    classes.push(`${className}--is-selected`)
  }

  if (cell.customClass) {
    classes.push(cell.customClass)
  }

  return classes.join(' ')
}

/**
 * @param {number} row
 * @param {number} column
 */
const getDateOfCell = (row, column) => {
  const offsetFromStart = row * 7 + (column - (props.showWeekNumber ? 1 : 0)) - offsetDay.value

  return startDate.value.add(offsetFromStart, 'day')
}

/**
 * @param {MouseEvent} event
 */
const handleMouseMove = (event) => {
  if (!props.rangeState.selecting) {
    return
  }

  let { target } = event

  // @ts-ignore
  if (target.tagName === 'SPAN') {
    // @ts-ignore
    target = target.parentNode?.parentNode
  }

  // @ts-ignore
  if (target.tagName === 'DIV') {
    // @ts-ignore
    target = target.parentNode
  }

  // @ts-ignore
  if (target.tagName !== 'TD') {
    return
  }

  // @ts-ignore
  const row = target.parentNode.rowIndex - 1
  // @ts-ignore
  const column = target.cellIndex

  // can not select disabled date
  if (rows.value[row][column].disabled) {
    return
  }

  // only update rangeState when mouse moves to a new cell
  // this avoids frequent Date object creation and improves performance
  if (row !== lastRow.value || column !== lastColumn.value) {
    lastRow.value = row
    lastColumn.value = column
    emit('change-range', {
      selecting: true,
      endDate: getDateOfCell(row, column),
    })
  }
}

/**
 * @param {import('../date-picker.type.js').DateCell} cell
 */
const isSelectedCell = (cell) => (!hasCurrent.value && cell?.text === 1 && cell.type === 'normal') || cell.isCurrent

// @ts-ignore
/**
 * @param {FocusEvent} event
 */
const handleFocus = (event) => {
  if (focusWithClick || hasCurrent.value || props.selectionMode !== 'date') {
    return
  }

  // eslint-disable-next-line no-use-before-define
  handlePickDate(event, true)
}

// @ts-ignore
/**
 *
 * @param {MouseEvent} event
 */
const handleMouseDown = (event) => {
  // @ts-ignore
  const target = event.target.closest('td')

  if (!target) {
    return
  }

  focusWithClick = true
}

// @ts-ignore
/**
 *
 * @param {MouseEvent} event
 */
const handleMouseUp = (event) => {
  // @ts-ignore
  const target = event.target.closest('td')

  if (!target) {
    return
  }

  focusWithClick = false
}

/**
 *
 * @param {FocusEvent | MouseEvent} event
 * @param {boolean} isKeyboardMovement
 */
const handlePickDate = (event, isKeyboardMovement = false) => {
  // @ts-ignore
  const target = event.target.closest('td')

  if (!target) {
    return
  }

  // @ts-ignore
  const row = target.parentNode.rowIndex - 1
  // @ts-ignore
  const column = target.cellIndex
  const cell = rows.value[row][column]

  if (cell.disabled || cell.type === 'week') {
    return
  }

  const newDate = getDateOfCell(row, column)

  switch (props.selectionMode) {
    case 'range': {
      if (!props.rangeState.selecting || !props.minDate) {
        emit('pick', { minDate: newDate, maxDate: null })
        emit('select', true)
      } else {
        if (newDate >= props.minDate) {
          emit('pick', { minDate: props.minDate, maxDate: newDate })
        } else {
          emit('pick', { minDate: newDate, maxDate: props.minDate })
        }

        emit('select', false)
      }

      break
    }
    case 'date': {
      emit('pick', newDate, isKeyboardMovement)

      break
    }
    case 'week': {
      const weekNumber = newDate.week()
      const value = `${newDate.year()}w${weekNumber}`

      emit('pick', {
        year: newDate.year(),
        week: weekNumber,
        value,
        date: newDate.startOf('week'),
      })

      break
    }
    case 'dates': {
      const newValue = cell.selected
        ? ensureArray(props.parsedValue).filter((d) => d?.valueOf() !== newDate.valueOf())
        : [...ensureArray(props.parsedValue), newDate]

      emit('pick', newValue)

      break
    }
    default:
    // No default
  }
}

/**
 * @param {import('../date-picker.type.js').DateCell} cell
 */
const isWeekActive = (cell) => {
  if (props.selectionMode !== 'week') {
    return false
  }

  let newDate = props.date.startOf('day')

  if (cell.type === 'prev-month') {
    newDate = newDate.subtract(1, 'month')
  }

  if (cell.type === 'next-month') {
    newDate = newDate.add(1, 'month')
  }

  // @ts-ignore
  newDate = newDate.date(Number.parseInt(cell.text))

  if (props.parsedValue && !Array.isArray(props.parsedValue)) {
    const dayOffset = ((props.parsedValue.day() - firstDayOfWeek + 7) % 7) - 1
    const weekDate = props.parsedValue.subtract(dayOffset, 'day')

    return weekDate.isSame(newDate, 'day')
  }

  return false
}

defineExpose({
  /**
   * @description focus on current cell
   */
  focus,
})
</script>

<template>
  <table
    role="grid"
    :aria-label="locale.el.datepicker.dateTablePrompt"
    cellspacing="0"
    cellpadding="0"
    :class="[ns.b(), ns.is('week-mode', selectionMode === 'week')]"
    @click="handlePickDate"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <tbody ref="tbodyRef" :class="ns.e('body')">
      <tr :class="ns.e('row')">
        <th v-if="showWeekNumber" :class="ns.e('title')" scope="col">№</th>
        <th
          v-for="(week, key) in WEEKS"
          :key="key"
          :class="ns.e('title')"
          scope="col"
          :aria-label="locale.el.datepicker.weeksFull[week]"
        >
          {{ locale.el.datepicker.weeks[week] }}
        </th>
      </tr>
      <tr
        v-for="(row, rowKey) in rows"
        :key="rowKey"
        :class="[ns.e('row'), ns.eIs('row', 'current', isWeekActive(row[1]))]"
      >
        <td
          v-for="(cell, columnKey) in row"
          :key="`${rowKey}.${columnKey}`"
          :ref="(el) => isSelectedCell(cell) && (currentCellRef = el)"
          :class="[getCellClasses(cell, ns.e('cell')), ns.e('cell')]"
          :aria-current="cell.isCurrent ? 'date' : undefined"
          :aria-selected="cell.isCurrent"
          :tabindex="isSelectedCell(cell) ? 0 : -1"
          @focus="handleFocus"
        >
          <NDatePickerCell
            :class="[
              getCellClasses(cell, `${ns.namespace}-date-table-cell`, showWeekNumber ? columnKey : columnKey + 1),
            ]"
            :cell="cell"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
