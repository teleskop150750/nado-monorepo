import { get, isNumber } from 'lodash-unified'
import { computed, inject, ref, unref, watch } from 'vue'

import { EVENT_CODE } from '../../../constants/index.js'
import { useNamespace } from '../../../hooks/index.js'
import { createComponent, isObject } from '../../../utils/index.js'
import { NVirtualList } from '../../virtual-list/index.js'
import NGroupItem from './NGroupItem.vue'
import NOptionItem from './NOptionItem.vue'
import { selectV2InjectionKey } from './token.js'

export const NSelectDropdown = createComponent({
  name: 'NSelectDropdown',

  props: {
    data: {
      type: Array,
      required: true,
    },
    hoveringIndex: Number,
    width: Number,
  },
  setup(props, { slots, expose }) {
    const select = inject(selectV2InjectionKey)
    const ns = useNamespace('select-v2')
    const cachedHeights = computed(() => {
      if (isNumber(select.props.itemHeight)) {
        return []
      }

      const list = []

      for (let index = 0; index < props.data.length; index++) {
        list.push(select.props.itemHeight(index))
      }

      return list
    })

    const listRef = ref()

    const size = computed(() => props.data.length)

    watch(
      () => size.value,
      () => {
        select.popper.value.updatePopper?.()
      },
    )

    // const isSized = computed(() => isUndefined(select.props.estimatedOptionHeight))
    const listProps = computed(() => {
      if (isNumber(select.props.itemHeight)) {
        return {
          itemSize: select.props.itemHeight,
        }
      }

      return {
        itemSize: (idx) => cachedHeights.value[idx],
      }
    })

    const contains = (arr = [], target = undefined) => {
      if (!isObject(target)) {
        return arr.includes(target)
      }

      return arr && arr.some((item) => get(item, select.props.valueKey) === get(target, select.props.valueKey))
    }
    const isEqual = (selected, target) => {
      if (!isObject(target)) {
        return selected === target
      }

      return get(selected, select.props.valueKey) === get(target, select.props.valueKey)
    }

    const isItemSelected = (modelValue, target) => {
      const { valueKey, multiple } = select.props

      if (multiple) {
        return contains(modelValue, get(target, valueKey))
      }

      return isEqual(modelValue, get(target, valueKey))
    }

    const isItemDisabled = (modelValue, selected) => {
      const { disabled, multiple, multipleLimit } = select.props

      return disabled || (!selected && (multiple ? multipleLimit > 0 && modelValue.length >= multipleLimit : false))
    }

    /**
     * @param {number} target
     */
    const isItemHovering = (target) => props.hoveringIndex === target

    /**
     * @param {number} index
     */
    const scrollToItem = (index) => {
      const list = listRef.value

      if (list) {
        list.scrollToItem(index)
      }
    }

    const resetScrollTop = () => {
      const list = listRef.value

      if (list) {
        list.resetScrollTop()
      }
    }

    expose({
      listRef,
      // isSized,

      isItemDisabled,
      isItemHovering,
      isItemSelected,
      scrollToItem,
      resetScrollTop,
    })

    // computed
    const onForward = () => {
      select.onKeyboardNavigate('forward')
    }

    const onBackward = () => {
      select.onKeyboardNavigate('backward')
    }

    const onEscOrTab = () => {
      select.expanded = false
    }

    /**
     * @param {KeyboardEvent} evt
     */
    const onKeydown = (evt) => {
      const { code } = evt
      const { tab, esc, down, up, enter } = EVENT_CODE

      if (code !== tab) {
        evt.preventDefault()
        evt.stopPropagation()
      }

      switch (code) {
        case tab:
        case esc: {
          onEscOrTab()
          break
        }
        case down: {
          onForward()
          break
        }
        case up: {
          onBackward()
          break
        }
        case enter: {
          select.onKeyboardSelect()
          break
        }
        default:
        // no default
      }
    }

    const Item = (itemProps) => {
      const { index, data, style } = itemProps
      const { itemSize } = unref(listProps)
      const { modelValue } = select.props
      const { onSelect, onHover } = select
      const item = data[index]

      if (item.type === 'Group') {
        // @ts-ignore
        return (
          <NGroupItem item={item} style={style} height={isNumber(itemSize) ? itemSize : cachedHeights.value[index]} />
        )
      }

      const isSelected = isItemSelected(modelValue, item)
      const isDisabled = isItemDisabled(modelValue, isSelected)
      const isHovering = isItemHovering(index)

      return (
        <NOptionItem
          {...itemProps}
          selected={isSelected}
          disabled={item.disabled || isDisabled}
          created={!!item.created}
          hovering={isHovering}
          item={item}
          onSelect={onSelect}
          onHover={onHover}
        >
          {{
            default: (optionProps) => (slots.default ? slots.default(optionProps) : <span>{item.label}</span>),
          }}
        </NOptionItem>
      )
    }

    return () => {
      if (props.data.length === 0) {
        return (
          <div
            class={ns.b('dropdown')}
            style={{
              width: `${props.width}px`,
            }}
          >
            {slots.empty?.()}
          </div>
        )
      }

      const List = NVirtualList

      return (
        <div class={[ns.b('dropdown'), ns.is('multiple', select.props.multiple)]}>
          <List
            ref={listRef}
            {...unref(listProps)}
            className={ns.be('dropdown', 'list-wrapper')}
            innerElement="ul"
            scrollbarAlwaysOn={select.props.scrollbarAlwaysOn}
            data={props.data}
            height={select.props.height}
            width={props.width}
            // @ts-ignore - dts problem
            onKeydown={onKeydown}
          >
            {{
              default: (scope) => <Item {...scope} />,
            }}
          </List>
        </div>
      )
    }
  },
})
