import { Fragment, ref } from 'vue'

import { composeRefs, createComponent, ensureOnlyChild } from '../../../utils/index.js'

export const forwardRefProps = {
  setRef: {
    type: Function,
    required: true,
  },
  onlyChild: Boolean,
}

// TODO: подумайте о том, чтобы сделать этот компонент компонентом
// многократного использования без единственной дочерней функции.
export const NTooltipForwardRef = createComponent({
  name: 'NTooltipForwardRef',
  props: forwardRefProps,
  setup(props, { slots }) {
    const fragmentRef = ref()
    const setRef = composeRefs(fragmentRef, (el) => {
      // фрагменты vue представлены в виде текстового элемента.
      // Первый дочерний элемент элемента должен быть первым дочерним элементом фрагмента.
      // Вот как мы получаем элемент.
      if (el) {
        props.setRef(el.nextElementSibling)
      } else {
        props.setRef(null)
      }
    })

    return () => {
      const [firstChild] = slots.default?.() || []
      const child = props.onlyChild ? ensureOnlyChild(firstChild.children) : firstChild.children

      // Dunno why the ref for jsx complains about the typing issue which was not
      // in template
      // Не знаю, почему ссылка для jsx жалуется на проблему с набором текста, которой не было
      // в шаблоне
      return <Fragment ref={setRef}>{child}</Fragment>
    }
  },
})
