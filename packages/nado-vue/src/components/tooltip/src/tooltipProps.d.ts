import { createModelToggleComposable } from '../../../hooks/index.js'
import { popperArrowProps } from '../../popper/src/popperArrowPropers.js'
import { popperProps } from '../../popper/src/popperProps.js'
import type { NTooltip } from './NTooltip.jsx'
import { useTooltipContentProps } from './tooltipContentProps.js'
import { useTooltipTriggerProps } from './tooltipTriggerProps.js'

export type TooltipTriggerType = 'hover' | 'focus' | 'click' | 'contextmenu'

export const {
  useModelToggleProps: useTooltipModelToggleProps,
  useModelToggleEmits: useTooltipModelToggleEmits,
  useModelToggle: useTooltipModelToggle,
} = createModelToggleComposable('visible')

export const useTooltipProps = {
  ...popperProps,
  ...useTooltipModelToggleProps,
  ...useTooltipContentProps,
  ...useTooltipTriggerProps,
  ...popperArrowProps,
  showArrow: {
    type: Boolean,
    default: true,
  },
}

export const tooltipEmits = [
  ...useTooltipModelToggleEmits,
  'before-show',
  'before-hide',
  'show',
  'hide',
  'open',
  'close',
]

export type TooltipInstance = InstanceType<typeof NTooltip>
