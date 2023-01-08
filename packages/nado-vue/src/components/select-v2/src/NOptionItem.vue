<script>
import { computed } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { optionProps } from './optionProps.js'
import { useOption } from './useOption.js'

export default {
  props: optionProps,
  emits: ['select', 'hover'],
  setup(props, { emit }) {
    const ns = useNamespace('select-v2')
    const { hoverItem, selectOptionClick } = useOption(props, { emit })
    const optionClasses = computed(() => [
      ns.be('dropdown', 'item'),
      ns.beIs('dropdown', 'item', 'selected', props.selected),
      ns.beIs('dropdown', 'item', 'disabled', props.disabled),
      ns.beIs('dropdown', 'item', 'created', props.created),
      ns.beIs('dropdown', 'item', 'hover', props.hovering),
    ])
    const handleClick = () => {
      selectOptionClick()
    }

    return {
      ns,
      hoverItem,
      selectOptionClick,
      optionClasses,
      handleClick,
    }
  },
}

// TODO: @mousedown.stop="handleClick"
// @click.stop="handleClick"
</script>

<template>
  <li
    class="n-select-v2-dropdown__item-wrapper"
    :aria-selected="selected"
    :style="style"
    @mouseenter="hoverItem"
    @mousedown.stop="handleClick"
  >
    <div :class="optionClasses">
      <slot :item="item" :index="index" :disabled="disabled">
        <span>{{ item.label }}</span>
      </slot>
    </div>
  </li>
</template>
