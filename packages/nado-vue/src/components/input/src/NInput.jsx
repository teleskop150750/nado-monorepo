import { NOOP } from '@vue/shared'
import { isBoolean, isClient, useResizeObserver } from '@vueuse/core'
import { isNil } from 'lodash-unified'
import { computed, nextTick, onMounted, ref, shallowRef, toRef, watch } from 'vue'

import { UPDATE_MODEL_EVENT } from '../../../constants/event.js'
import { useAttrs, useDisabled, useFormItem, useFormItemInputId, useNamespace, useSize } from '../../../hooks/index.js'
import { NIconClose, NIconEye, NIconEyeSlash } from '../../../icons/index.js'
import { createComponent, debugWarn, hSlot, isObject } from '../../../utils/index.js'
import { inputEmits, inputProps } from './props.js'
import { useMask, useMaskProps } from './useMask.js'
import { calcTextareaHeight } from './utils.js'

export const NInput = createComponent({
  name: 'NInput',
  inheritAttrs: false,
  props: { ...useMaskProps, ...inputProps },
  emits: inputEmits,
  setup(props, { slots, emit, attrs: rawAttrs, expose }) {
    let emitCachedValue = Number.NaN
    let stopValueWatcher = false
    const wrapperRef = ref()

    const containerAttrs = computed(() => {
      const comboBoxAttrs = {}

      if (props.containerRole === 'combobox') {
        comboBoxAttrs.ariaHaspopup = rawAttrs['aria-haspopup']
        comboBoxAttrs.ariaOwns = rawAttrs['aria-owns']
        comboBoxAttrs.ariaExpanded = rawAttrs['aria-expanded']
      }

      return comboBoxAttrs
    })

    const attrs = useAttrs({
      excludeKeys: computed(() => Object.keys(containerAttrs.value)),
    })

    const { formItem } = useFormItem()
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem,
    })

    const inputSize = useSize()
    const disabled = useDisabled()
    const nsInput = useNamespace('input')
    const nsTextarea = useNamespace('textarea')

    /** @type {import('vue').ShallowRef<HTMLInputElement>} */
    const inputRef = shallowRef()
    /** @type {import('vue').ShallowRef<HTMLTextAreaElement>} */
    const textareaRef = shallowRef()

    const { innerValue, hasMask, moveCursorForPaste, updateMaskValue, onMaskedKeydown } = useMask(
      props,
      emit,
      emitValue,
      inputRef,
    )
    let focusoutTimer = undefined
    const isFocused = ref(false)
    const hovering = ref(false)
    const passwordVisible = ref(false)
    const countStyle = ref()
    const textareaCalcStyle = shallowRef(props.inputStyle)

    const nativeRef = computed(() => inputRef.value || textareaRef.value)
    // const validateState = computed(() => formItem?.validateState || '')
    const passwordIcon = computed(() => (passwordVisible.value ? NIconEye : NIconEyeSlash))

    /** @type {import('vue').ComputedRef<import('vue').StyleValue>} */
    // @ts-ignore
    const containerStyle = computed(() => [rawAttrs.style, props.inputStyle])

    /** @type {import('vue').ComputedRef<import('vue').StyleValue>} */
    const textareaStyle = computed(() => [props.inputStyle, textareaCalcStyle.value, { resize: props.resize }])
    const nativeInputValue = computed(() => (isNil(props.modelValue) ? '' : String(props.modelValue)))

    const isSuccess = computed(() => (isBoolean(props.success) ? props.success : Boolean(formItem?.isSuccess)))
    const isError = computed(() => (isBoolean(props.error) ? props.error : Boolean(formItem?.isError)))
    // const isWarn = computed(() => formItem?.isWarn || !!props.warn)
    const showClear = computed(
      () =>
        props.clearable &&
        !disabled.value &&
        !props.readonly &&
        !!nativeInputValue.value &&
        (isFocused.value || hovering.value),
    )
    const showPwdVisible = computed(
      () =>
        props.showPassword &&
        !disabled.value &&
        !props.readonly &&
        !!nativeInputValue.value &&
        (!!nativeInputValue.value || isFocused.value),
    )
    const isWordLimitVisible = computed(
      () =>
        props.showWordLimit &&
        !!attrs.value.maxlength &&
        (props.type === 'text' || props.type === 'textarea') &&
        !disabled.value &&
        !props.readonly &&
        !props.showPassword,
    )
    const textLength = computed(() => [...nativeInputValue.value].length)
    const inputExceed = computed(
      () =>
        // показывать стиль превышения, если длина начального значения больше maxlength
        !!isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength),
    )
    const suffixVisible = computed(
      () => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value,
    )

    useResizeObserver(textareaRef, (entries) => {
      if (!isWordLimitVisible.value || props.resize !== 'both') {
        return
      }

      const entry = entries[0]
      const { width } = entry.contentRect

      countStyle.value = {
        /** right: 100% - width + padding(15) + right(6) */
        right: `calc(100% - ${width + 15 + 6}px)`,
      }
    })

    function resizeTextarea() {
      const { type, autosize } = props

      if (!isClient || type !== 'textarea') {
        return
      }

      if (autosize) {
        const minRows = isObject(autosize) ? autosize.minRows : undefined
        const maxRows = isObject(autosize) ? autosize.maxRows : undefined

        textareaCalcStyle.value = {
          ...calcTextareaHeight(textareaRef.value, minRows, maxRows),
        }
      } else {
        textareaCalcStyle.value = {
          minHeight: calcTextareaHeight(textareaRef.value).minHeight,
        }
      }
    }

    // function fieldValueIsFilled(val) {
    //   return val !== undefined && val !== null && `${val}`.length > 0
    // }

    function emitValue(val, stopWatcher = false) {
      if (props.modelValue !== val && emitCachedValue !== val) {
        emitCachedValue = val

        stopWatcher === true && (stopValueWatcher = true)
        emit(UPDATE_MODEL_EVENT, val)

        nextTick(() => {
          emitCachedValue === val && (emitCachedValue = Number.NaN)
        })
      }
    }

    function handlePaste(evt) {
      if (hasMask.value === true && props.reverseFillMask !== true) {
        // @ts-ignore
        const { target } = evt

        moveCursorForPaste(target, target.selectionStart, target.selectionEnd)
      }
    }

    /**
     * @param {InputEvent} evt
     */
    function handleInput(evt) {
      // @ts-ignore
      const val = evt.target.value

      if (hasMask.value === true) {
        updateMaskValue(val, false, evt.inputType)
      } else {
        emitValue(val)
        emit('input', val)
      }
    }

    /**
     * @param {Event} evt
     */
    function handleChange(evt) {
      // @ts-ignore
      emit('change', evt.target.value)
    }

    function handlePasswordVisible() {
      passwordVisible.value = !passwordVisible.value
      focus()
    }

    async function focus() {
      // see: https://github.com/ElemeFE/element/issues/18573
      await nextTick()
      isFocused.value = true
      nativeRef.value?.focus()
    }

    function blur() {
      nativeRef.value?.blur()
    }

    /**
     * @param {FocusEvent} evt
     */
    function handleFocusin(evt) {
      isFocused.value = true
      emit('focus', evt)
    }

    /**
     * @param {FocusEvent} evt
     */
    function handleTextareaBlur(evt) {
      isFocused.value = false
      emit('blur', evt)

      if (props.validateEvent) {
        formItem?.validate?.('blur').catch((/** @type {Error} */ error) => debugWarn(error))
      }
    }

    /**
     * @param {FocusEvent} evt
     */
    function handleFocusout(evt) {
      clearTimeout(focusoutTimer)
      focusoutTimer = setTimeout(() => {
        if (document.hasFocus() === true && wrapperRef.value.contains(document.activeElement) !== false) {
          return
        }

        stopValueWatcher = false

        isFocused.value = false
        emit('blur', evt)

        if (props.validateEvent) {
          formItem?.validate?.('blur').catch((/** @type {Error} */ error) => debugWarn(error))
        }
      })
    }

    /**
     * @param {MouseEvent} evt
     */
    function handleMouseLeave(evt) {
      hovering.value = false
      emit('mouseleave', evt)
    }

    /**
     * @param {MouseEvent} evt
     */
    function handleMouseEnter(evt) {
      hovering.value = true
      emit('mouseenter', evt)
    }

    /**
     * @param {KeyboardEvent} evt
     */
    function handleKeydown(evt) {
      if (hasMask.value === true) {
        onMaskedKeydown(evt)
      }

      emit('keydown', evt)
    }

    function select() {
      nativeRef.value?.select()
    }

    function clear() {
      emit(UPDATE_MODEL_EVENT, '')
      emit('change', '')
      emit('clear')
      emit('input', '')
      focus()
    }

    watch(
      () => props.modelValue,
      (val) => {
        watchMask(val)

        nextTick(() => resizeTextarea())

        if (props.validateEvent) {
          // @ts-ignore
          formItem?.validate?.('change').catch((/** @type {string} */ error) => debugWarn(error))
        }
      },
    )

    function watchMask(val) {
      if (hasMask.value === true) {
        if (stopValueWatcher === true) {
          stopValueWatcher = false

          // @ts-ignore
          if (String(val) === emitCachedValue) {
            return
          }
        }

        updateMaskValue(val)
      } else if (innerValue.value !== val) {
        innerValue.value = val
      }
    }

    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    watch(
      () => props.type,
      async () => {
        await nextTick()
        resizeTextarea()
      },
    )

    onMounted(() => {
      nextTick(resizeTextarea)
    })

    expose({
      /** @description HTML input element */
      input: inputRef,
      /** @description HTML textarea element */
      textarea: textareaRef,
      /** @description HTML element, input or textarea */
      ref: nativeRef,
      /** @description style of textarea. */
      textareaStyle,

      /** @description from props (used on unit test) */
      autosize: toRef(props, 'autosize'),

      /** @description HTML input element native method */
      focus,
      /** @description HTML input element native method */
      blur,
      /** @description HTML input element native method */
      select,
      /** @description clear input value */
      clear,
      /** @description resize textarea. */
      resizeTextarea,
    })

    const containerClasses = computed(() => {
      const ns = props.type === 'textarea' ? nsTextarea : nsInput

      return [
        ns.b(),
        ns.m(`size-${inputSize.value}`),
        ns.is('disabled', disabled.value),
        ns.is('error', isError.value),
        // ns.is('warn', isWarn.value),
        ns.is('success', isSuccess.value),
        ns.is('exceed', inputExceed.value),
        ns.has('prefix', !!slots.prefix || !!props.prefixIcon),
        ns.has('suffix', !!slots.suffix || !!props.suffixIcon || props.clearable || props.showPassword),
        {
          [nsInput.b('group')]: slots.prepend || slots.append,
          [nsInput.bm('group', 'append')]: slots.append,
          [nsInput.bm('group', 'prepend')]: slots.prepend,
        },
        rawAttrs.class,
      ]
    })

    return () => (
      <div
        v-show={props.type !== 'hidden'}
        {...containerAttrs.value}
        class={containerClasses.value}
        style={containerStyle.value}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        {/* {<!-- input -->} */}
        {props.type !== 'textarea' ? (
          <>
            {/* {<!-- prepend slot -->} */}
            {slots.prepend && <div class={nsInput.be('group', 'prepend')}>{hSlot(slots.prepend)}</div>}

            <div
              ref={wrapperRef}
              class={[nsInput.e('wrapper'), nsInput.eIs('wrapper', 'focus', isFocused.value)]}
              onFocusout={handleFocusout}
              onFocusin={handleFocusin}
              tabindex={-1}
            >
              {/* {<!-- prefix slot -->} */}
              {(slots.prefix || props.prefixIcon) && (
                <span class={nsInput.e('prefix')}>
                  {hSlot(slots.prefix)}
                  {props.prefixIcon && (
                    <span class={nsInput.e('icon')}>
                      <props.prefixIcon />
                    </span>
                  )}
                </span>
              )}

              {
                <input
                  id={inputId.value}
                  ref={inputRef}
                  class={nsInput.e('inner')}
                  {...attrs.value}
                  value={nativeInputValue.value}
                  type={props.showPassword ? (passwordVisible.value ? 'text' : 'password') : props.type}
                  disabled={disabled.value}
                  readonly={props.readonly}
                  autocomplete={props.autocomplete}
                  tabindex={props.tabindex}
                  aria-label={props.label}
                  placeholder={props.placeholder}
                  // @ts-ignore
                  style={props.inputStyle}
                  form={props.form}
                  onInput={handleInput}
                  onChange={handleChange}
                  onKeydown={handleKeydown}
                />
              }

              {/* <!-- suffix slot --> */}
              {suffixVisible.value && (
                <span class={nsInput.e('suffix')}>
                  {/* <!-- suffix icon --> */}
                  {(!showClear.value || !showPwdVisible.value || !isWordLimitVisible.value) && (
                    <>
                      {hSlot(slots.suffix)}
                      {props.suffixIcon && (
                        <span class={nsInput.e('icon')}>
                          <props.suffixIcon />
                        </span>
                      )}
                    </>
                  )}

                  {/* <!-- suffix clear --> */}
                  {showClear.value && (
                    <span class={[nsInput.e('icon'), nsInput.e('clear')]} onMousedownPrevent={NOOP} onClick={clear}>
                      <NIconClose />
                    </span>
                  )}

                  {/* <!-- suffix Pwd visible --> */}
                  {showPwdVisible.value && (
                    <span class={[nsInput.e('icon'), nsInput.e('password')]} onClick={handlePasswordVisible}>
                      <passwordIcon.value />
                    </span>
                  )}

                  {/* <!-- suffix isWordLimitVisible --> */}
                  {isWordLimitVisible.value && (
                    <span class={nsInput.e('count')}>
                      <span class={nsInput.e('count-inner')}>
                        {textLength.value} / {attrs.value.maxlength}
                      </span>
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* <!-- append slot --> */}
            {slots.append && <div class={nsInput.be('group', 'append')}>{hSlot(slots.append)}</div>}
          </>
        ) : (
          <>
            <textarea
              id={inputId.value}
              ref={textareaRef}
              class={[nsTextarea.e('inner'), nsTextarea.eIs('inner', 'focus', isFocused.value)]}
              {...attrs.value}
              value={nativeInputValue.value}
              tabindex={props.tabindex}
              disabled={disabled.value}
              readonly={props.readonly}
              autocomplete={props.autocomplete}
              style={textareaStyle.value}
              aria-label={props.label}
              placeholder={props.placeholder}
              form={props.form}
              onPaste={handlePaste}
              onInput={handleInput}
              onFocus={handleFocusin}
              onBlur={handleTextareaBlur}
              onChange={handleChange}
              onKeydown={handleKeydown}
            />

            {/* <!-- suffix isWordLimitVisible --> */}
            {isWordLimitVisible.value && (
              <span class={nsTextarea.e('count')} style={countStyle.value}>
                {textLength.value} / {attrs.value.maxlength}
              </span>
            )}
          </>
        )}
      </div>
    )
  },
})
