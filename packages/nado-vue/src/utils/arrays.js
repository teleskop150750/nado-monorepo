/**
 * @template T
 * @param {T[]} arr
 */
export const unique = (arr) => [...new Set(arr)]

/**
 * @template T
 * @param {import('./arrays.js').Many<T>} array
 * @return {T[]}
 */
export const ensureArray = (array) => {
  if (!array && array !== 0) {
    return []
  }

  // @ts-ignore
  return Array.isArray(array) ? array : [array]
}

export { castArray } from 'lodash-unified'
