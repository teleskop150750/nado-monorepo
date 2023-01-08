import type { InjectionKey, Ref } from 'vue'

import type { TooltipTriggerType } from '../components/tooltip/src/tooltipProps.g.js'
import type { Arrayable } from '../utils/typescript.js'

export type NTooltipInjectionContext = {
  controlled: Ref<boolean>
  id: Ref<string>
  open: Ref<boolean>
  trigger: Ref<Arrayable<TooltipTriggerType>>
  onOpen: (e?: Event) => void
  onClose: (e?: Event) => void
  onToggle: (e: Event) => void
  onShow: () => void
  onHide: () => void
  onBeforeShow: () => void
  onBeforeHide: () => void
  updatePopper: () => void
}

export const TOOLTIP_INJECTION_KEY: InjectionKey<NTooltipInjectionContext> = Symbol('nTooltip')
