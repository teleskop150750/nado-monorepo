import { getCurrentInstance as _getCurrentInstance } from 'vue'

import { throwError, toKebabCase } from '../../utils/index.js'

export function getCurrentInstance(name, message) {
  const vm = _getCurrentInstance()

  if (!vm) {
    throw throwError('hooks', ` ${name} ${message || 'must be called from inside a setup function'}`)
  }

  return vm
}

export function getCurrentInstanceName(name = 'composables') {
  const vm = getCurrentInstance(name).type

  // @ts-ignore
  return toKebabCase(vm?.aliasName || vm?.parsedUserName)
}

let _uid = 0
let _map = new WeakMap()

export function getUid() {
  const vm = getCurrentInstance('getUid')

  if (_map.has(vm)) {
    return _map.get(vm)
  }

  // eslint-disable-next-line no-plusplus
  const uid = _uid++

  _map.set(vm, uid)

  return uid
}
getUid.reset = () => {
  _uid = 0
  _map = new WeakMap()
}
