/* eslint-disable prefer-destructuring */
import { type ComputedRef, computed } from 'vue'

import { EDGE_TYPES } from '../../constants'
import type { GanttProps } from '../../gantt-chart'
import type { Edge, GanttEdge, GanttNode } from '../../types'

export const useEdges = (props: GanttProps, nodes: ComputedRef<GanttNode[]>) => {
  const ganttEdges = computed(() => {
    const edges: GanttEdge[] = []

    props.edges.forEach((edge) => {
      const source = nodes.value.find((node) => node.id === edge.source)
      const target = nodes.value.find((node) => node.id === edge.target)

      if (source && target) {
        edges.push(getEdgeFullPath(edge, source, target, props.cellHeight))
      }
    })

    return edges
  })

  return { ganttEdges }
}

export function getEdgeFullPath(edge: Edge, source: GanttNode, target: GanttNode, cellHeight: number): GanttEdge {
  const pathStartY = Math.round(cellHeight / 2) - 3

  if (!(source && target && source.position.y && target.position.y)) {
    return {
      ...edge,
      svg: {
        path: '',
        arrow: '',
      },
    }
  }

  let isSourceStart = false
  let isTargetStart = false

  // eslint-disable-next-line default-case
  switch (edge.type) {
    case EDGE_TYPES.END_START: {
      isTargetStart = true
      break
    }
    case EDGE_TYPES.START_START: {
      isSourceStart = true

      isTargetStart = true
      break
    }
    case EDGE_TYPES.START_END: {
      isSourceStart = true
    }
  }
  const edgeSourcePositionX = isSourceStart ? source.position.x : source.position.x + source.position.width
  const edgeSourcePositionY = source.position.y
  const edgeTargetPositionX = isTargetStart ? target.position.x : target.position.x + target.position.width
  const edgeTargetPositionY = target.position.y

  if (edgeSourcePositionX === edgeTargetPositionX && edgeSourcePositionY === edgeTargetPositionY) {
    return {
      ...edge,
      svg: {
        path: '',
        arrow: '',
      },
    }
  }

  const edgePath = getEdgePath(
    edgeSourcePositionX,
    edgeSourcePositionY + pathStartY,
    edgeTargetPositionX,
    edgeTargetPositionY + pathStartY,
    isSourceStart,
    isTargetStart,
    cellHeight / 2,
  )

  const edgeArrow = getEdgeArrow(edgeTargetPositionX, edgeTargetPositionY + pathStartY, isTargetStart)

  return {
    ...edge,
    svg: {
      path: edgePath,
      arrow: edgeArrow,
    },
  }
}

function getEdgePath(
  edgeSourcePositionX: number,
  edgeSourcePositionY: number,
  edgeTargetPositionX: number,
  edgeTargetPositionY: number,
  isSourceStart: boolean,
  isTargetStart: boolean,
  middleCellHeight: number,
) {
  const edgeSourceIndent = edgeSourcePositionX + 20 * (isSourceStart ? -1 : 1)
  const edgeTargetIndent = edgeTargetPositionX + 20 * (isTargetStart ? -1 : 1)
  const pathChunks = [
    edgeSourcePositionX,
    edgeSourcePositionY,
    edgeSourceIndent,
    edgeSourcePositionY,
    0,
    0,
    0,
    0,
    edgeTargetIndent,
    edgeTargetPositionY,
    edgeTargetPositionX,
    edgeTargetPositionY,
  ]
  const edgePathLength = edgeTargetIndent - edgeSourceIndent

  let edgePathHeight = edgeTargetPositionY - edgeSourcePositionY

  const isOneSide = isTargetStart === isSourceStart

  if (
    !isOneSide &&
    ((edgeTargetIndent <= edgeSourcePositionX && isTargetStart) ||
      (edgeTargetIndent > edgeSourcePositionX && !isTargetStart))
  ) {
    edgePathHeight -= middleCellHeight
  }

  if (
    (isOneSide && isTargetStart && edgeSourceIndent > edgeTargetIndent) ||
    (isOneSide && !isTargetStart && edgeSourceIndent < edgeTargetIndent)
  ) {
    pathChunks[4] = pathChunks[2] + edgePathLength
    pathChunks[5] = pathChunks[3]
    pathChunks[6] = pathChunks[4]
    pathChunks[7] = pathChunks[5] + edgePathHeight
    pathChunks[0] -= 1
    pathChunks[10] += 4
  } else {
    pathChunks[4] = pathChunks[2]
    pathChunks[5] = pathChunks[3] + edgePathHeight
    pathChunks[6] = pathChunks[4] + edgePathLength
    pathChunks[7] = pathChunks[5]
    pathChunks[0] += 2
    pathChunks[10] -= 4
  }

  return pathChunks.join(',')
}

function getEdgeArrow(edgeTargetPositionX: number, edgeTargetPositionY: number, isTargetStart: boolean) {
  return isTargetStart
    ? `${edgeTargetPositionX - 5},${edgeTargetPositionY - 3},${edgeTargetPositionX - 5},${
        edgeTargetPositionY + 3
      },${edgeTargetPositionX},${edgeTargetPositionY}`
    : `${edgeTargetPositionX + 5},${edgeTargetPositionY + 3},${edgeTargetPositionX + 5},${edgeTargetPositionY - 3},${
        edgeTargetPositionX + 1
      },${edgeTargetPositionY}`
}
