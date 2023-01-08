import DatePickPanel from './date-picker-com/NPanelDatePick.vue'
import DateRangePickPanel from './date-picker-com/NPanelDateRange.vue'
import MonthRangePickPanel from './date-picker-com/NPanelMonthRange.vue'

/**
 * @param {import('./date-picker.type.js').IDatePickerType} type
 */
export const getPanel = (type) => {
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
