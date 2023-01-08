<script setup>
import { computed, inject, onBeforeUnmount, ref, useSlots } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { useFormItem, useNamespace, useSize } from '../../../hooks/index.js'
import { buttonGroupContextKey } from '../../../tokens/index.js'
import { isKeyCode, listenOptions, prevent, stop, stopAndPrevent } from '../../../utils/index.js'
import { NSpinner } from '../../spinner/index.js'
import { buttonProps } from './props.js'
import { useButton } from './useButton.js'

const props = defineProps(buttonProps)
const emit = defineEmits(['click', 'keydown', 'pointerdown', 'keyup'])

defineOptions({
  name: 'NButton',
})

const buttonGroupContext = inject(buttonGroupContextKey, undefined)

const ns = useNamespace('button')
const nsGroup = useNamespace('button-group')
const size = useSize(computed(() => buttonGroupContext?.size))
const slots = useSlots()
const { form } = useFormItem()
const { disabled, attributes, linkTag, navigateOnClick, actionable } = useButton(props)

const { passiveCapture } = listenOptions
let keyboardTarget = null
let pointerTarget = null
const rootRef = ref(null)
let localPointerTargetElement = null

const hasLabel = computed(() => props.label !== undefined && props.label !== null && props.label !== '')
const hasLabelSlot = computed(() => Boolean(slots.default))
const hasLabelContent = computed(() => hasLabel.value || hasLabelSlot.value)
const appearance = computed(() => props.appearance || buttonGroupContext?.appearance || 'secondary')

const handleEvents = computed(() => {
  if (props.loading === true) {
    return {
      pointerdown: handleLoadingEvent,
      click: handleLoadingEvent,
      keydown: handleKeydown,
      keyup: handleLoadingEvent,
    }
  }

  if (actionable.value === true) {
    return {
      click: handleClick,
      keydown: handleKeydown,
      pointerdown: handlePointerdown,
    }
  }

  return {
    // Необходимо; особенно для отключенных тегов <a>
    click: stopAndPrevent,
  }
})

/**
 * @param {Event} evt
 */
function handleClick(evt) {
  // Is it already destroyed?
  if (rootRef.value === null) {
    return
  }

  if (evt !== undefined) {
    if (evt.defaultPrevented === true) {
      return
    }

    const element = document.activeElement

    // focus button, если ВВОДА был получена из формы
    // предотвратить новую отправку (уже отправлено)
    if (
      props.type === 'submit' &&
      element !== document.body &&
      rootRef.value.contains(element) === false &&
      // Требуется для iOS и настольного Safari
      element.contains(rootRef.value) === false
    ) {
      // rootRef.value.focus()

      const handleClickCleanup = () => {
        document.removeEventListener('keydown', stopAndPrevent, true)
        document.removeEventListener('keyup', handleClickCleanup, passiveCapture)
        rootRef.value !== null && rootRef.value.removeEventListener('blur', handleClickCleanup, passiveCapture)
      }

      document.addEventListener('keydown', stopAndPrevent, true)
      document.addEventListener('keyup', handleClickCleanup, passiveCapture)
      rootRef.value.addEventListener('blur', handleClickCleanup, passiveCapture)
    }
  }

  if (props.type === 'reset') {
    form?.resetFields()
  }

  navigateOnClick(evt)
}

/**
 * @param {KeyboardEvent} evt
 */
function handleKeydown(evt) {
  if (props.loading === true && evt.code !== EVENT_CODE.tab) {
    handleLoadingEvent(evt)

    return
  }

  // Is it already destroyed?
  if (rootRef.value === null) {
    return
  }

  emit('keydown', evt)

  if (isKeyCode(evt, [13, 32]) === true && keyboardTarget !== rootRef.value) {
    keyboardTarget !== null && cleanup()

    if (evt.defaultPrevented !== true) {
      keyboardTarget = rootRef.value
      rootRef.value.classList.add(ns.is('active', true))
      document.addEventListener('keyup', handlePressEnd, true)
      rootRef.value.addEventListener('blur', handlePressEnd, passiveCapture)
    }

    stopAndPrevent(evt)
  }
}

