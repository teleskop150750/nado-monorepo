import type { Instance } from '@popperjs/core'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type Measurable = {
  getBoundingClientRect: () => DOMRect
}

/**
 * triggerRef indicates the element that triggers popper
 * contentRef indicates the element of popper content
 * referenceRef indicates the element that popper content relative with
 */
export type NPopperInjectionContext = {
  triggerRef: Ref<Measurable | undefined>
  contentRef: Ref<HTMLElement | undefined>
  popperInstanceRef: Ref<Instance | undefined>
  referenceRef: Ref<Measurable | undefined>
  role: ComputedRef<string>
}

export type NPopperContentInjectionContext = {
  arrowRef: Ref<HTMLElement | undefined>
  arrowOffset: Ref<number | undefined>
}

export const POPPER_INJECTION_KEY: InjectionKey<NPopperInjectionContext> = Symbol('popper')

export const POPPER_CONTENT_INJECTION_KEY: InjectionKey<NPopperContentInjectionContext> = Symbol('popperContent')
