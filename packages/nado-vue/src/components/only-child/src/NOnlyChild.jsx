import { isObject, NOOP } from '@vue/shared'
import { cloneVNode, Comment, defineComponent, Fragment, inject, Text, withDirectives } from 'vue'

import { FORWARD_REF_INJECTION_KEY, useForwardRefDirective, useNamespace } from '../../../hooks/index.js'
import { debugWarn } from '../../../utils/index.js'

const COMPONENT_NAME = 'NOnlyChild'

export const NOnlyChild = defineComponent({
  name: COMPONENT_NAME,
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY)
    const forwardRefDirective = useForwardRefDirective(forwardRefInjection?.setForwardRef ?? NOOP)

    return () => {
      const defaultSlot = slots.default?.(attrs)

      if (!defaultSlot) {
        return null
      }

      if (defaultSlot.length > 1) {
        debugWarn(COMPONENT_NAME, 'requires exact only one valid child.')

        return null
      }

      const firstLegitNode = findFirstLegitChild(defaultSlot)

      if (!firstLegitNode) {
        debugWarn(COMPONENT_NAME, 'no valid child node found')

        return null
      }

      return withDirectives(cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]])
    }
  },
})

/**
 * @param {import('vue').VNode[] | undefined} node
 * @return {import('vue').VNode | null}
 */
function findFirstLegitChild(node) {
  if (!node) {
    return null
  }

  const children = node

  for (const child of children) {
    /**
     * когда пользователь использует h(фрагмент, [текст]) для отображения простой строки,
     * этот случай переключения просто не может быть обработан, когда значение является примитивным
     * мы должны просто вернуть завернутую строку
     */
    if (isObject(child)) {
      switch (child.type) {
        case Comment: {
          // eslint-disable-next-line no-continue
          continue
        }
        case Text:
        case 'svg': {
          return wrapTextContent(child)
        }
        case Fragment: {
          // @ts-ignore
          return findFirstLegitChild(child.children)
        }
        default: {
          return child
        }
      }
    }

    return wrapTextContent(child)
  }

  return null
}

/**
 * @param {string | import('vue').VNode} string
 */
function wrapTextContent(string) {
  const ns = useNamespace('only-child')

  return <span class={ns.e('content')}>{string}</span>
}
