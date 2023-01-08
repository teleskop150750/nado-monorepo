import type { Dayjs } from 'dayjs'

import type { TimelineUnitProps } from '../timeline'

export function getUnitWidth(date: Dayjs, props: TimelineUnitProps) {
  return getCountUnitInRange(date, props) * props.cellWidth
  return Math.abs(getCountUnitInRange(date, props) * props.cellWidth)
}

function getCountUnitInRange(date: Dayjs, props: TimelineUnitProps) {
  const start = getStartDate(date, props)
  const end = getEndDate(date, props)

  return end.diff(start, props.primaryScale.unit)
}

function getStartDate(date: Dayjs, props: TimelineUnitProps) {
  const start = date.startOf(props.scale.unit)

  return start < props.start ? props.start : date
}

function getEndDate(date: Dayjs, props: TimelineUnitProps) {
  const end = date.startOf(props.scale.unit).add(props.scale.step, props.scale.unit)

  return end > props.end ? props.end : end
}
