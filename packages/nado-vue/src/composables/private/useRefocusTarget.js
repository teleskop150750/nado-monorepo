import { computed, h, ref } from 'vue'

/**
 * @param {{
 * disabled?: any;
 * }} props
 * @param {import('vue').Ref<HTMLElement>} rootRef
 */
export function useRefocusTarget(props, rootRef) {
  const refocusRef = ref(null)

  const refocusTargetEl = computed(() => {
    if (props.disabled === true) {
      return null
    }

    return h('span', {
      ref: refocusRef,
      tabindex: -1,
    })
  })

  /**
   * @param {any} evt
   */
  function refocusTarget(evt) {
    const root = rootRef.value

    if (evt !== undefined && evt.type.indexOf('key') === 0) {
      if (root !== null && document.activeElement !== root && root.contains(document.activeElement) === true) {
        root.focus()
      }
    } else if (
      refocusRef.value !== null &&
      (evt === undefined || (root !== null && root.contains(evt.target) === true))
    ) {
      refocusRef.value.focus()
    }
  }

  return {
    refocusTargetEl,
    refocusTarget,
  }
}
