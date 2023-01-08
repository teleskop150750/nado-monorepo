import { getCurrentInstance } from '../getCurrentInstance/index.js'

export function useRender(render) {
  const vm = getCurrentInstance('useRender')

  // @ts-ignore
  vm.render = render
}
