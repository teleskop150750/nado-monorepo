import { capitalize as toCapitalize } from '@vue/shared'

export {
  camelize,
  hyphenate,
  hyphenate as kebabCase, // alias
} from '@vue/shared'

/**
 * fork from {@link https://github.com/sindresorhus/escape-string-regexp}
 */
export const escapeStringRegexp = (string = '') =>
  string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&').replaceAll('-', '\\x2d')

export const capitalize = (str = '') => toCapitalize(str)
