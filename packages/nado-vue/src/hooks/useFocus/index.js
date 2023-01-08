export const useFocus = (el) => ({
  focus: () => {
    el.value?.focus?.()
  },
})
