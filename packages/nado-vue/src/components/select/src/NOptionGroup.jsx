import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  provide,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
} from 'vue'

import { useNamespace, useRender } from '../../../hooks/index.js'
import { selectGroupKey, selectKey } from '../../../tokens/index.js'
import { hSlot } from '../../../utils/index.js'
import { optionGroupProps } from './optionGroupProps.js'

export const NOptionGroup = defineComponent({
  name: 'NOptionGroup',
  props: optionGroupProps,
  setup(props, { slots }) {
    const ns = useNamespace('select')
    const visible = ref(true)
    const instance = getCurrentInstance()
    const children = ref([])

    provide(
      selectGroupKey,
      reactive({
        ...toRefs(props),
      }),
    )

    const select = inject(selectKey)

    onMounted(() => {
      children.value = flattedChildren(instance.subTree)
    })

    // get all instances of options
    /** @param {Object} node */
    function flattedChildren(node) {
      const result = []

      if (Array.isArray(node.children)) {
        node.children.forEach((child) => {
          if (child.type && child.type.name === 'Option' && child.component && child.component.proxy) {
            result.push(child.component.proxy)
          } else if (child.children?.length) {
            result.push(...flattedChildren(child))
          }
        })
      }

      return result
    }

    const { groupQueryChange } = toRaw(select)

    watch(
      groupQueryChange,
      () => {
        visible.value = children.value.some((option) => option.visible === true)
      },
      { flush: 'post' },
    )

    useRender(() => (
      <ul v-show={visible.value} class={ns.be('dropdown', 'group-wrap')}>
        <li class={ns.be('dropdown', 'group-title')}>{props.label}</li>
        <li class={ns.be('dropdown', 'group-inner')}>
          <ul class={ns.be('dropdown', 'group')}>{hSlot(slots.default)}</ul>
        </li>
      </ul>
    ))

    return {
      visible,
      ns,
    }
  },
})
