import { computed, provide, reactive, toRefs } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { formContextKey } from '../../../tokens/index.js'
import { createComponent, debugWarn, hSlot, isFunction } from '../../../utils/index.js'
import { formEmits, formProps } from './formProps.js'
import { filterFields } from './utils.js'

const COMPONENT_NAME = 'NForm'

export const NForm = createComponent({
  name: COMPONENT_NAME,
  props: formProps,
  emits: formEmits,
  setup(props, { slots, expose, emit }) {
    /** @type{import('../../../tokens/index.js').FormItemContext[]} */
    const fields = []
    const ns = useNamespace('form')

    /**
     * @type {import('../../../tokens/form.js').FormContext['addField']}
     */
    const addField = (field) => {
      fields.push(field)
    }

    /** @type {import('../../../tokens/form.js').FormContext['removeField']} */
    const removeField = (field) => {
      if (field.prop) {
        fields.splice(fields.indexOf(field), 1)
      }
    }

    /** @type {import('../../../tokens/form.js').FormContext['removeField']} */
    const resetFields = (properties = []) => {
      if (!props.model) {
        debugWarn(COMPONENT_NAME, 'model необходима для работы полей сброса.')

        return
      }

      filterFields(fields, properties).forEach((field) => field.resetField())
    }

    /** @type {import('../../../tokens/form.js').FormContext['clearValidate']} */
    const clearValidate = (filterProps = []) => {
      filterFields(fields, filterProps).forEach((field) => field.clearValidate())
    }

    const isValidatable = computed(() => {
      const hasModel = !!props.model

      if (!hasModel) {
        debugWarn(COMPONENT_NAME, 'model необходима для работы проверки.')
      }

      return hasModel
    })

    /** @param {import('../../../utils/typescript.js').Arrayable<any>} _props */
    const obtainValidateFields = (_props) => {
      if (fields.length === 0) {
        return []
      }

      const filteredFields = filterFields(fields, _props)

      if (filteredFields.length === 0) {
        debugWarn(COMPONENT_NAME, 'please pass correct props!')

        return []
      }

      return filteredFields
    }

    /**
     * @param {import('../../../tokens/index.js').FormValidateCallback} callback
     * @returns{import('../../../tokens/index.js').FormValidationResult}
     */
    // eslint-disable-next-line no-use-before-define
    const validate = async (callback) => validateField(undefined, callback)

    /**
     * @param {import('../../../utils/typescript.js').Arrayable<any>} _props
     * @returns{Promise<boolean>}
     */
    const doValidateField = async (_props = []) => {
      if (!isValidatable.value) {
        return false
      }

      const _fields = obtainValidateFields(_props)

      if (_fields.length === 0) {
        return true
      }

      let validationErrors = {}

      for (const field of _fields) {
        try {
          // TODO
          // eslint-disable-next-line no-await-in-loop
          await field.validate('')
        } catch (error) {
          validationErrors = {
            ...validationErrors,
            ...error,
          }
        }
      }

      if (Object.keys(validationErrors).length === 0) {
        return true
      }

      throw validationErrors
    }

    const scrollToField = (prop) => {
      const field = filterFields(fields, prop)[0]

      if (field) {
        field.$el?.scrollIntoView()
      }
    }

    const validateField = async (modelProps = [], callback = undefined) => {
      const shouldThrow = !isFunction(callback)

      try {
        const result = await doValidateField(modelProps)

        // When result is false meaning that the fields are not validatable
        if (result === true) {
          callback?.(result)
        }

        return result
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }

        const invalidFields = error

        if (props.scrollToError) {
          scrollToField(Object.keys(invalidFields)[0])
        }

        callback?.(false, invalidFields)

        return shouldThrow && Promise.reject(invalidFields)
      }
    }

    provide(
      formContextKey,
      reactive({
        ...toRefs(props),
        emit,

        resetFields,
        clearValidate,
        validateField,
        addField,
        removeField,
      }),
    )

    expose({
      /** @description validate form */
      validate,
      /** @description validate form field */
      validateField,
      /** @description reset fields */
      resetFields,
      /** @description clear validation status */
      clearValidate,
      /** @description scroll to field */
      scrollToField,
    })

    return () => <form class={[ns.b(), ns.m(`size-${props.size}`)]}>{hSlot(slots.default)}</form>
  },
})
