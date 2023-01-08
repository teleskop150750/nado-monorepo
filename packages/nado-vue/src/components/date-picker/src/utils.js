import dayjs from 'dayjs'

import { isArray } from '../../../utils/index.js'
/**
 * @param {import('./utils.js').DayRange} range
 */
export const isValidRange = (range) => {
  if (!isArray(range)) {
    return false
  }

  const [left, right] = range

  return dayjs.isDayjs(left) && dayjs.isDayjs(right) && left.isSameOrBefore(right)
}

/**
 * @param {import('./utils.js').DefaultValue} defaultValue
 * @param {import('./utils.js').GetDefaultValueParams} getDefaultValueParams
 * @returns
 */

export const getDefaultValue = (defaultValue, { lang, unit, unlinkPanels }) => {
  let start

  if (isArray(defaultValue)) {
    // eslint-disable-next-line prefer-const
    let [left, right] = defaultValue.map((d) => dayjs(d).locale(lang))

    if (!unlinkPanels) {
      right = left.add(1, unit)
    }

    return [left, right]
  }

  start = defaultValue ? dayjs(defaultValue) : dayjs()
  start = start.locale(lang)

  return [start, start.add(1, unit)]
}
/**
 *
 * @param {import('./utils.js').Dimension} dimension
 * @param {import('./date-picker.type.js').DateCell[][]} rows
 * @param {import('./utils.js').BuildPickerTableMetadata} buildPickerTableMetadata
 */
export const buildPickerTable = (
  dimension,
  rows,
  { columnIndexOffset, startDate, nextEndDate, now, unit, relativeDateGetter, setCellMetadata, setRowMetadata },
) => {
  for (let rowIndex = 0; rowIndex < dimension.row; rowIndex++) {
    const row = rows[rowIndex]

    for (let columnIndex = 0; columnIndex < dimension.column; columnIndex++) {
      let cell = row[columnIndex + columnIndexOffset]

      if (!cell) {
        cell = {
          row: rowIndex,
          column: columnIndex,
          type: 'normal',
          inRange: false,
          start: false,
          end: false,
        }
      }

      const index = rowIndex * dimension.column + columnIndex
      const nextStartDate = relativeDateGetter(index)

      cell.dayjs = nextStartDate
      cell.date = nextStartDate.toDate()
      cell.timestamp = nextStartDate.valueOf()
      cell.type = 'normal'

      cell.inRange =
        !!(
          startDate &&
          nextStartDate.isSameOrAfter(startDate, unit) &&
          nextEndDate &&
          nextStartDate.isSameOrBefore(nextEndDate, unit)
        ) ||
        !!(
          startDate &&
          nextStartDate.isSameOrBefore(startDate, unit) &&
          nextEndDate &&
          nextStartDate.isSameOrAfter(nextEndDate, unit)
        )

      if (startDate?.isSameOrAfter(nextEndDate)) {
        cell.start = !!nextEndDate && nextStartDate.isSame(nextEndDate, unit)
        cell.end = startDate && nextStartDate.isSame(startDate, unit)
      } else {
        cell.start = !!startDate && nextStartDate.isSame(startDate, unit)
        cell.end = !!nextEndDate && nextStartDate.isSame(nextEndDate, unit)
      }

      const isToday = nextStartDate.isSame(now, unit)

      if (isToday) {
        cell.type = 'today'
      }

      setCellMetadata?.(cell, { rowIndex, columnIndex })
      row[columnIndex + columnIndexOffset] = cell
    }

    setRowMetadata?.(row)
  }
}
