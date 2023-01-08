import { get, set } from 'lodash-unified'

export const keysOf = (arr) => Object.keys(arr)
export const entriesOf = (arr) => Object.entries(arr)

export { hasOwn } from '@vue/shared'

export const getProp = (obj, path, defaultValue) => ({
  get value() {
    return get(obj, path, defaultValue)
  },
  set value(val) {
    set(obj, path, val)
  },
})
