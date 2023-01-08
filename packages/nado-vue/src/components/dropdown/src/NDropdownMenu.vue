<script>
import { computed, defineComponent, inject, unref } from 'vue'

import { EVENT_CODE } from '../../../constants/index.js'
import { useNamespace } from '../../../hooks/index.js'
import { composeEventHandlers, composeRefs } from '../../../utils/index.js'
import { FOCUS_TRAP_INJECTION_KEY } from '../../focus-trap/src/tokens.js'
import {
  focusFirst,
  ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  ROVING_FOCUS_GROUP_INJECTION_KEY,
} from '../../roving-focus-group/index.js'
import { DROPDOWN_COLLECTION_INJECTION_KEY, dropdownMenuProps, FIRST_LAST_KEYS, LAST_KEYS } from './dropdown.js'
import { DROPDOWN_INJECTION_KEY } from './tokens.js'
import { useDropdown } from './useDropdown.js'

export default defineComponent({
  name: 'NDropdownMenu',
  props: dropdownMenuProps,
  setup(props) {
    // @ts-ignore
    const ns = useNamespace('dropdown')
    const { _elDropdownSize } = useDropdown()
    const size = _elDropdownSize.value

    // @ts-ignore
    const { focusTrapRef, onKeydown } = inject(FOCUS_TRAP_INJECTION_KEY, undefined)

    const { contentRef, role, triggerId } = inject(DROPDOWN_INJECTION_KEY, undefined)

    const { collectionRef: dropdownCollectionRef, getItems } = inject(DROPDOWN_COLLECTION_INJECTION_KEY, undefined)

    const { rovingFocusGroupRef, rovingFocusGroupRootStyle, tabIndex, onBlur, onFocus, onMousedown } = inject(
      // @ts-ignore
      ROVING_FOCUS_GROUP_INJECTION_KEY,
      undefined,
    )

    // @ts-ignore
    const { collectionRef: rovingFocusGroupCollectionRef } = inject(ROVING_FOCUS_COLLECTION_INJECTION_KEY, undefined)

    const dropdownKls = computed(() => [ns.b('menu'), ns.bm('menu', size?.value)])

    const dropdownListWrapperRef = composeRefs(
      contentRef,
      dropdownCollectionRef,
      focusTrapRef,
      rovingFocusGroupRef,
      rovingFocusGroupCollectionRef,
    )

    const composedKeydown = composeEventHandlers(
      (evt) => {
        props.onKeydown?.(evt)
      },
      (evt) => {
        // @ts-ignore
        const { currentTarget, code, target } = evt
        const items = getItems().filter((item) => !item.disabled)

        const targets = items.map((item) => item.ref)
        // @ts-ignore
        const isKeydownContained = currentTarget.contains(target)

        if (isKeydownContained) {
          // TODO: implement typeahead search
        }

        if (EVENT_CODE.tab === code) {
          evt.stopImmediatePropagation()
        }

        evt.preventDefault()

        if (target !== unref(contentRef)) {
          return
        }

        if (!FIRST_LAST_KEYS.includes(code)) {
          return
        }

        if (LAST_KEYS.includes(code)) {
          targets.reverse()
        }

        focusFirst(targets)
      },
    )

    const handleKeydown = (evt) => {
      composedKeydown(evt)
      onKeydown(evt)
    }

    return {
      size,
      rovingFocusGroupRootStyle,
      tabIndex,
      dropdownKls,
      role,
      triggerId,
      dropdownListWrapperRef,
      handleKeydown,
      onBlur,
      onFocus,
      onMousedown,
    }
  },
})
</script>

<template>
  <ul
    :ref="dropdownListWrapperRef"
    :class="dropdownKls"
    :style="rovingFocusGroupRootStyle"
    :tabindex="-1"
    :role="role"
    :aria-labelledby="triggerId"
    @blur="onBlur"
    @focus="onFocus"
    @keydown="handleKeydown"
    @mousedown="onMousedown"
  >
    <slot />
  </ul>
</template>
