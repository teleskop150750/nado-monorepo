import { h } from 'vue'

export const useFormProps = {
  name: String,
}

export function useFormInject(formAttrs = {}) {
  /**
   * @param {Array} child
   * @param {string} action
   */
  return (child, action, className = '') => {
    child[action](
      h('input', {
        class: [className],
        ...formAttrs.value,
      }),
    )
  }
}
