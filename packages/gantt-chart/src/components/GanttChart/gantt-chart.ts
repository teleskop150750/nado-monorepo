import type { ExtractPropTypes, PropType } from 'vue'

import type { Edge, Node, Scale } from './types'

export const ganttProps = {
  scales: {
    type: Array as PropType<Scale[]>,
    default: (): Scale[] => [{ unit: 'day', step: 1, format: 'DD' }],
  },
  cellWidth: {
    type: Number,
    default: 60,
  },
  cellHeight: {
    type: Number,
    default: 40,
  },
  headerHeight: {
    type: Number,
    default: 50,
  },
  data: {
    type: Array as PropType<Array<Record<string, string>>>,
    default: () => [],
  },
  nodes: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
  edges: {
    type: Array as PropType<Edge[]>,
    default: () => [],
  },
} as const

export type GanttProps = ExtractPropTypes<typeof ganttProps>
