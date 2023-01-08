import { computed } from 'vue'

import { useLocale } from '../../../../hooks/index.js'

/**
 * @param {import('./use-month-range-header.js').MonthRangeHeaderArg} param0
 */
export const useMonthRangeHeader = ({ unlinkPanels, leftDate, rightDate }) => {
  const { locale } = useLocale()
  const leftPrevYear = () => {
    leftDate.value = leftDate.value.subtract(1, 'year')

    if (!unlinkPanels.value) {
      rightDate.value = rightDate.value.subtract(1, 'year')
    }
  }

  const rightNextYear = () => {
    if (!unlinkPanels.value) {
      leftDate.value = leftDate.value.add(1, 'year')
    }

    rightDate.value = rightDate.value.add(1, 'year')
  }

  const leftNextYear = () => {
    leftDate.value = leftDate.value.add(1, 'year')
  }

  const rightPrevYear = () => {
    rightDate.value = rightDate.value.subtract(1, 'year')
  }
  const leftLabel = computed(() => `${leftDate.value.year()} ${locale.el.datepicker.year}`)

  const rightLabel = computed(() => `${rightDate.value.year()} ${locale.el.datepicker.year}`)

  const leftYear = computed(() => leftDate.value.year())

  const rightYear = computed(() =>
    rightDate.value.year() === leftDate.value.year() ? leftDate.value.year() + 1 : rightDate.value.year(),
  )

  return {
    leftPrevYear,
    rightNextYear,
    leftNextYear,
    rightPrevYear,
    leftLabel,
    rightLabel,
    leftYear,
    rightYear,
  }
}
