<script>
import { computed, defineComponent, inject, nextTick, provide, ref, unref } from 'vue'

import { EVENT_CODE } from '../../../constants/index.js'
import { useId } from '../../../hooks/index.js'
import { composeEventHandlers } from '../../../utils/index.js'
import {
  NCollectionItem as NRovingFocusCollectionItem,
  ROVING_FOCUS_COLLECTION_INJECTION_KEY,
} from './roving-focus-group.js'
import { ROVING_FOCUS_GROUP_INJECTION_KEY, ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY } from './tokens.js'
import { focusFirst, getFocusIntent, reorderArray } from './utils.js'

export default defineComponent({
  components: {
    NRovingFocusCollectionItem,
  },
  props: {
    focusable: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['mousedown', 'focus', 'keydown'],
  setup(props, { emit }) {
    const { currentTabbedId, loop, onItemFocus, onItemShiftTab } = inject(ROVING_FOCUS_GROUP_INJECTION_KEY, undefined)

    const { getItems } = inject(ROVING_FOCUS_COLLECTION_INJECTION_KEY, undefined)

    const id = useId()
    const rovingFocusGroupItemRef = ref(undefined)

    const handleMousedown = composeEventHandlers(
      (evt) => {
        emit('mousedown', evt)
      },
      (evt) => {
        if (!props.focusable) {
          evt.preventDefault()
        } else {
          onItemFocus(unref(id))
        }
      },
    )

    const handleFocus = composeEventHandlers(
      (evt) => {
        emit('focus', evt)
      },
      () => {
        onItemFocus(unref(id))
      },
    )

    const handleKeydown = composeEventHandlers(
      (evt) => {
        emit('keydown', evt)
      },
      /**
       * @param {KeyboardEvent} evt
       */
      (evt) => {
        const { key, shiftKey, target, currentTarget } = evt

        if (key === EVENT_CODE.tab && shiftKey) {
          onItemShiftTab()

          return
        }

        if (target !== currentTarget) {
          return
        }

        const focusIntent = getFocusIntent(evt)

        if (focusIntent) {
          evt.preventDefault()
          const items = getItems().filter((item) => item.focusable)

          let elements = items.map((item) => item.ref)

          switch (focusIntent) {
            case 'last': {
              elements.reverse()
              break
            }
            case 'prev':
            case 'next': {
              if (focusIntent === 'prev') {
                elements.reverse()
              }

              const currentIdx = elements.indexOf(currentTarget)

              elements = loop.value ? reorderArray(elements, currentIdx + 1) : elements.slice(currentIdx + 1)
              break
            }
            default: {
              break
            }
          }

          nextTick(() => {
            focusFirst(elements)
          })
        }
      },
    )

    const isCurrentTab = computed(() => currentTabbedId.value === unref(id))

    provide(ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY, {
      rovingFocusGroupItemRef,
      tabIndex: computed(() => (unref(isCurrentTab) ? 0 : -1)),
      handleMousedown,
      handleFocus,
      handleKeydown,
    })

    return {
      id,
      handleKeydown,
      handleFocus,
      handleMousedown,
    }
  },
})
</script>

<template>
  <NRovingFocusCollectionItem :id="id" :focusable="focusable" :active="active">
    <slot />
  </NRovingFocusCollectionItem>
</template>
