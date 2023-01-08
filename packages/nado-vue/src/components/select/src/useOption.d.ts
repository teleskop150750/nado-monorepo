// @ts-nocheck
import type { ComputedRef } from 'vue'

import type { SelectContext } from '../../../tokens/index'
import type { OptionProps } from './optionProps.js'

export type OptionStates = {
  index: number
  groupDisabled: boolean
  visible: boolean
  hitState: boolean
  hover: boolean
}

export function useOption(
  props: OptionProps,
  states: OptionStates,
): {
  select: SelectContext
  currentLabel: ComputedRef<any>
  currentValue: ComputedRef<any>
  itemSelected: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  hoverItem: () => void
}
