import dayjs from 'dayjs'

import { isArray, isDate, isEmpty } from '../../../utils/types.js'
/**
 *
 * @param {number} value
 * @param {number} bound
 */
export const buildTimeList = (value, bound) => [
  value > 0 ? value - 1 : undefined,
  value,
  value < bound ? value + 1 : undefined,
]

/**
 * @param {number} n
 */
export const rangeArr = (n) => [...Array.from({ length: n }).keys()]
/**
 * @param {string} format
 */
export const extractDateFormat = (format) =>
  format
    .replace(/\W?m{1,2}|\W?ZZ/g, '')
    .replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, '')
    .trim()

/**
 * @param {string} format
 */
export const extractTimeFormat = (format) => format.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?Y{2,4}/g, '').trim()

/**
 *
 * @param {Date} a
 * @param {Date} b
 * @returns
 */
export const dateEquals = (a, b) => {
  const aIsDate = isDate(a)
  const bIsDate = isDate(b)

  if (aIsDate && bIsDate) {
    return a.getTime() === b.getTime()
  }

  if (!aIsDate && !bIsDate) {
    return a === b
  }

  return false
}

/**
 *
 * @param {Date[]} a
 * @param {Date[]} b
 * @returns
 */
export const valueEquals = (a, b) => {
  const aIsArray = isArray(a)
  const bIsArray = isArray(b)

  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false
    }

    return a.every((item, index) => dateEquals(item, b[index]))
  }

  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b)
  }

  return false
}

/**
 * @param {string| number| Date} date
 * @param {string} format
 * @param {string} lang
 */
export const parseDate = (date, format, lang) => {
  const day = isEmpty(format) || format === 'x' ? dayjs(date).locale(lang) : dayjs(date, format).locale(lang)

  return day.isValid() ? day : undefined
}

/**
 * @param {string | number | Date | any} date
 * @param {string} format
 * @param {string} lang
 */
export const formatter = function formatter(date, format, lang) {
  if (isEmpty(format)) {
    return date
  }

  if (format === 'x') {
    return Number(date)
  }

  return dayjs(date).locale(lang).format(format)
}

/**
 * @param {number} total
 * @param {() => number[]} [method]
 * @returns
 */
export const makeList = (total, method) => {
  const arr = []
  const disabledArr = method?.()

  for (let i = 0; i < total; i++) {
    arr.push(disabledArr?.includes(i) ?? false)
  }

  return arr
}
