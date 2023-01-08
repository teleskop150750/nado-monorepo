<!-- eslint-disable no-use-before-define -->
<script setup>
import { onClickOutside } from '@vueuse/core'
import { isArray, isEqual } from 'lodash-unified'
import { computed, inject, nextTick, provide, ref, unref, watch } from 'vue'

import { EVENT_CODE } from '../../../constants/index.js'
import { useFormItem, useLocale, useNamespace, useSize } from '../../../hooks/index.js'
import { NIconCalendar, NIconWatch } from '../../../icons/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../tokens/index.js'
import { debugWarn } from '../../../utils/error.js'
import { NInput } from '../../input/index.js'
import { NTooltip } from '../../tooltip/index.js'
import { timePickerDefaultProps } from './time-picker-default-props.js'
import { POPPER_OPTIONS_INJECTION_KEY } from './tokens.js'
import { formatter, parseDate, valueEquals } from './utils.js'

const props = defineProps(timePickerDefaultProps)
const emit = defineEmits([
  'update:modelValue',
  'change',
  'focus',
  'blur',
  'calendar-change',
  'panel-change',
  'visible-change',
  'keydown',
])
const { lang } = useLocale()
// Date object and string

defineOptions({
  name: 'NPicker',
})

const nsDateTime = useNamespace('date-time-picker')
const nsDateTimeRange = useNamespace('date-time-range')
const nsInput = useNamespace('input')
// const nsDateTime = useNamespace('date')
// const nsInput = useNamespace('input')
// const nsDateTimeRange = useNamespace('range')

const { form, formItem } = useFormItem()
const elPopperOptions = inject(POPPER_OPTIONS_INJECTION_KEY)

const popperRef = ref()
const inputRef = ref()
const pickerVisible = ref(false)
const pickerActualVisible = ref(false)
const isClearing = ref(false)
const valueOnOpen = ref(null)

let hasJustTabExitedInput = false
let ignoreFocusEvent = false

/** @type {import('vue').Ref<any>} */
const pickerOptions = ref({})
const userInput = ref(null)

watch(pickerVisible, (val) => {
  if (!val) {
    userInput.value = null
    nextTick(() => {
      emitChange(props.modelValue)
    })
  } else {
    nextTick(() => {
      if (val) {
        valueOnOpen.value = props.modelValue
      }
    })
  }
})

/**
 * @param {any} val
 * @param {any} [isClear]
 */
const emitChange = (val, isClear = undefined) => {
  // determine user real change only
  if (isClear || !valueEquals(val, valueOnOpen.value)) {
    emit('change', val)
    props.validateEvent && formItem?.validate('change').catch((error) => debugWarn(error))
  }
}
const emitInput = (input) => {
  // @ts-ignore
  if (!valueEquals(props.modelValue, input)) {
    let formatted

    if (isArray(input)) {
      formatted = input.map((item) => formatter(item, props.valueFormat, lang))
    } else if (input) {
      formatted = formatter(input, props.valueFormat, lang)
    }

    emit('update:modelValue', input ? formatted : input, lang)
  }
}
/**
 * @param {KeyboardEvent} evt
 */
const emitKeydown = (evt) => {
  emit('keydown', evt)
}

const refInput = computed(() => {
  if (inputRef.value) {
    const _r = isRangeInput.value ? inputRef.value : inputRef.value.$el

    return [..._r.querySelectorAll('input')]
  }

  return []
})

/**
 * @param {number} start
 * @param {number} end
 * @param {'min' | 'max'} [pos]
 */
const setSelectionRange = (start, end, pos) => {
  const _inputs = refInput.value

  if (_inputs.length === 0) {
    return
  }

  if (!pos || pos === 'min') {
    _inputs[0].setSelectionRange(start, end)
    _inputs[0].focus()
  } else if (pos === 'max') {
    _inputs[1].setSelectionRange(start, end)
    _inputs[1].focus()
  }
}
const focusOnInputBox = () => {
  focus(true, true)
  nextTick(() => {
    ignoreFocusEvent = false
  })
}

/**
 * @param {any} date
 * @param {boolean} visible
 */
const onPick = (date, visible = false) => {
  if (!visible) {
    ignoreFocusEvent = true
  }

  pickerVisible.value = visible
  let result

  if (isArray(date)) {
    result = date.map((_) => _.toDate())
  } else {
    // clear btn emit null
    result = date ? date.toDate() : date || ''
  }

  // @ts-ignore
  userInput.value = null
  emitInput(result)
}

