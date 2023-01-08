import type { Dayjs, ManipulateType } from 'dayjs'

import type { Scale } from '@/components/GanttChart/types'

export const getCountUnitInRange = (dateStart: Dayjs, dateEnd: Dayjs, type: ManipulateType) => {
  const _dateStart = dateStart.startOf(type)
  const _dateEnd = dateEnd > dateEnd.startOf(type) ? dateEnd.startOf(type).add(1, type) : dateEnd.startOf(type)

  return _dateEnd.diff(_dateStart, type)
}

export const getUnitListInRange = (dateStart: Dayjs, dateEnd: Dayjs, scale: Scale) => {
  const units = []
  let _dateStart = dateStart.startOf(scale.unit)
  const _dateEnd = dateEnd.isSame(dateEnd.startOf(scale.unit))
    ? dateEnd.startOf(scale.unit)
    : dateEnd.startOf(scale.unit).add(1, scale.unit)

  const diff = getCountUnitInRange(_dateStart, _dateEnd, scale.unit)
  console.log('diff');
  console.log(diff);
  

  for (let index = 0; index < diff; index++) {
    if ((index + scale.step) % scale.step === 0) {
      units.push(_dateStart)
    }

    _dateStart = _dateStart.add(1, scale.unit)
  }

  return units
}
