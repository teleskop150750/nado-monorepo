import type { ExtractPropTypes, PropType } from 'vue'

import type { Node } from '../GanttChart/types'

export const ganttAsideProps = {
  nodes: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
  cellHeight: {
    type: Number,
    default: 40,
  },
  bodyHeight: {
    type: Number,
    default: 0,
  },
} as const

export type GanttAsideProps = ExtractPropTypes<typeof ganttAsideProps>
