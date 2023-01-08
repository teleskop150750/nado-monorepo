import type { Dayjs } from 'dayjs'
import { type Ref } from 'vue'

import type { DefaultValue } from '../utils'

type UseRangePickerProps = {
  onParsedValueChanged: (minDate: Dayjs | undefined, maxDate: Dayjs | undefined) => void
  defaultValue: Ref<DefaultValue>
  leftDate: Ref<Dayjs>
  rightDate: Ref<Dayjs>
  unit: 'month' | 'year'
}