const onBeforeShow = () => {
  pickerActualVisible.value = true
}

const onShow = () => {
  emit('visible-change', true)
}

/**
 * @param {KeyboardEvent} evt
 */
const onKeydownPopperContent = (evt) => {
  if (evt?.key === EVENT_CODE.esc) {
    focus(true, true)
  }
}

const onHide = () => {
  pickerActualVisible.value = false
  pickerVisible.value = false
  ignoreFocusEvent = false
  emit('visible-change', false)
  isClearing.value = false
}

const handleOpen = () => {
  pickerVisible.value = true
}

const handleClose = () => {
  pickerVisible.value = false
}

const focus = (focusStartInput = true, isIgnoreFocusEvent = false) => {
  ignoreFocusEvent = isIgnoreFocusEvent
  const [leftInput, rightInput] = unref(refInput)
  let input = leftInput

  // eslint-disable-next-line no-use-before-define
  if (!focusStartInput && isRangeInput.value) {
    input = rightInput
  }

  if (input) {
    input.focus()
  }
}

/**
 * @param {FocusEvent} [evt]
 */
const handleFocusInput = (evt) => {
  if (props.readonly || pickerDisabled.value || pickerVisible.value || ignoreFocusEvent) {
    return
  }

  pickerVisible.value = true
  emit('focus', evt)
}

/**
 * @type {(() => Promise<void> | undefined) | undefined}
 */
let currentHandleBlurDeferCallback = undefined

// Проверьте, находится ли document.activeElement внутри popper или любого другого ввода перед закрытием popper
/**
 * @param {FocusEvent} evt
 */
const handleBlurInput = (evt) => {
  const handleBlurDefer = async () => {
    setTimeout(() => {
      if (currentHandleBlurDeferCallback === handleBlurDefer) {
        if (
          !(popperRef.value?.isFocusInsideContent() && !hasJustTabExitedInput) &&
          refInput.value.filter((input) => input.contains(document.activeElement)).length === 0
        ) {
          // TODO Костыль NBasicTimeSpinner
          // При сбросе с открытым пикером, он снова открывается, так как срабатывает scroll на spinner
          if (pickerVisible.value) {
            isClearing.value = true
          }

          handleChange()
          pickerVisible.value = false
          emit('blur', evt)
          props.validateEvent && formItem?.validate('blur').catch((error) => debugWarn(error))
        }

        hasJustTabExitedInput = false
      }
    }, 0)
  }

  currentHandleBlurDeferCallback = handleBlurDefer
  handleBlurDefer()
}

const pickerDisabled = computed(() => Boolean(props.disabled) || Boolean(form?.disabled))

const parsedValue = computed(() => {
  let dayOrDays

  if (valueIsEmpty.value) {
    // @ts-ignore
    if (pickerOptions.value.getDefaultValue) {
      // @ts-ignore
      dayOrDays = pickerOptions.value.getDefaultValue()
    }
  } else if (isArray(props.modelValue)) {
    dayOrDays = props.modelValue.map((d) => parseDate(d, props.valueFormat, lang))
  } else {
    dayOrDays = parseDate(props.modelValue, props.valueFormat, lang)
  }

  // @ts-ignore
  if (pickerOptions.value.getRangeAvailableTime) {
    // @ts-ignore
    const availableResult = pickerOptions.value.getRangeAvailableTime(dayOrDays)

    if (!isEqual(availableResult, dayOrDays)) {
      dayOrDays = availableResult
      emitInput(isArray(dayOrDays) ? dayOrDays.map((_) => _.toDate()) : dayOrDays.toDate())
    }
  }

  if (isArray(dayOrDays) && dayOrDays.some((day) => !day)) {
    dayOrDays = []
  }

  return dayOrDays
})

const displayValue = computed(() => {
  // @ts-ignore
  if (!pickerOptions.value.panelReady) {
    return ''
  }

  const formattedValue = formatDayjsToString(parsedValue.value)

  if (isArray(userInput.value)) {
    return [
      userInput.value[0] || (formattedValue && formattedValue[0]) || '',
      userInput.value[1] || (formattedValue && formattedValue[1]) || '',
    ]
  }

  if (userInput.value !== null) {
    return userInput.value
  }

  if (!isTimePicker.value && valueIsEmpty.value) {
    return ''
  }

  if (!pickerVisible.value && valueIsEmpty.value) {
    return ''
  }

  if (formattedValue) {
    return isDatesPicker.value ? formattedValue.join(', ') : formattedValue
  }

  return ''
})

