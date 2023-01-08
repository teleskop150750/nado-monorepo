/**
 * TODO: сделайте это в разделе константы или токены
 */
export const tooltipCommonProps = {
  nowrap: {
    type: Boolean,
    default: false,
  },
}

export const TooltipSides = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
}

export const tooltipSides = Object.values(TooltipSides)

export const tooltipOppositeSide = {
  [TooltipSides.top]: TooltipSides.bottom,
  [TooltipSides.bottom]: TooltipSides.top,
  [TooltipSides.left]: TooltipSides.right,
  [TooltipSides.right]: TooltipSides.left,
}

export const tooltipArrowBorders = {
  [TooltipSides.top]: [TooltipSides.left, TooltipSides.top],
  [TooltipSides.bottom]: [TooltipSides.bottom, TooltipSides.right],
  [TooltipSides.left]: [TooltipSides.bottom, TooltipSides.left],
  [TooltipSides.right]: [TooltipSides.top, TooltipSides.right],
}
