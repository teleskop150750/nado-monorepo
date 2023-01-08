import { getCurrentInstance, nextTick, onBeforeUnmount, reactive, toRefs } from 'vue'

import { useNamespace, useRender } from '../../../hooks/index.js'
import { createComponent, hSlot, stop } from '../../../utils/index.js'
import { optionProps } from './optionProps.js'
import { useOption } from './useOption.js'

export const NOption = createComponent({
  name: 'NOption',

  props: optionProps,
  setup(props, { slots }) {
    const ns = useNamespace('select')
    const states = reactive({
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false,
    })
    const { currentLabel, itemSelected, isDisabled, select, hoverItem } = useOption(props, states)

    const { visible, hover } = toRefs(states)

    /** @type {import('../../../tokens/select.js').SelectOptionProxy} */
    // @ts-ignore
    const vm = getCurrentInstance().proxy

    select.onOptionCreate(vm)

    onBeforeUnmount(() => {
      const key = vm.value
      const { selected } = select
      const selectedOptions = select.props.multiple ? selected : [selected]
      const doesSelected = selectedOptions.some((item) => item.value === vm.value)

      // if option is not selected, remove it from cache
      nextTick(() => {
        // eslint-disable-next-line unicorn/consistent-destructuring
        if (select.cachedOptions.get(key) === vm && !doesSelected) {
          // eslint-disable-next-line unicorn/consistent-destructuring
          select.cachedOptions.delete(key)
        }
      })

      select.onOptionDestroy(key, vm)
    })

    /** @param {Event} evt */
    function selectOptionClick(evt) {
      stop(evt)

      if (props.disabled !== true && states.groupDisabled !== true) {
        select.handleOptionSelect(vm, true)
      }
    }

    useRender(() => (
      <li
        v-show={visible.value}
        class={[
          ns.be('dropdown', 'item'),
          ns.beIs('dropdown', 'item', 'disabled', isDisabled.value),
          ns.beIs('dropdown', 'item', 'selected', itemSelected.value),
          ns.beIs('dropdown', 'item', 'hover', hover.value),
        ]}
        onMouseenter={hoverItem}
        onClick={selectOptionClick}
      >
        {hSlot(slots.default, <span>{currentLabel.value}</span>)}
      </li>
    ))

    return {
      ns,
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      hoverItem,
      visible,
      hover,
      selectOptionClick,
      states,
    }
  },
})
