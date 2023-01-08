// const effects = ['light', 'dark']
// const triggers = ['click', 'contextmenu', 'hover', 'focus']

export const Effect = {
  LIGHT: 'light',
  DARK: 'dark',
}

export const roleTypes = ['dialog', 'grid', 'group', 'listbox', 'menu', 'navigation', 'tooltip', 'tree']

export const popperProps = {
  role: {
    type: String,
    default: 'tooltip',
    validator(val) {
      return roleTypes.includes(val)
    },
  },
}
