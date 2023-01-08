import { pick } from 'lodash-unified'
import { reactive, toRefs, Transition } from 'vue'

import { createComponent, hSlot } from '../../../utils/index.js'
import { NPortal } from '../../portal/index.js'
import { tooltipArrowProps } from './arrowProps.js'
import { tooltipContentProps } from './contentProps.js'
import { NTooltipArrow } from './NTooltipArrow.jsx'
import { NTooltipContent } from './NTooltipContent.jsx'
import { NTooltipRoot } from './NTooltipRoot.jsx'
import { NTooltipTrigger } from './NTooltipTrigger.jsx'
import { tooltipRootProps } from './rootProps.js'
import { tooltipProps } from './tooltipProps.js'
import { tooltipTriggerProps } from './triggerProps.js'

export const NTooltipV2 = createComponent({
  name: 'NTooltip',
  props: tooltipProps,
  setup(props, { slots }) {
    const refedProps = toRefs(props)
    const arrowProps = reactive(pick(refedProps, Object.keys(tooltipArrowProps)))
    const contentProps = reactive(pick(refedProps, Object.keys(tooltipContentProps)))
    const rootProps = reactive(pick(refedProps, Object.keys(tooltipRootProps)))
    const triggerProps = reactive(pick(refedProps, Object.keys(tooltipTriggerProps)))

    return () => {
      const content = (
        <NTooltipContent {...contentProps}>
          {{
            default: () => hSlot(slots.default),
            arrow: ({ style, side }) =>
              props.showArrow && <NTooltipArrow {...arrowProps} style={style} side={side}></NTooltipArrow>,
          }}
        </NTooltipContent>
      )

      return (
        <NTooltipRoot {...rootProps}>
          {{
            default: ({ open }) => (
              <>
                <NTooltipTrigger {...triggerProps} nowrap={true}>
                  {slots.trigger()}
                </NTooltipTrigger>
                <NPortal to={props.to} disabled={props.teleported}>
                  {props.fullTransition ? (
                    <Transition {...props.transitionProps}>{(open.value || props.alwaysOn) && content}</Transition>
                  ) : (
                    (open.value || props.alwaysOn) && content
                  )}
                </NPortal>
              </>
            ),
          }}
        </NTooltipRoot>
      )
    }
  },
})
