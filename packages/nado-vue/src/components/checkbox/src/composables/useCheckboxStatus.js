import { computed, toRaw } from 'vue'

export function useCheckboxStatus(props) {
  const modelIsArray = computed(() => props.val !== undefined && Array.isArray(props.modelValue))

  const index = computed(() => {
    const val = toRaw(props.val)

    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1
  })

  const isTrue = computed(() =>
    modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue),
  )

  const isFalse = computed(() =>
    modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue),
  )

  const isIndeterminate = computed(() => isTrue.value === false && isFalse.value === false)

  return {
    isTrue,
    isFalse,
    isIndeterminate,
    index,
    modelIsArray,
  }
}
