import type { ExtractPropTypes, InjectionKey, Ref } from 'vue'

import type { Option } from './select.types.js'
import type { selectProps } from './selectProps.js'

export interface SelectV2Context {
  props: ExtractPropTypes<typeof selectProps>
  expanded?: boolean
  popper: Ref<any>
  onSelect: (option: Option<any>, index: number, byClick?: boolean) => void
  onHover: (idx: number) => void
  onKeyboardNavigate: (direction: 'forward' | 'backward') => void
  onKeyboardSelect: () => void
}

export const selectV2InjectionKey = 'NSelectV2Injection' as any as InjectionKey<SelectV2Context>
