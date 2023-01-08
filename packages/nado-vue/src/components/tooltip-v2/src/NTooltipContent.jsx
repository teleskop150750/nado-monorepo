import { offset } from '@floating-ui/dom'
import { computed, inject, onMounted, provide, ref, unref, watch } from 'vue'

import { arrowMiddleware, useFloating, useNamespace, useZIndex } from '../../../hooks/index.js'
import { tooltipV2ContentKey, tooltipV2RootKey } from '../../../tokens/index.js'
import { createComponent } from '../../../utils/index.js'
import { NVisuallyHidden } from '../../visually-hidden/src/NVisuallyHidden.jsx'
import { tooltipCommonProps } from './common.js'
import { tooltipContentProps } from './contentProps.js'

export const NTooltipContent = createComponent({
  name: 'NTooltipContent',
  inheritAttrs: false,
  props: { ...tooltipContentProps, ...tooltipCommonProps },
  setup(props, { slots }) {
    const { triggerRef, contentId } = inject(tooltipV2RootKey)

    const placement = ref(props.placement)
    const strategy = ref(props.strategy)
    const arrowRef = ref(null)

    const { referenceRef, contentRef, middlewareData, x, y, update } = useFloating({
      placement,
      strategy,
      middleware: computed(() => {
        const middleware = [offset(props.offset)]

        if (props.showArrow) {
          middleware.push(arrowMiddleware({ arrowRef, padding: 0 }))
        }

        return middleware
      }),
    })

    const zIndex = useZIndex().nextZIndex()
    const ns = useNamespace('tooltip')

    const side = computed(() => placement.value.split('-')[0])

    /** @type {import('vue').ComputedRef<import('vue').CSSProperties>} */
    // @ts-ignore
    const contentStyle = computed(() => ({
      position: unref(strategy),
      top: `${unref(y) || 0}px`,
      left: `${unref(x) || 0}px`,
      zIndex,
    }))

    const arrowStyle = computed(() => {
      if (!props.showArrow) {
        return {}
      }

      const { arrow } = unref(middlewareData)

      return {
        [`--${ns.namespace}-comp-tooltip-arrow-x`]: arrow.x ? `${arrow.x}px` : '',
        [`--${ns.namespace}-comp-tooltip-arrow-y`]: arrow.y ? `${arrow.y}px` : '',
      }
    })

    const contentClass = computed(() => [
      ns.e('content'),
      ns.oldIs('dark', props.effect === 'dark'),
      ns.oldIs(unref(strategy)),
      props.contentClass,
    ])

    watch(arrowRef, () => update())

    watch(
      () => props.placement,
      (val) => {
        placement.value = val
      },
    )

    onMounted(() => {
      watch(
        () => props.reference || triggerRef.value,
        (el) => {
          referenceRef.value = el || undefined
        },
        {
          immediate: true,
        },
      )
    })

    provide(tooltipV2ContentKey, { arrowRef })

    return () => (
      <div ref={contentRef.value} style={contentStyle.value} data-tooltip-root>
        {!props.nowrap && (
          <div data-side={side.value} class={contentClass.value}>
            {slots.default({ contentStyle, contentClass })}
            <NVisuallyHidden id={contentId.value} role="tooltip">
              {props.ariaLabel ?? slots.default({ contentStyle, contentClass })}
            </NVisuallyHidden>
            {slots.arrow && slots.arrow({ style: arrowStyle, side })}
          </div>
        )}
      </div>
    )
  },
})
