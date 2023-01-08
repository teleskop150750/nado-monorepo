import installer from './defaults.js'

export * from './components/index.js'
export * from './constants/index.js'
export * from './directives/index.js'
export * from './hooks/index.js'
export * from './icons/index.js'
export * from './make-installer.js'
export * from './tokens/index.js'

export const { install } = installer
export const { version } = installer

// eslint-disable-next-line unicorn/prefer-export-from
export default installer
export { default as dayjs } from 'dayjs'
