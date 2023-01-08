<script>
import { computed, defineComponent, inject } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { useNamespace } from '../../../hooks/index.js'
import { composeEventHandlers, composeRefs } from '../../../utils/index.js'
import { COLLECTION_ITEM_SIGN } from '../../collection/index.js'
import {
  ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY,
  ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
} from '../../roving-focus-group/index.js'
import { DROPDOWN_COLLECTION_ITEM_INJECTION_KEY, dropdownItemProps } from './dropdown.js'
import { DROPDOWN_INJECTION_KEY } from './tokens.js'

export default defineComponent({
  name: 'DropdownItemImpl',
  props: dropdownItemProps,
  emits: ['pointermove', 'pointerleave', 'click', 'clickimpl'],
  setup(_, { emit }) {
    const ns = useNamespace('dropdown')

    const { role: menuRole } = inject(DROPDOWN_INJECTION_KEY, undefined)

    const { collectionItemRef: dropdownCollectionItemRef } = inject(DROPDOWN_COLLECTION_ITEM_INJECTION_KEY, undefined)

    const { collectionItemRef: rovingFocusCollectionItemRef } = inject(
      ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
      undefined,
    )

    const {
      rovingFocusGroupItemRef,
      tabIndex,
      handleFocus,
      handleKeydown: handleItemKeydown,
      handleMousedown,
    } = inject(ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY, undefined)

    const itemRef = composeRefs(dropdownCollectionItemRef, rovingFocusCollectionItemRef, rovingFocusGroupItemRef)

    const role = computed(() => {
      if (menuRole.value === 'menu') {
        return 'menuitem'
      }

      if (menuRole.value === 'navigation') {
        return 'link'
      }

      return 'button'
    })

    const handleKeydown = composeEventHandlers((evt) => {
      // @ts-ignore
      const { code } = evt

      if (code === EVENT_CODE.enter || code === EVENT_CODE.space) {
        evt.preventDefault()
        evt.stopImmediatePropagation()
        emit('clickimpl', evt)

        return true
      }
    }, handleItemKeydown)

    return {
      ns,
      itemRef,
      dataset: {
        [COLLECTION_ITEM_SIGN]: '',
      },
      role,
      tabIndex,
      handleFocus,
      handleKeydown,
      handleMousedown,
    }
  },
})
</script>

<template>
  <li v-if="divided" role="separator" :class="ns.bem('menu', 'item', 'divided')" v-bind="$attrs" />
  <li
    :ref="itemRef"
    v-bind="{ ...dataset, ...$attrs }"
    :aria-disabled="disabled"
    :class="[ns.be('menu', 'item'), ns.beIs('menu', 'item', 'disabled', disabled)]"
    :tabindex="tabIndex"
    :role="role"
    @click="(e) => $emit('clickimpl', e)"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @mousedown="handleMousedown"
    @pointermove="(e) => $emit('pointermove', e)"
    @pointerleave="(e) => $emit('pointerleave', e)"
  >
    <span v-if="icon" class="n-icon"><component :is="icon" /></span>
    <slot />
  </li>
</template>
