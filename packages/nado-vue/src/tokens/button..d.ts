import type { InjectionKey } from 'vue'

export interface ButtonGroupContext {
  size?: any
  type?: any
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContext> = Symbol('buttonGroupContextKey')
