/**
 * @param {import("vue").ComponentInternalInstance} vm
 * @return {boolean}
 */
export function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== undefined
}
