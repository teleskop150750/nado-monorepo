import type { InjectionKey, Ref } from 'vue'

export const FOCUS_AFTER_ACTIVATE = 'focus-trap.focus-after-activate'
export const FOCUS_AFTER_DEACTIVATE = 'focus-trap.focus-after-deactivate'
export const FOCUSOUT_PREVENTED = 'focus-trap.focusout-prevented'
export const FOCUS_AFTER_ACTIVATE_OPTS = {
  cancelable: true,
  bubbles: false,
}
export const FOCUSOUT_PREVENTED_OPTS = {
  cancelable: true,
  bubbles: false,
}

export const ON_AFTER_ACTIVATE = 'afterActivate'
export const ON_AFTER_DEACTIVATE = 'afterDeactivate'

export type FocusTrapInjectionContext = {
  focusTrapRef: Ref<HTMLElement | undefined>
  onKeydown: (e: KeyboardEvent) => void
}

export const FOCUS_TRAP_INJECTION_KEY: InjectionKey<FocusTrapInjectionContext>
