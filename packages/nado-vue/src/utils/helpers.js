export function toKebabCase(str = '') {
  return (
    str
      .replace(/[^a-z]/gi, '-')
      // eslint-disable-next-line prefer-named-capture-group
      .replace(/\B([A-Z])/g, '-$1')
      .toLowerCase()
  )
}
