<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, defineComponent, inject, provide, readonly, ref, toRef, unref, watch } from 'vue'

import { composeEventHandlers } from '../../../utils/index.js'
import { ROVING_FOCUS_COLLECTION_INJECTION_KEY, rovingFocusGroupProps } from './roving-focus-group.js'
import { ROVING_FOCUS_GROUP_INJECTION_KEY } from './tokens.js'
import { focusFirst } from './utils.js'

const CURRENT_TAB_ID_CHANGE_EVT = 'currentTabIdChange'
const ENTRY_FOCUS_EVT = 'rovingFocusGroup.entryFocus'
const EVT_OPTS = undefined

export default defineComponent({
  name: 'NRovingFocusGroupImpl',
  inheritAttrs: false,
  props: rovingFocusGroupProps,
  emits: [CURRENT_TAB_ID_CHANGE_EVT, 'entryFocus'],
  setup(props, { emit }) {
    const currentTabbedId = ref((props.currentTabId || props.defaultCurrentTabId) ?? undefined)
    const isBackingOut = ref(false)
    const isClickFocus = ref(false)
    const rovingFocusGroupRef = ref(undefined)
    const { getItems } = inject(ROVING_FOCUS_COLLECTION_INJECTION_KEY, undefined)
    const rovingFocusGroupRootStyle = computed(() =>
      // casting to any for fix compiler error since HTMLElement.StyleValue does not
      // support CSSProperties
      [
        {
          outline: 'none',
        },
        props.style,
      ],
    )

    const onItemFocus = (tabbedId) => {
      emit(CURRENT_TAB_ID_CHANGE_EVT, tabbedId)
    }

    const onItemShiftTab = () => {
      isBackingOut.value = true
    }

    const onMousedown = composeEventHandlers(
      (evt) => {
        props.onMousedown?.(evt)
      },
      () => {
        isClickFocus.value = true
      },
    )

    const onFocus = composeEventHandlers(
      (evt) => {
        props.onFocus?.(evt)
      },
      (evt) => {
        const isKeyboardFocus = !unref(isClickFocus)
        const { target, currentTarget } = evt

        if (target === currentTarget && isKeyboardFocus && !unref(isBackingOut)) {
          const entryFocusEvt = new Event(ENTRY_FOCUS_EVT, EVT_OPTS)

          currentTarget?.dispatchEvent(entryFocusEvt)

          if (!entryFocusEvt.defaultPrevented) {
            // @ts-ignore
            const items = getItems().filter((item) => item.focusable)
            // @ts-ignore
            const activeItem = items.find((item) => item.active)
            // @ts-ignore
            const currentItem = items.find((item) => item.id === unref(currentTabbedId))
            const candidates = [activeItem, currentItem, ...items].filter(Boolean)
            const candidateNodes = candidates.map((item) => item.ref)

            focusFirst(candidateNodes)
          }
        }

        isClickFocus.value = false
      },
    )

    const onBlur = composeEventHandlers(
      (evt) => {
        props.onBlur?.(evt)
      },
      () => {
        isBackingOut.value = false
      },
    )

    const handleEntryFocus = (...args) => {
      emit('entryFocus', ...args)
    }

    provide(ROVING_FOCUS_GROUP_INJECTION_KEY, {
      currentTabbedId: readonly(currentTabbedId),
      loop: toRef(props, 'loop'),
      tabIndex: computed(() => (unref(isBackingOut) ? -1 : 0)),
      rovingFocusGroupRef,
      rovingFocusGroupRootStyle,
      orientation: toRef(props, 'orientation'),
      dir: toRef(props, 'dir'),
      onItemFocus,
      onItemShiftTab,
      onBlur,
      onFocus,
      onMousedown,
    })

    watch(
      () => props.currentTabId,
      (val) => {
        currentTabbedId.value = val ?? null
      },
    )

    useEventListener(rovingFocusGroupRef, ENTRY_FOCUS_EVT, handleEntryFocus)
  },
})
</script>

<template>
  <slot />
</template>
