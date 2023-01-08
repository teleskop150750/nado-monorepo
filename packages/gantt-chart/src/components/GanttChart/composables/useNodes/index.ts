import type { Dayjs } from 'dayjs'
import { type ComputedRef, computed } from 'vue'

import type { GanttProps } from '../../gantt-chart'
import type { GanttNode, Scale } from '../../types'
import { getNodeDateRange } from '../useTimeline'

export const useNodes = (props: GanttProps, ganttStartDate: ComputedRef<Dayjs>, scale: ComputedRef<Scale>) => {
  const minWidth = 5
  const border = 1
  const paddingY = 7

  const ganttNodes = computed<GanttNode[]>(() =>
    props.nodes.map((node, index) => {
      const { start, end } = getNodeDateRange(node, scale.value.unit)

      const startDiff = start.diff(ganttStartDate.value, scale.value.unit)
      const nodeDiff = end.diff(start, scale.value.unit)
      const x = startDiff * props.cellWidth - border
      const width = nodeDiff * props.cellWidth

      const position = {
        x: nodeDiff < 1 ? x - (minWidth - border) / 2 - border : x,
        y: props.cellHeight * index + (paddingY - border) / 2,
        width: nodeDiff < 1 ? width + border + minWidth : width + border,
        height: props.cellHeight - paddingY,
      }

      return {
        ...node,
        position,
        style: {
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
        },
      }
    }),
  )

  return {
    ganttNodes,
  }
}
