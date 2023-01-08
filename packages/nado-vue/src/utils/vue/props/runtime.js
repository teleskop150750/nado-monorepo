import { fromPairs } from 'lodash-unified'
import { warn } from 'vue'

import { hasOwn } from '../../objects.js'
import { isObject } from '../../types.js'

export const nPropKey = '__nPropKey'

/**
 * @template T
 * @param {any} val
 * @return {import('vue').PropType<T>}
 */
export const definePropType = (val) => val

export const isNProp = (val) => isObject(val) && !!val[nPropKey]

export const buildProp = (prop, key) => {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  if (!isObject(prop) || isNProp(prop)) {
    return prop
  }

  const { values, required, default: defaultValue, type, validator } = prop

  const _validator =
    values || validator
      ? (value) => {
          let valid = false
          let allowedValues = []

          if (values) {
            allowedValues = [...values]

            if (hasOwn(prop, 'default')) {
              allowedValues.push(defaultValue)
            }

            valid ||= allowedValues.includes(value)
          }

          if (validator) {
            valid ||= validator(value)
          }

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)].map((val) => JSON.stringify(val)).join(', ')

            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(value)}.`,
            )
          }

          return valid
        }
      : undefined

  const epProp = {
    type,
    required: !!required,
    validator: _validator,
    [nPropKey]: true,
  }

  if (hasOwn(prop, 'default')) {
    epProp.default = defaultValue
  }

  return epProp
}

export const buildProps = (props) =>
  fromPairs(Object.entries(props).map(([key, option]) => [key, buildProp(option, key)]))
