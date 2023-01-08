import { isArray, isObject } from '@vue/shared'
import { isNil } from 'lodash-unified'

export { isArray, isDate, isFunction, isObject, isPromise, isString, isSymbol } from '@vue/shared'
export { isBoolean, isNumber } from '@vueuse/core'
export { isVNode } from 'vue'

export const isUndefined = (val) => val === undefined

export const isEmpty = (val) =>
  (!val && val !== 0) || (isArray(val) && val.length === 0) || (isObject(val) && Object.keys(val).length === 0)

export const isElement = (evt) => {
  if (typeof Element === 'undefined') {
    return false
  }

  return evt instanceof Element
}

export const isPropAbsent = (prop) => isNil(prop)
