import type { Dayjs } from 'dayjs'
import type { ComputedRef, Ref, ToRef } from 'vue'

type MonthRangeHeaderArg = {
  unlinkPanels: ToRef<boolean>
  leftDate: Ref<Dayjs>
  rightDate: Ref<Dayjs>
}
export const useMonthRangeHeader: (prop: MonthRangeHeaderArg) => {
  leftPrevYear: () => void
  rightNextYear: () => void
  leftNextYear: () => void
  rightPrevYear: () => void
  leftLabel: ComputedRef<string>
  rightLabel: ComputedRef<string>
  leftYear: ComputedRef<number>
  rightYear: ComputedRef<number>
}
