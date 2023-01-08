export const FOCUS_AFTER_ACTIVATE = 'focus-trap.focus-after-trapped'
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
export const FOCUS_TRAP_INJECTION_KEY = Symbol('nFocusTrap')
