import type { Dayjs } from 'dayjs'
import type { StyleValue } from 'vue'

import type { EDGE_TYPES_VALUES } from './constants'

export interface Node<T = unknown> {
  id: number | string
  data: T
  startDate: string | Dayjs
  endDate: string | Dayjs
}

export interface GanttNode<T = unknown> extends Node<T> {
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  style: {
    position: string
    top: string
    left: string
    width: string
    height: string
  } & StyleValue
}

export interface Edge {
  id: number | string
  source: number | string
  target: number | string
  type: EDGE_TYPES_VALUES
}

export interface GanttEdge extends Edge {
  svg: {
    path: string
    arrow: string
  }
}

export interface Scale {
  unit: 'year' | 'month' | 'week' | 'day' | 'hour'
  step: number
  format: string
}
