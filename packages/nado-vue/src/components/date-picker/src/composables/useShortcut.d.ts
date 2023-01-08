// FIXME: extract this to `date-picker.ts`
export type Shortcut = {
  text: string
  value: [Date, Date] | (() => [Date, Date])
  onClick?: (ctx: any) => void
}

export const useShortcut: (lang: string) => (shortcut: Shortcut) => void