const isTimeLikePicker = computed(() => props.type.includes('time'))

const isTimePicker = computed(() => props.type.startsWith('time'))

const isDatesPicker = computed(() => props.type === 'dates')

// @ts-ignore
const triggerIcon = computed(() => props.prefixIcon || (isTimeLikePicker.value ? NIconWatch : NIconCalendar))

const showClose = ref(false)

/**
 * @param {MouseEvent} event
 */
const onClearIconClick = (event) => {
  if (props.readonly || pickerDisabled.value) {
    return
  }

  if (showClose.value) {
    event.stopPropagation()
    focusOnInputBox()
    emitInput(null)
    emitChange(null, true)
    showClose.value = false
    pickerVisible.value = false
    // @ts-ignore
    pickerOptions.value.handleClear && pickerOptions.value.handleClear()
  }
}

const valueIsEmpty = computed(() => {
  const { modelValue } = props

  return !modelValue || (isArray(modelValue) && modelValue.filter(Boolean).length === 0)
})

/**
 * @param {MouseEvent} evt
 */
const onMouseDownInput = async (evt) => {
  if (props.readonly || pickerDisabled.value) {
    return
  }

  // @ts-ignore
  if (evt.target?.tagName !== 'INPUT' || refInput.value.includes(document.activeElement)) {
    pickerVisible.value = true
  }
}

const onMouseEnter = () => {
  if (props.readonly || pickerDisabled.value) {
    return
  }

  if (!valueIsEmpty.value && props.clearable) {
    showClose.value = true
  }
}

const onMouseLeave = () => {
  showClose.value = false
}
/**
 * @param {TouchEvent} event
 */
const onTouchStartInput = (event) => {
  if (props.readonly || pickerDisabled.value) {
    return
  }

  // @ts-ignore
  if (event.touches[0].target?.tagName !== 'INPUT' || refInput.value.includes(document.activeElement)) {
    pickerVisible.value = true
  }
}

const isRangeInput = computed(() => props.type.includes('range'))

const pickerSize = useSize()

const popperEl = computed(() => unref(popperRef)?.popperRef?.contentRef)
const actualInputRef = computed(() => {
  if (unref(isRangeInput)) {
    return unref(inputRef)
  }

  return unref(inputRef)?.$el
})

onClickOutside(actualInputRef, (evt) => {
  const unRefedPopperEl = unref(popperEl)
  const inputEl = unref(actualInputRef)

  if (
    (unRefedPopperEl && (evt.target === unRefedPopperEl || evt.composedPath().includes(unRefedPopperEl))) ||
    evt.target === inputEl ||
    evt.composedPath().includes(inputEl)
  ) {
    return
  }

  pickerVisible.value = false
})

const handleChange = () => {
  if (userInput.value) {
    const value = parseUserInputToDayjs(displayValue.value)

    if (value && isValidValue(value)) {
      emitInput(isArray(value) ? value.map((_) => _.toDate()) : value.toDate())
      userInput.value = null
    }
  }

  if (userInput.value === '') {
    emitInput(null)
    emitChange(null)
    userInput.value = null
  }
}

const parseUserInputToDayjs = (value) => {
  if (!value) {
    return null
  }

  // @ts-ignore
  return pickerOptions.value.parseUserInput(value)
}

const formatDayjsToString = (value) => {
  if (!value) {
    return null
  }

  // @ts-ignore
  return pickerOptions.value.formatToString(value)
}

// @ts-ignore
const isValidValue = (value) => pickerOptions.value.isValidValue(value)

/**
 * @param {KeyboardEvent} evt
 */
