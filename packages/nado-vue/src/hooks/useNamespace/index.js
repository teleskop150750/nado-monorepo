const statePrefix = 'is-'
const hasPrefix = 'has-'

export const defaultNamespace = 'n'

/**
 * @param {string} namespace
 * @param {string} block
 * @param {string} blockSuffix
 * @param {string} element
 * @param {string} modifier
 * @returns
 */
const _bem = (namespace, block, blockSuffix, element, modifier) => {
  let cls = `${namespace}-${block}`

  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }

  if (element) {
    cls += `__${element}`
  }

  if (modifier) {
    cls += `--${modifier}`
  }

  return cls
}

/**
 * @param {string} block
 * @returns
 */
export const useNamespace = (block) => {
  const b = (blockSuffix = '') => _bem(defaultNamespace, block, blockSuffix, '', '')
  const e = (element, state = true) => {
    if (!state) {
      return undefined
    }

    return element ? _bem(defaultNamespace, block, '', element, '') : ''
  }
  const m = (modifier) => (modifier ? _bem(defaultNamespace, block, '', '', modifier) : '')

  /**
   * @param {string|undefined} blockSuffix
   * @param {string|undefined} element
   * @returns
   */
  const be = (blockSuffix = undefined, element = undefined) =>
    blockSuffix && element ? _bem(defaultNamespace, block, blockSuffix, element, '') : ''

  /**
   * @param {string|undefined} element
   * @param {string|undefined} modifier
   * @returns
   */
  const em = (element = undefined, modifier = undefined) =>
    element && modifier ? _bem(defaultNamespace, block, '', element, modifier) : ''
  /**
   * @param {string|undefined} blockSuffix
   * @param {string|undefined} modifier
   * @returns
   */
  const bm = (blockSuffix = undefined, modifier = undefined) =>
    blockSuffix && modifier ? _bem(defaultNamespace, block, blockSuffix, '', modifier) : ''

  /**
   * @param {string|undefined} blockSuffix
   * @param {string|undefined} element
   * @param {string|undefined} modifier
   * @returns
   */
  const bem = (blockSuffix = undefined, element = undefined, modifier = undefined) =>
    blockSuffix && element && modifier ? _bem(defaultNamespace, block, blockSuffix, element, modifier) : ''

  /**
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const is = (name, state = true) =>
    name && state ? _bem(defaultNamespace, block, '', '', `${statePrefix}${name}`) : undefined

  /**
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const has = (name, state = true) =>
    name && state ? _bem(defaultNamespace, block, '', '', `${hasPrefix}${name}`) : undefined

  /**
   * @param {string} blockSuffix
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const bHas = (blockSuffix, name, state = true) =>
    name && state ? _bem(defaultNamespace, block, blockSuffix, '', `${hasPrefix}${name}`) : undefined

  /**
   * @param {string} blockSuffix
   * @param {string} element
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const beHas = (blockSuffix, element, name, state = true) =>
    name && state ? _bem(defaultNamespace, block, blockSuffix, element, `${hasPrefix}${name}`) : undefined

  /**
   * @param {string} blockSuffix
   * @param {string} element
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const beIs = (blockSuffix, element, name, state = true) =>
    name && state ? _bem(defaultNamespace, block, blockSuffix, element, `${statePrefix}${name}`) : undefined

  /**
   * @param {string} element
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const eIs = (element, name, state = true) =>
    name && state ? _bem(defaultNamespace, block, '', element, `${statePrefix}${name}`) : undefined

  /**
   * @param {string} element
   * @param {string} name
   * @param {boolean} state
   * @returns
   */
  const eHas = (element, name, state = true) =>
    name && state ? _bem(defaultNamespace, block, '', element, `${hasPrefix}${name}`) : undefined

  // For css var
  // --n-xxx: value;
  /**
   * @param {Record<string, string>} object
   * @returns
   */
  const cssVar = (object) => {
    const styles = Object.create(Object.prototype)

    Object.keys(object).forEach((key) => {
      if (object[key]) {
        styles[`--${defaultNamespace}-${key}`] = object[key]
      }
    })

    return styles
  }

  // With block
  /**
   * @param {Record<string, string>} object
   * @returns
   */
  const cssVarBlock = (object) => {
    const styles = Object.create(Object.prototype)

    Object.keys(object).forEach((key) => {
      if (object[key]) {
        styles[`--${defaultNamespace}-${block}-${key}`] = object[key]
      }
    })

    return styles
  }

  /**
   * @param {string} name
   * @returns
   */
  const cssVarName = (name) => `--${defaultNamespace}-${name}`

  /**
   * @param {string} name
   * @returns
   */
  const cssVarBlockName = (name) => `--${defaultNamespace}-${block}-${name}`

  const oldIs = (name, ...args) => {
    const state = args.length > 0 ? args[0] : true

    return name && state ? `${statePrefix}${name}` : ''
  }

  return {
    namespace: defaultNamespace,
    b,
    m,
    is,
    has,
    bHas,
    beHas,
    bm,
    e,
    em,
    eIs,
    eHas,
    be,
    beIs,
    bem,
    oldIs,
    // Css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}
