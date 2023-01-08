import 'dayjs/locale/ru'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import utc from 'dayjs/plugin/utc'

dayjs.locale('ru')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(utc)

export const useDayjs = () => dayjs
