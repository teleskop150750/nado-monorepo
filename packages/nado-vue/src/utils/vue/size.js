import { componentSizeMap } from '../../constants/index.js'

/**
 * @param {import('../../constants/size.js').ComponentSizes} [size]
 * @returns
 */
export const getComponentSize = (size) => componentSizeMap[size || 'default']
