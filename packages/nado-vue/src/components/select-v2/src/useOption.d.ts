import type { IOptionProps } from './optionProps.js'

export function useOption(
  props: IOptionProps,
  {
    emit,
  }: {
    emit: any
  },
): {
  hoverItem: () => void
  selectOptionClick: () => void
}
