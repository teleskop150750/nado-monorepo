import { refDebounced } from '@vueuse/core'
import AsyncValidator from 'async-validator'
import { castArray, clone } from 'lodash-unified'
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  Transition,
  watch,
} from 'vue'

import { useId, useNamespace, useSize } from '../../../hooks/index.js'
import { formContextKey, formItemContextKey } from '../../../tokens/index.js'
import { createComponent, getProp, hSlot, isBoolean, isFunction, isString } from '../../../utils/index.js'
import { formItemProps } from './formItemProps.js'

export const NFormItem = createComponent({
  name: 'NFormItem',
  props: formItemProps,
  setup(props, { slots, expose }) {
    const formContext = inject(formContextKey, undefined)

    // special inline value.
    let initialValue = undefined
    let isResettingField = false
    const _size = useSize(undefined, { formItem: false })
    const ns = useNamespace('form-item')
    const labelId = useId().value
    /** @type {import('vue').Ref<string[]>} */
    const inputIds = ref([])

    const validateState = ref('')
    const validateStateDebounced = refDebounced(validateState, 100)
    const validateMessage = ref('')

    const normalizedRules = computed(() => {
      const { required, prop } = props

      const rules = []

      if (props.rules) {
        rules.push(...castArray(props.rules))
      }

      const formRules = formContext?.rules

      if (formRules && prop) {
        const _rules = getProp(formRules, prop).value

        if (_rules) {
          rules.push(...castArray(_rules))
        }
      }

      if (required) {
        const requiredRules = rules
          .map((rule, i) => [rule, i])
          .filter(([rule]) => Object.keys(rule).includes('required'))

        if (requiredRules.length > 0) {
          for (const [rule, i] of requiredRules) {
            if (rule.required === required) {
              // eslint-disable-next-line no-continue
              continue
            }

            rules[i] = { ...rule, required }
          }
        } else {
          rules.push({ required })
        }
      }

      return rules
    })

    /** @type {import('vue').Ref<HTMLDivElement>} */
    const formItemRef = ref()
    const isRequired = computed(() => normalizedRules.value.some((rule) => rule.required))
    const hasHint = computed(() => !!props.hint || !!slots.hint)
    const isError = computed(() => validateState.value === 'error')
    const isSuccess = computed(() => validateState.value === 'success')

    const formItemClasses = computed(() => [
      ns.b(),
      ns.m(`size-${_size.value}`),
      ns.is('error', isError.value),
      ns.is('validating', validateState.value === 'validating'),
      ns.is('success', validateState.value === 'success'),
      ns.is('required', isRequired.value || props.required),
      ns.is('no-asterisk', formContext?.hideRequiredAsterisk),
    ])

    const _inlineMessage = computed(() =>
      isBoolean(props.inlineMessage) ? props.inlineMessage : formContext?.inlineMessage || false,
    )

    const propString = computed(() => {
      if (!props.prop) {
        return ''
      }

      return isString(props.prop) ? props.prop : props.prop.join('.')
    })

    /** @type {import('vue').ComputedRef<boolean>} */
    const hasLabel = computed(() => !!(props.label || slots.label))

    /** @type {import('vue').ComputedRef<string | undefined>} */
    const labelFor = computed(() => (props.for || inputIds.value.length === 1 ? inputIds.value[0] : undefined))

    /** @type {import('vue').ComputedRef<boolean>} */
    const isGroup = computed(() => !labelFor.value && hasLabel.value)

    const fieldValue = computed(() => {
      const model = formContext?.model

      if (!model || !props.prop) {
        return
      }

      // @ts-ignore
      return getProp(model, props.prop).value
    })
    const validateEnabled = computed(() => normalizedRules.value.length > 0)

    const shouldShowError = computed(
      () => validateStateDebounced.value === 'error' && props.showMessage && (formContext?.showMessage ?? true),
    )

    const currentLabel = computed(() => `${props.label || ''}`)

    const getFilteredRule = (trigger) => {
      const rules = normalizedRules.value

      return (
        rules
          .filter((rule) => {
            if (!rule.trigger || !trigger) {
              return true
            }

            if (Array.isArray(rule.trigger)) {
              return rule.trigger.includes(trigger)
            }

            return rule.trigger === trigger
          })
          // exclude trigger
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-shadow
          .map(({ trigger, ...rule }) => rule)
      )
    }

    const setValidationState = (state) => {
      validateState.value = state
    }

    const onValidationFailed = (error) => {
      const { errors, fields } = error

      if (!errors || !fields) {
        console.error(error)
      }

      setValidationState('error')
      validateMessage.value = errors ? errors?.[0]?.message ?? `${props.prop} is required` : ''

      formContext?.emit('validate', props.prop, false, validateMessage.value)
    }

    const onValidationSucceeded = () => {
      setValidationState('success')
      formContext?.emit('validate', props.prop, true, '')
    }

    const doValidate = async (rules) => {
      const modelName = propString.value
      const validator = new AsyncValidator({
        [modelName]: rules,
      })

      return validator
        .validate({ [modelName]: fieldValue.value }, { firstFields: true })
        .then(() => {
          onValidationSucceeded()

          return true
        })
        .catch((error) => {
          onValidationFailed(error)

          throw error
        })
    }

    const validate = async (trigger, callback) => {
      // skip validation if its resetting
      if (isResettingField || !props.prop) {
        return false
      }

      const hasCallback = isFunction(callback)

      if (!validateEnabled.value) {
        callback?.(false)

        return false
      }

      const rules = getFilteredRule(trigger)

      if (rules.length === 0) {
        callback?.(true)

        return true
      }

      setValidationState('validating')

      return doValidate(rules)
        .then(() => {
          // eslint-disable-next-line promise/no-callback-in-promise
          callback?.(true)

          return true
        })
        .catch((error) => {
          const { fields } = error

          // eslint-disable-next-line promise/no-callback-in-promise
          callback?.(false, fields)

          return hasCallback ? false : Promise.reject(fields)
        })
    }

    const clearValidate = () => {
      setValidationState('')
      validateMessage.value = ''
      isResettingField = false
    }

    const resetField = async () => {
      const model = formContext?.model

      if (!model || !props.prop) {
        return
      }

      // @ts-ignore
      const computedValue = getProp(model, props.prop)

      // prevent validation from being triggered
      isResettingField = true

      computedValue.value = clone(initialValue)

      await nextTick()
      clearValidate()

      // isResettingField = false
    }

    /** @param {string} id */
    const addInputId = (id) => {
      if (!inputIds.value.includes(id)) {
        inputIds.value.push(id)
      }
    }

    /** @param {string} id */
    const removeInputId = (id) => {
      inputIds.value = inputIds.value.filter((listId) => listId !== id)
    }

    watch(
      () => props.error,
      (val) => {
        validateMessage.value = val || ''
        setValidationState(val ? 'error' : '')
      },
      { immediate: true },
    )

    watch(
      () => props.validateStatus,
      (val) => setValidationState(val || ''),
    )

    const context = reactive({
      ...toRefs(props),
      $el: formItemRef,
      size: _size,
      validateState,
      labelId,
      inputIds,
      isGroup,
      isSuccess,
      isError,
      hasLabel,
      addInputId,
      removeInputId,
      resetField,
      clearValidate,
      validate,
    })

    provide(formItemContextKey, context)

    onMounted(() => {
      if (props.prop) {
        formContext?.addField(context)
        initialValue = clone(fieldValue.value)
      }
    })

    onBeforeUnmount(() => {
      formContext?.removeField(context)
    })

    expose({
      /** @description form item size */
      size: _size,
      /** @description validation message */
      validateMessage,
      /** @description validation state */
      validateState,
      /** @description validate form item */
      validate,
      /** @description clear validation status */
      clearValidate,
      /** @description reset field value */
      resetField,
    })

    const labelComp = computed(() => (labelFor.value ? 'label' : 'div'))
    // TODO Доделать условия отображения hin
    const canShowHint = computed(() => hasHint.value && !isError.value)

    return () => (
      <div
        ref={formItemRef}
        class={formItemClasses.value}
        role={isGroup.value ? 'group' : undefined}
        aria-labelledby={isGroup.value ? labelId : undefined}
      >
        {hasLabel.value && (
          <labelComp.value class={ns.e('label')} id={labelId} for={labelFor.value}>
            {slots.label ? slots.label({ label: currentLabel.value }) : currentLabel.value}
          </labelComp.value>
        )}

        <div class={[ns.e('content'), props.hideHint && ns.em('content', 'hide-hint')]}>
          <div class={ns.e('content-inner')}>{hSlot(slots.default)}</div>

          <Transition name={`${ns.namespace}-zoom-in-top`}>
            {canShowHint.value &&
              (slots.hint ? slots.hint({ hint: props.hint }) : <div class={ns.e('hint')}>{props.hint}</div>)}
          </Transition>

          <Transition name={`${ns.namespace}-zoom-in-top`}>
            {shouldShowError.value &&
              (slots.error ? (
                slots.error({ error: '' })
              ) : (
                <div
                  class={[
                    ns.e('hint'),
                    ns.em('hint', 'error'),
                    { [ns.em('hint', 'position-inline')]: _inlineMessage.value },
                  ]}
                >
                  {validateMessage.value}
                </div>
              ))}
          </Transition>
        </div>
      </div>
    )
  },
})
