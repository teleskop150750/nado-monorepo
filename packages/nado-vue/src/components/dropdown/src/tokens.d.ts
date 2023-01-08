import type { ComponentInternalInstance, ComputedRef, InjectionKey, Ref } from 'vue'

import type { Nullable } from '../../../utils/typescript.js'

export type NDropdownInjectionContext = {
  contentRef: Ref<HTMLElement | null>
  role: ComputedRef<string>
  triggerId: ComputedRef<string>
  isUsingKeyboard: Ref<boolean>
  onItemLeave: (e: PointerEvent) => void
  onItemEnter: (e: PointerEvent) => void
}

export interface INDropdownInstance {
  instance?: ComponentInternalInstance
  dropdownSize?: ComputedRef<string>
  handleClick?: () => void
  commandHandler?: (...arg) => void
  show?: () => void
  hide?: () => void
  trigger?: ComputedRef<string>
  hideOnClick?: ComputedRef<boolean>
  triggerElm?: ComputedRef<Nullable<HTMLButtonElement>>
}

export const DROPDOWN_LOCAL_INJECTION_KEY: InjectionKey<INDropdownInstance>
export const DROPDOWN_INJECTION_KEY: InjectionKey<NDropdownInjectionContext>
