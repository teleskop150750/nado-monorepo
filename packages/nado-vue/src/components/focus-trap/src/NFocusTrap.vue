<script setup>
import { isNil } from 'lodash-unified'
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, provide, ref, unref, watch } from 'vue'

import { EVENT_CODE } from '../../../constants/index.js'
import { useEscapeKeydown } from '../../../hooks/index.js'
import { isString } from '../../../utils/index.js'
import { focusTrapProps } from './props.js'
import {
  FOCUS_AFTER_ACTIVATE,
  FOCUS_AFTER_ACTIVATE_OPTS,
  FOCUS_AFTER_DEACTIVATE,
  FOCUS_TRAP_INJECTION_KEY,
  ON_AFTER_ACTIVATE,
  ON_AFTER_DEACTIVATE,
} from './tokens.js'
import {
  createFocusOutPreventedEvent,
  focusableStack,
  focusFirstDescendant,
  getAllFocusableElements,
  getEdges,
  isFocusCausedByUserEvent,
  tryFocus,
  useFocusReason,
} from './utils.js'

const props = defineProps(focusTrapProps)

const emit = defineEmits([
  ON_AFTER_ACTIVATE,
  ON_AFTER_DEACTIVATE,
  'focusin',
  'focusout',
  'focusout-prevented',
  'escape',
])

defineOptions({
  name: 'NFocusTrap',
  inheritAttrs: false,
})

const containerRef = ref()
let stopWatchTrapped = undefined
let lastFocusOutTrapped = undefined
let lastFocusInTrapped = undefined

const { focusReason } = useFocusReason()
const focusLayer = {
  paused: false,
  pause() {
    this.paused = true
  },
  play() {
    this.paused = false
  },
}

useEscapeKeydown((event) => {
  if (props.trapped && !focusLayer.paused) {
    emit('escape', event)
  }
})

provide(FOCUS_TRAP_INJECTION_KEY, {
  focusTrapRef: containerRef,
  onKeydown: handleKeydown,
})

watch(
  () => props.focusTrapEl,
  (focusTrapEl) => {
    if (focusTrapEl) {
      containerRef.value = focusTrapEl
    }
  },
  { immediate: true },
)

/**
 * @param {KeyboardEvent} evt
 */
function handleKeydown(evt) {
  const { loop, trapped } = props

  if (!loop && !trapped) {
    return
  }

  if (focusLayer.paused) {
    return
  }

  const { key, altKey, ctrlKey, metaKey, currentTarget: container, shiftKey } = evt

  const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey

  const currentFocusingEl = document.activeElement

  if (!isTabbing || !currentFocusingEl) {
    return
  }

  // @ts-ignore
  const [first, last] = getEdges(container)
  const isTabbable = first && last

  if (!isTabbable) {
    if (currentFocusingEl === container) {
      const focusoutPreventedEvent = createFocusOutPreventedEvent({
        focusReason: focusReason.value,
      })

      emit('focusout-prevented', focusoutPreventedEvent)

      if (!focusoutPreventedEvent.defaultPrevented) {
        evt.preventDefault()
      }
    }
  } else if (!shiftKey && currentFocusingEl === last) {
    const focusoutPreventedEvent = createFocusOutPreventedEvent({
      focusReason: focusReason.value,
    })

    emit('focusout-prevented', focusoutPreventedEvent)

    if (!focusoutPreventedEvent.defaultPrevented) {
      evt.preventDefault()

      if (loop) {
        tryFocus(first, true)
      }
    }
  } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
    const focusoutPreventedEvent = createFocusOutPreventedEvent({
      focusReason: focusReason.value,
    })

    emit('focusout-prevented', focusoutPreventedEvent)

    if (!focusoutPreventedEvent.defaultPrevented) {
      evt.preventDefault()

      if (loop) {
        tryFocus(last, true)
      }
    }
  }
}

function handleAfterActivate(evt) {
  emit(ON_AFTER_ACTIVATE, evt)
}

function handleAfterDeactivate(evt) {
  emit(ON_AFTER_DEACTIVATE, evt)
}

function handleFocusIn(evt) {
  const trapContainer = unref(containerRef)

  if (!trapContainer) {
    return
  }

  const { target } = evt
  const { relatedTarget } = evt

  if (!props.trapped) {
    const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget)

    if (!isPrevFocusedInTrap) {
      lastFocusOutTrapped = relatedTarget
    }
  }

  const isFocusedInTrap = target && trapContainer.contains(target)

  if (isFocusedInTrap) {
    emit('focusin', evt)
  }

  if (focusLayer.paused || !props.trapped) {
    return
  }

  if (isFocusedInTrap) {
    lastFocusInTrapped = target
  } else {
    tryFocus(lastFocusInTrapped, true)
  }
}