/**
 * @param {PointerEvent} evt
 */
function handlePointerdown(evt) {
  // Is it already destroyed?
  if (rootRef.value === null) {
    return
  }

  emit('pointerdown', evt)

  if (evt.defaultPrevented !== true && pointerTarget !== rootRef.value) {
    rootRef.value.setPointerCapture(evt.pointerId)

    pointerTarget !== null && cleanup()
    pointerTarget = rootRef.value

    localPointerTargetElement = evt.target
    rootRef.value.classList.add(ns.is('active', true))
    localPointerTargetElement.addEventListener('pointercancel', handlePressEnd, passiveCapture)
    document.addEventListener('pointerup', handlePressEnd, passiveCapture)
  }
}

/**
 * @param {KeyboardEvent | PointerEvent} evt
 */
function handlePressEnd(evt) {
  // Is it already destroyed?
  if (rootRef.value === null) {
    return
  }

  if (evt !== undefined && evt.type === 'keyup') {
    if (keyboardTarget === rootRef.value && evt instanceof KeyboardEvent && isKeyCode(evt, [13, 32]) === true) {
      // Для триггера клика
      const mouseEvent = new MouseEvent('click', evt)

      // @ts-ignore
      mouseEvent.nKeyEvent = true
      evt.defaultPrevented === true && prevent(mouseEvent)
      evt.cancelBubble === true && stop(mouseEvent)
      rootRef.value.dispatchEvent(mouseEvent)

      stopAndPrevent(evt)
    }

    emit('keyup', evt)
  }

  cleanup()
}

function cleanup() {
  if (pointerTarget === rootRef.value) {
    if (localPointerTargetElement !== null) {
      localPointerTargetElement.removeEventListener('pointercancel', handlePressEnd, passiveCapture)
      localPointerTargetElement.removeEventListener('pointercancel', handlePressEnd, passiveCapture)
    }

    document.removeEventListener('pointerup', handlePressEnd, passiveCapture)

    pointerTarget = null
    localPointerTargetElement = null
  }

  if (keyboardTarget === rootRef.value) {
    document.removeEventListener('keyup', handlePressEnd, true)
    rootRef.value !== null && rootRef.value.removeEventListener('blur', handlePressEnd, passiveCapture)
    keyboardTarget = null
  }

  if (rootRef.value !== null) {
    rootRef.value.classList.remove(ns.is('active', true))
  }
}

/**
 * @param {Event} evt
 */
function handleLoadingEvent(evt) {
  stopAndPrevent(evt)
}

onBeforeUnmount(() => {
  cleanup()
})

// Expose public methods
defineExpose({
  click: handleClick,
  ref: rootRef,
  disabled,
})
</script>

<template>
  <component
    :is="linkTag"
    ref="rootRef"
    :class="[
      nsGroup.e('item', Boolean(buttonGroupContext)),
      ns.b(),
      ns.m(`appearance-${appearance}`),
      ns.m(`size-${size}`),
      ns.m(`align-${props.align}`),
      ns.is('link', props.link),
      ns.is('plain', props.plain),
      ns.is('hoverable', actionable),
      ns.is('disabled', disabled),
      ns.is('loading', props.loading),
    ]"
    v-bind="attributes"
    v-on="handleEvents"
  >
    <span :class="ns.e('content')">
      <template v-if="icon">
        <component
          :is="icon"
          :class="[ns.e('icon'), hasLabelContent && ns.em('icon', 'left')]"
          role="img"
          aria-hidden="true"
        />
      </template>
      <slot name="icon" :has-label="hasLabelContent" />
      <template v-if="hasLabel">
        <span :class="ns.e('label')">{{ label }}</span>
      </template>
      <slot />
      <template v-if="iconRight">
        <component
          :is="iconRight"
          :class="[ns.e('icon'), hasLabelContent && ns.em('icon', 'right')]"
          role="img"
          aria-hidden="true"
        />
      </template>
      <slot name="icon-right" :has-label="hasLabelContent" />
    </span>
    <template v-if="loading">
      <span :class="ns.e('loading')">
        <NSpinner :class="ns.e('loading-icon')" />
      </span>
    </template>
  </component>
</template>
