// @ts-nocheck
import { isFunction } from '@vue/shared'
import { ref } from 'vue'

export function useInput(handleInput) {
  const isComposing = ref(false)

  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionUpdate = () => {
    isComposing.value = true
  }

  const handleCompositionEnd = (event) => {
    if (isComposing.value) {
      isComposing.value = false

      if (isFunction(handleInput)) {
        handleInput(event)
      }
    }
  }

  return {
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
  }
}
