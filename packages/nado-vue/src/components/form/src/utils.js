import { castArray } from '../../../utils/index.js'

/**
 * @param {any} fields
 * @param {import('../../../utils/typescript.js').Arrayable<any>} props
 */
export const filterFields = (fields, props) => {
  const normalized = castArray(props)

  return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields
}
