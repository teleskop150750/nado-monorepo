<script>
import { computed, defineComponent, getCurrentInstance, inject, ref, unref } from 'vue'

import { composeEventHandlers, whenMouse } from '../../../utils/index.js'
import { NRovingFocusItem } from '../../roving-focus-group/index.js'
import { dropdownItemProps, NCollectionItem as NDropdownCollectionItem } from './dropdown.js'
import NDropdownItemImpl from './NDropdownItemImpl.vue'
import { DROPDOWN_INJECTION_KEY } from './tokens.js'
import { useDropdown } from './useDropdown.js'

export default defineComponent({
  name: 'NDropdownItem',
  components: {
    NDropdownCollectionItem,
    NRovingFocusItem,
    NDropdownItemImpl,
  },
  inheritAttrs: false,
  props: dropdownItemProps,
  emits: ['pointermove', 'pointerleave', 'click'],
  setup(props, { emit, attrs }) {
    const { elDropdown } = useDropdown()
    const _instance = getCurrentInstance()
    const itemRef = ref(null)
    const textContent = computed(() => unref(itemRef)?.textContent ?? '')
    const { onItemEnter, onItemLeave } = inject(DROPDOWN_INJECTION_KEY, undefined)

    const handlePointerMove = composeEventHandlers(
      (evt) => {
        emit('pointermove', evt)

        return evt.defaultPrevented
      },
      whenMouse((evt) => {
        if (props.disabled) {
          onItemLeave(evt)
        } else {
          onItemEnter(evt)

          if (!evt.defaultPrevented) {
            // @ts-ignore
            evt.currentTarget?.focus()
          }
        }
      }),
    )

    const handlePointerLeave = composeEventHandlers(
      (evt) => {
        emit('pointerleave', evt)

        return evt.defaultPrevented
      },
      whenMouse((evt) => {
        onItemLeave(evt)
      }),
    )

    const handleClick = composeEventHandlers(
      (evt) => {
        if (props.disabled) {
          return
        }

        emit('click', evt)

        return evt.type !== 'keydown' && evt.defaultPrevented
      },
      (evt) => {
        if (props.disabled) {
          evt.stopImmediatePropagation()

          return
        }

        if (elDropdown?.hideOnClick?.value) {
          elDropdown.handleClick?.()
        }

        elDropdown.commandHandler?.(props.command, _instance, evt)
      },
    )

    // direct usage of v-bind={ ...$props, ...$attrs } causes type errors
    const propsAndAttrs = computed(() => ({ ...props, ...attrs }))

    return {
      handleClick,
      handlePointerMove,
      handlePointerLeave,
      textContent,
      propsAndAttrs,
    }
  },
})
</script>

<template>
  <NDropdownCollectionItem :disabled="disabled" :text-value="textValue ?? textContent">
    <NRovingFocusItem :focusable="!disabled">
      <NDropdownItemImpl
        v-bind="propsAndAttrs"
        @pointerleave="handlePointerLeave"
        @pointermove="handlePointerMove"
        @clickimpl="handleClick"
      >
        <slot />
      </NDropdownItemImpl>
    </NRovingFocusItem>
  </NDropdownCollectionItem>
</template>
