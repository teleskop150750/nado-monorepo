import type { IDatePickerType } from './date-picker.type.js'
import DatePickPanel from './date-picker-com/NPanelDatePick.vue'
import DateRangePickPanel from './date-picker-com/NPanelDateRange.vue'
import MonthRangePickPanel from './date-picker-com/NPanelMonthRange.vue'

export const getPanel = (type: IDatePickerType) => {
  switch (type) {
    case 'daterange':
    case 'datetimerange': {
      return DateRangePickPanel
    }
    case 'monthrange': {
      return MonthRangePickPanel
    }
    default: {
      return DatePickPanel
    }
  }
}
