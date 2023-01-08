import { componentSizes } from '../../constants/size.js'

/**
 * @param {string} val
 * @returns {val is import("../../constants/size.js").ComponentSizes | ''}
 */
export const isValidComponentSize = (val) => ['', ...componentSizes].includes(val)
