import type { ManipulateType } from 'dayjs'
import { type Ref, computed } from 'vue'

import { useDayjs } from '../../../../composables'
import { throwError } from '../../../utils'
import type { GanttProps } from '../../gantt-chart'
import type { Node, Scale } from '../../types'

const dayjs = useDayjs()

export const useTimeline = (props: GanttProps, tableWrapperWidth: Ref<number>) => {
  const primaryScale = computed(() => getPrimaryScale(props.scales))
  const rangeDate = computed(() => getRangeDate(props.cellWidth, props.nodes, primaryScale.value))

  const initTimelineWidth = computed(() => {
    const count = calcCount(
      rangeDate.value.end.diff(rangeDate.value.start, primaryScale.value.unit),
      primaryScale.value.step,
    )
    const rangeWidth = count * props.cellWidth
    const wrapperWidth = Math.floor(tableWrapperWidth.value)

    return rangeWidth < wrapperWidth ? wrapperWidth : rangeWidth
  })

  const diffDate = computed(() => {
    const count = Math.ceil(initTimelineWidth.value / props.cellWidth)

    return calcCount(count, primaryScale.value.step)
  })

  const timelineWidth = computed(() => diffDate.value * props.cellWidth)

  const startDate = computed(() => rangeDate.value.start)
  const endDate = computed(() => rangeDate.value.start.add(diffDate.value, primaryScale.value.unit))

  return {
    primaryScale,
    startDate,
    endDate,
    timelineWidth,
  }
}

function getPrimaryScale(scales: Scale[]) {
  const units = ['hour', 'day', 'week', 'month', 'year']

  for (const unit of units) {
    const scale = scales.find((item) => item.unit === unit)

    if (scale) {
      return scale
    }
  }

  throwError('Gantt', 'Не выбран scale')
}

function getRangeDate(cellWidth: number, nodes: Node[], scale: Scale) {
  if (nodes.length === 0) {
    return {
      start: dayjs().add(-scale.step, scale.unit),
      end: dayjs().add(scale.step, scale.unit),
    }
  }

  const minOffsetWidth = 25
  const offset = scale.step * cellWidth < minOffsetWidth ? Math.ceil(minOffsetWidth / cellWidth) * 2 : scale.step

  let { start, end } = getNodeDateRange(nodes[0], scale.unit)

  nodes.forEach((node) => {
    const { start: nodeStartDate, end: nodeEndDate } = getNodeDateRange(node, scale.unit)

    if (nodeStartDate < start) {
      start = nodeStartDate
    }

    if (nodeEndDate > end) {
      end = nodeEndDate
    }
  })

  return {
    start: start.add(-offset, scale.unit),
    end: end.add(offset, scale.unit),
  }
}

function calcCount(count: number, step: number) {
  let result = count

  while (result % step !== 0) {
    result += 1
  }

  return result
}

export function getNodeDateRange(node: Node, unit: ManipulateType) {
  const startDay = dayjs(node.startDate)
  const endDay = dayjs(node.endDate)

  return {
    start: startDay.startOf(unit),
    end: endDay.startOf(unit),
  }
}
