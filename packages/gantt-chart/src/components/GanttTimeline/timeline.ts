import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes, PropType } from 'vue'

import type { Scale } from '../GanttChart/types'

export const ganttTimelineProps = {
  start: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  end: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  scale: {
    type: Object as PropType<Scale>,
    required: true,
  },
  scales: {
    type: Array as PropType<Scale[]>,
    required: true,
  },
  cellWidth: {
    type: Number,
    default: 60,
  },
  width: {
    type: Number,
    default: 0,
  },
} as const

export const ganttTimelineUnitProps = {
  start: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  end: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  scale: {
    type: Object as PropType<Scale>,
    required: true,
  },
  primaryScale: {
    type: Object as PropType<Scale>,
    required: true,
  },
  cellWidth: {
    type: Number,
    default: 60,
  },
  width: {
    type: Number,
    default: 0,
  },
} as const

export type TimelineProps = ExtractPropTypes<typeof ganttTimelineProps>
export type TimelineUnitProps = ExtractPropTypes<typeof ganttTimelineUnitProps>
