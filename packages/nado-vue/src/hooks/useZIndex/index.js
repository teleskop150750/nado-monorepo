import { computed, ref } from 'vue'

const zIndex = ref(0)

export const useZIndex = () => {
  const initialZIndex = ref(2000) // TODO: move to constants
  const currentZIndex = computed(() => initialZIndex.value + zIndex.value)

  const nextZIndex = () => {
    zIndex.value += 1

    return currentZIndex.value
  }

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex,
  }
}
