import { EVENT_CODE } from '../../../constants/aria.js'
import { popperTriggerProps } from '../../popper/src/popperTriggerProps.js'

export const useTooltipTriggerProps = {
  ...popperTriggerProps,
  disabled: Boolean,
  trigger: {
    // 'hover' | 'focus' | 'click' | 'contextmenu'
    type: [String, Array],
    default: 'hover',
  },
  triggerKeys: {
    type: Array,
    default: () => [EVENT_CODE.enter, EVENT_CODE.space],
  },
}