/**
 * @param {FocusEvent} evt
 */
function handleFocusOut(evt) {
  const trapContainer = unref(containerRef)

  if (focusLayer.paused || !trapContainer) {
    return
  }

  if (props.trapped) {
    const { relatedTarget } = evt

    if (isNil(relatedTarget) || trapContainer.contains(relatedTarget)) {
      return
    }

    // Дайте встроенному слою фокусировки время приостановить этот слой перед восстановлением фокуса
    // И восстанавливать фокус только в том случае, если в данный момент он должен быть захвачен
    setTimeout(() => {
      if (focusLayer.paused || !props.trapped) {
        return
      }

      const focusoutPreventedEvent = createFocusOutPreventedEvent({
        focusReason: focusReason.value,
      })

      emit('focusout-prevented', focusoutPreventedEvent)

      if (!focusoutPreventedEvent.defaultPrevented) {
        tryFocus(lastFocusInTrapped, true)
      }
    }, 0)
  } else {
    const { target } = evt
    const isFocusedInTrap = target && trapContainer.contains(target)

    if (!isFocusedInTrap) {
      emit('focusout', evt)
    }
  }
}

async function activate() {
  // Дождитесь resolve для containerRef
  await nextTick()
  const trapContainer = unref(containerRef)

  if (!trapContainer) {
    return
  }

  focusableStack.push(focusLayer)
  const prevFocusedElement = trapContainer.contains(document.activeElement)
    ? lastFocusOutTrapped
    : document.activeElement

  lastFocusOutTrapped = prevFocusedElement
  const isPrevFocusInTrap = trapContainer.contains(prevFocusedElement)

  if (isPrevFocusInTrap) {
    return
  }

  const focusEvent = new Event(FOCUS_AFTER_ACTIVATE, FOCUS_AFTER_ACTIVATE_OPTS)

  trapContainer.addEventListener(FOCUS_AFTER_ACTIVATE, handleAfterActivate)
  trapContainer.dispatchEvent(focusEvent)

  if (focusEvent.defaultPrevented) {
    return
  }

  nextTick(() => {
    let { focusStartEl } = props

    if (!isString(focusStartEl)) {
      // @ts-ignore
      tryFocus(focusStartEl)

      if (document.activeElement !== focusStartEl) {
        focusStartEl = 'first'
      }
    }

    if (focusStartEl === 'first') {
      focusFirstDescendant(getAllFocusableElements(trapContainer), true)
    }

    if (document.activeElement === prevFocusedElement || focusStartEl === 'container') {
      tryFocus(trapContainer)
    }
  })
}

function deactivate() {
  const trapContainer = unref(containerRef)

  if (trapContainer) {
    trapContainer.removeEventListener(FOCUS_AFTER_ACTIVATE, handleAfterActivate)

    const deactivateEvent = new CustomEvent(FOCUS_AFTER_DEACTIVATE, {
      ...FOCUS_AFTER_ACTIVATE_OPTS,
      detail: {
        focusReason: focusReason.value,
      },
    })

    trapContainer.addEventListener(FOCUS_AFTER_DEACTIVATE, handleAfterDeactivate)
    trapContainer.dispatchEvent(deactivateEvent)

    if (!deactivateEvent.defaultPrevented && (focusReason.value === 'keyboard' || !isFocusCausedByUserEvent())) {
      tryFocus(lastFocusOutTrapped ?? document.body, true)
    }

    trapContainer.removeEventListener(FOCUS_AFTER_DEACTIVATE, handleAfterActivate)
    focusableStack.remove(focusLayer)
  }
}

watch([containerRef], ([val], [oldVal]) => {
  if (val) {
    val.addEventListener('keydown', handleKeydown)
    val.addEventListener('focusin', handleFocusIn)
    val.addEventListener('focusout', handleFocusOut)
  }

  if (oldVal) {
    oldVal.removeEventListener('keydown', handleKeydown)
    oldVal.removeEventListener('focusin', handleFocusIn)
    oldVal.removeEventListener('focusout', handleFocusOut)
  }
})

onMounted(() => {
  if (props.trapped) {
    activate()
  }

  stopWatchTrapped = watch(
    () => props.trapped,
    (trapped) => {
      if (trapped) {
        activate()
      } else {
        deactivate()
      }
    },
  )
})

onBeforeUnmount(() => {
  if (props.trapped) {
    deactivate()
  }
})

onUnmounted(() => {
  stopWatchTrapped()
})
</script>

<template>
  <slot :on-keydown="handleKeydown" />
</template>
