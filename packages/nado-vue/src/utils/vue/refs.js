import { isFunction } from '../types.js'

export const composeRefs =
  (...refs) =>
  (el) => {
    refs.forEach((ref) => {
      if (isFunction(ref)) {
        ref(el)
      } else {
        ref.value = el
      }
    })
  }
