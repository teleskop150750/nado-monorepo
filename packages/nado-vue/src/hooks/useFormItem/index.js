import { computed, inject, onMounted, onUnmounted, ref, toRef, watch } from 'vue'

import { formContextKey, formItemContextKey } from '../../tokens/index.js'
import { useId } from '../useId/index.js'

export const useFormItem = () => {
  const form = inject(formContextKey, undefined)
  const formItem = inject(formItemContextKey, undefined)

  return {
    form,
    formItem,
  }
}

/**
 * @typedef {Object} IUseFormItemInputCommonProps
 * @property {string} [id]
 * @property {string | number | boolean | Record<string, any>} [label]
 */

// TODO formItemContext type
/**
 * @param {Partial<IUseFormItemInputCommonProps>} props
 * @param {{
 *  formItemContext?: any
 *  disableIdGeneration?: import('vue').ComputedRef<boolean> | import('vue').Ref<boolean>
 *  disableIdManagement?: import('vue').ComputedRef<boolean> | import('vue').Ref<boolean>
 * }} props
 */
export const useFormItemInputId = (props, { formItemContext, disableIdGeneration, disableIdManagement }) => {
  if (!disableIdGeneration) {
    /** @type {import('vue').Ref<boolean>} */
    disableIdGeneration = ref(false)
  }

  if (!disableIdManagement) {
    /** @type {import('vue').Ref<boolean>} */
    disableIdManagement = ref(false)
  }

  /** @type {import('vue').Ref<string>} */
  const inputId = ref()

  /** @type {import('vue').WatchStopHandle | undefined} */
  let stopWatchId

  /** @type {import('vue').ComputedRef<boolean>} */
  const isLabeledByFormItem = computed(
    () => !!(!props.label && formItemContext && formItemContext.inputIds && formItemContext.inputIds?.length <= 1),
  )

  // Сгенерируйте идентификатор для метки NFormItem, если он не указан в качестве реквизита
  onMounted(() => {
    stopWatchId = watch(
      [toRef(props, 'id'), disableIdGeneration],
      /** @param {[string, boolean]} param */
      ([id, disableIdGenerationValue]) => {
        const newId = id ?? (!disableIdGenerationValue ? useId().value : undefined)

        if (newId !== inputId.value) {
          if (formItemContext?.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value)

            if (!disableIdManagement?.value && !disableIdGenerationValue && newId) {
              formItemContext.addInputId(newId)
            }
          }

          inputId.value = newId
        }
      },
      { immediate: true },
    )
  })

  onUnmounted(() => {
    stopWatchId && stopWatchId()

    if (formItemContext?.removeInputId) {
      inputId.value && formItemContext.removeInputId(inputId.value)
    }
  })

  return {
    isLabeledByFormItem,
    inputId,
  }
}
