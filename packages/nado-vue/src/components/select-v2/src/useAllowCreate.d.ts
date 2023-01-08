import type { ISelectPros } from './optionProps.js'

export function useAllowCreate(
  props: ISelectPros,
  states: any,
): {
  createNewOption: (query: string) => void
  removeNewOption: (option: Option) => void
  selectNewOption: (option: Option) => void
  clearAllNewOption: () => void
}
