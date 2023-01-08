export const EDGE_TYPES = {
  END_START: 'END_START',
  START_END: 'START_END',
  END_END: 'END_END',
  START_START: 'START_START',
} as const

export type EDGE_TYPES_VALUES = typeof EDGE_TYPES[keyof typeof EDGE_TYPES]
