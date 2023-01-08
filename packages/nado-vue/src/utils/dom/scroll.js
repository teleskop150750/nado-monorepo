import { isClient } from '@vueuse/core'

let scrollBarWidth

/**
 * @param {string} namespace
 */
export const getScrollBarWidth = (namespace) => {
  if (!isClient) {
    return 0
  }

  if (scrollBarWidth !== undefined) {
    return scrollBarWidth
  }

  const outer = document.createElement('div')

  outer.className = `${namespace}-scrollbar__wrap`
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.append(outer)

  const widthNoScroll = outer.offsetWidth

  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')

  inner.style.width = '100%'
  outer.append(inner)

  const widthWithScroll = inner.offsetWidth

  outer.parentNode?.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}

/**
 * Прокрутите элемент контейнера, расположив **selected** элемент вверху
 * контейнера
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} [selected]
 */
export function scrollIntoView(container, selected) {
  if (!isClient) {
    return
  }

  if (!selected) {
    container.scrollTop = 0

    return
  }

  /** @type {HTMLElement[]} */
  const offsetParents = []
  /** @type {HTMLElement} */
  // @ts-ignore
  let pointer = selected.offsetParent

  while (pointer !== null && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer)
    // @ts-ignore
    pointer = pointer.offsetParent
  }

  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0)
  const bottom = top + selected.offsetHeight
  const viewRectTop = container.scrollTop
  const viewRectBottom = viewRectTop + container.clientHeight

  if (top < viewRectTop) {
    container.scrollTop = top
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight
  }
}
