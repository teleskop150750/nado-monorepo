import { isArray } from '@vue/shared'

/**
 * @param {Array<import('./select.types.js').Option | import('./select.types.js').OptionGroup>} options
 * @returns
 */
export const flattenOptions = (options) => {
  const flattened = []

  options.forEach((option) => {
    if (isArray(option.options)) {
      flattened.push({
        label: option.label,
        isTitle: true,
        type: 'Group',
      })

      option.options.forEach((o) => {
        flattened.push(o)
      })
      flattened.push({
        type: 'Group',
      })
    } else {
      flattened.push(option)
    }
  })

  return flattened
}
