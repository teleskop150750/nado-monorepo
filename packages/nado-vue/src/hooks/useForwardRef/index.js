import { provide } from 'vue'

export const FORWARD_REF_INJECTION_KEY = Symbol('elForwardRef')

export const useForwardRef = (forwardRef) => {
  const setForwardRef = (el) => {
    forwardRef.value = el
  }

  provide(FORWARD_REF_INJECTION_KEY, {
    setForwardRef,
  })
}

export const useForwardRefDirective = (setForwardRef) => ({
  mounted(el) {
    setForwardRef(el)
  },
  updated(el) {
    setForwardRef(el)
  },
  unmounted() {
    setForwardRef(null)
  },
})