const handleKeydownInput = async (evt) => {
  if (props.readonly || pickerDisabled.value) {
    return
  }

  const { code } = evt

  emitKeydown(evt)

  if (code === EVENT_CODE.esc) {
    if (pickerVisible.value === true) {
      pickerVisible.value = false
      evt.preventDefault()
      evt.stopPropagation()
    }

    return
  }

  if (code === EVENT_CODE.down) {
    // @ts-ignore

    if (pickerOptions.value.handleFocusPicker) {
      evt.preventDefault()
      evt.stopPropagation()
    }

    if (pickerVisible.value === false) {
      pickerVisible.value = true
      await nextTick()
    }

    // @ts-ignore
    if (pickerOptions.value.handleFocusPicker) {
      // @ts-ignore
      pickerOptions.value.handleFocusPicker()

      return
    }
  }

  if (code === EVENT_CODE.tab) {
    hasJustTabExitedInput = true

    return
  }

  if (code === EVENT_CODE.enter || code === EVENT_CODE.numpadEnter) {
    if (userInput.value === null || userInput.value === '' || isValidValue(parseUserInputToDayjs(displayValue.value))) {
      handleChange()
      // eslint-disable-next-line require-atomic-updates
      pickerVisible.value = false
    }

    evt.stopPropagation()

    return
  }

  // if user is typing, do not let picker handle key input
  if (userInput.value) {
    evt.stopPropagation()

    return
  }

  // @ts-ignore
  if (pickerOptions.value.handleKeydownInput) {
    // @ts-ignore
    pickerOptions.value.handleKeydownInput(evt)
  }
}
/**
 * @param {string} evt
 */
const onUserInput = (evt) => {
  userInput.value = evt

  // Temporary fix when the picker is dismissed and the input box
  // is focused, just mimic the behavior of antdesign.
  if (!pickerVisible.value) {
    pickerVisible.value = true
  }
}

/**
 * @param {Event} event
 */
const handleStartInput = (event) => {
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const { target } = event

  userInput.value = userInput.value ? [target.value, userInput.value[1]] : [target.value, null]
}

/**
 * @param {Event} event
 */
const handleEndInput = (event) => {
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const { target } = event

  userInput.value = userInput.value ? [userInput.value[0], target.value] : [null, target.value]
}

const handleStartChange = () => {
  const values = userInput.value
  const value = parseUserInputToDayjs(values && values[0])
  const parsedVal = unref(parsedValue)

  if (value && value.isValid()) {
    userInput.value = [formatDayjsToString(value), displayValue.value?.[1] || null]
    const newValue = [value, parsedVal && (parsedVal[1] || null)]

    if (isValidValue(newValue)) {
      emitInput(newValue)
      userInput.value = null
    }
  }
}

const handleEndChange = () => {
  const values = unref(userInput)
  const value = parseUserInputToDayjs(values && values[1])
  const parsedVal = unref(parsedValue)

  if (value && value.isValid()) {
    userInput.value = [unref(displayValue)?.[0] || null, formatDayjsToString(value)]
    const newValue = [parsedVal && parsedVal[0], value]

    if (isValidValue(newValue)) {
      emitInput(newValue)
      userInput.value = null
    }
  }
}

const onSetPickerOption = (evt) => {
  // eslint-disable-next-line prefer-destructuring
  pickerOptions.value[evt[0]] = evt[1]
  // @ts-ignore
  pickerOptions.value.panelReady = true
}

const onCalendarChange = (evt) => {
  emit('calendar-change', evt)
}

/**
 *
 * @param {*} value
 * @param {'month' | 'year'} mode
 * @param {*} view
 */
const onPanelChange = (value, mode, view) => {
  emit('panel-change', value, mode, view)
}

provide(PICKER_BASE_INJECTION_KEY, {
  props,
  isClearing,
})

/** @type {import('vue').ComputedRef<string>} */
// @ts-ignore
const inputId1 = computed(() => props.id && props.id[0])
/** @type {import('vue').ComputedRef<string>} */
// @ts-ignore
const inputId2 = computed(() => props.id && props.id[1])
/** @type {import('vue').ComputedRef<string>} */
// @ts-ignore
const inputName1 = computed(() => props.id && props.id[1])
/** @type {import('vue').ComputedRef<string>} */
// @ts-ignore
const inputName2 = computed(() => props.id && props.id[1])

defineExpose({
  /**
   * @description focus input box.
   */
  focus,
  /**
   * @description emit focus event
   */
  handleFocusInput,
  /**
   * @description emit blur event
   */
  handleBlurInput,
  /**
   * @description opens picker
   */
  handleOpen,
  /**
   * @description closes picker
   */
  handleClose,
  /**
   * @description pick item manually
   */
  onPick,
})
</script>

