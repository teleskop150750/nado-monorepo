import { isString } from '@vueuse/core'

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false
  }

  return !Number.isNaN(Number(val))
}