<template>
  <NTooltip
    ref="popperRef"
    :show-arrow="false"
    :visible="pickerVisible"
    effect="light"
    pure
    trigger="click"
    v-bind="$attrs"
    role="dialog"
    teleported
    :transition="`${nsDateTime.namespace}-zoom-in-top`"
    :popper-class="[nsDateTime.e('popper'), popperClass]"
    :popper-options="elPopperOptions"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
    :gpu-acceleration="false"
    :stop-popper-mouse-event="false"
    :hide-after="0"
    persistent
    @before-show="onBeforeShow"
    @show="onShow"
    @hide="onHide"
  >
    <template #default>
      <NInput
        v-if="!isRangeInput"
        :id="id"
        ref="inputRef"
        container-role="combobox"
        :model-value="displayValue"
        :name="name"
        :size="pickerSize"
        :disabled="pickerDisabled"
        :placeholder="placeholder"
        :class="[nsDateTime.b(), nsDateTime.m(`type-${type}`), $attrs.class]"
        :style="$attrs.style"
        :readonly="!editable || readonly || isDatesPicker || type === 'week'"
        :label="label"
        :tabindex="tabindex"
        :validate-event="false"
        @input="onUserInput"
        @focus="handleFocusInput"
        @blur="handleBlurInput"
        @keydown="handleKeydownInput"
        @change="handleChange"
        @mousedown="onMouseDownInput"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchstart="onTouchStartInput"
        @click.stop
      >
        <template #prefix>
          <span
            v-if="triggerIcon"
            :class="nsInput.e('icon')"
            @mousedown.prevent="onMouseDownInput"
            @touchstart="onTouchStartInput"
          >
            <component :is="triggerIcon" />
          </span>
        </template>
        <template #suffix>
          <span
            v-if="showClose && clearIcon"
            :class="[nsInput.e('icon'), nsDateTime.e('clear')]"
            @click.stop="onClearIconClick"
          >
            <component :is="clearIcon" />
          </span>
        </template>
      </NInput>
      <div
        v-else
        ref="inputRef"
        :class="[
          nsDateTime.m(`type-${type}`),
          nsDateTimeRange.is('disabled', pickerDisabled),
          nsDateTimeRange.is('focus', pickerVisible),
          nsDateTimeRange.b(),
          pickerSize ? nsDateTimeRange.m(`size-${pickerSize}`) : '',
          $attrs.class,
        ]"
        :style="[
          // @ts-ignore
          $attrs.style,
        ]"
        @click="handleFocusInput"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchstart="onTouchStartInput"
        @keydown="handleKeydownInput"
      >
        <span
          v-if="triggerIcon"
          :class="[nsInput.e('icon'), nsDateTimeRange.e('icon')]"
          @mousedown.prevent="onMouseDownInput"
          @touchstart="onTouchStartInput"
        >
          <component :is="triggerIcon" />
        </span>
        <input
          :id="inputId1"
          autocomplete="off"
          :name="inputName1"
          :placeholder="startPlaceholder"
          :value="displayValue && displayValue[0]"
          :disabled="pickerDisabled"
          :readonly="!editable || readonly"
          :class="nsDateTimeRange.e('input')"
          @mousedown="onMouseDownInput"
          @input="handleStartInput"
          @change="handleStartChange"
          @focus="handleFocusInput"
          @blur="handleBlurInput"
        />
        <slot name="range-separator">
          <span :class="nsDateTimeRange.e('separator')">{{ rangeSeparator }}</span>
        </slot>
        <input
          :id="inputId2"
          autocomplete="off"
          :name="inputName2"
          :placeholder="endPlaceholder"
          :value="displayValue && displayValue[1]"
          :disabled="pickerDisabled"
          :readonly="!editable || readonly"
          :class="nsDateTimeRange.e('input')"
          @mousedown="onMouseDownInput"
          @focus="handleFocusInput"
          @blur="handleBlurInput"
          @input="handleEndInput"
          @change="handleEndChange"
        />
        <span
          :class="[
            nsInput.e('icon'),
            nsDateTimeRange.e('clear'),
            {
              [nsDateTimeRange.e('clear--hidden')]: !showClose,
            },
          ]"
          @click="onClearIconClick"
        >
          <component :is="clearIcon" />
        </span>
      </div>
    </template>
    <template #content>
      <slot
        :visible="pickerVisible"
        :actual-visible="pickerActualVisible"
        :parsed-value="parsedValue"
        :format="format"
        :unlink-panels="unlinkPanels"
        :type="type"
        :default-value="defaultValue"
        @pick="onPick"
        @select-range="setSelectionRange"
        @set-picker-option="onSetPickerOption"
        @calendar-change="onCalendarChange"
        @panel-change="onPanelChange"
        @keydown="onKeydownPopperContent"
        @mousedown.stop
      />
    </template>
  </NTooltip>
</template>
