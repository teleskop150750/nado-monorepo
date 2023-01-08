import { computed, inject, ref } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { useNamespace } from '../../../hooks/index.js'
import { addClass, generateId } from '../../../utils/index.js'
import { DROPDOWN_LOCAL_INJECTION_KEY } from './tokens.js'

export const useDropdown = () => {
  const elDropdown = inject(DROPDOWN_LOCAL_INJECTION_KEY, {})
  const _elDropdownSize = computed(() => elDropdown?.dropdownSize)

  return {
    elDropdown,
    _elDropdownSize,
  }
}

export const initDropdownDomEvent = (dropdownChildren, triggerEl, _instance) => {
  const ns = useNamespace('dropdown')
  const menuItems = ref(undefined)
  const menuItemsArray = ref(undefined)
  const dropdownEl = ref(undefined)
  const listId = ref(`dropdown-menu-${generateId()}`)

  dropdownEl.value = dropdownChildren?.subTree.el

  function removeTabindex() {
    triggerEl.setAttribute('tabindex', '-1')

    menuItemsArray.value?.forEach((item) => {
      item.setAttribute('tabindex', '-1')
    })
  }

  function resetTabindex(ele) {
    removeTabindex()
    ele?.setAttribute('tabindex', '0')
  }

  /**
   * @param {KeyboardEvent} evt
   */
  function handleTriggerKeyDown(evt) {
    const { code } = evt

    if ([EVENT_CODE.up, EVENT_CODE.down].includes(code)) {
      removeTabindex()
      resetTabindex(menuItems.value[0])
      menuItems.value[0].focus()
      evt.preventDefault()
      evt.stopPropagation()
    } else if (code === EVENT_CODE.enter) {
      _instance.handleClick()
    } else if ([EVENT_CODE.tab, EVENT_CODE.esc].includes(code)) {
      _instance.hide()
    }
  }

  function handleItemKeyDown(ev) {
    const { code } = ev
    const { target } = ev
    const currentIndex = menuItemsArray.value.indexOf(target)
    const max = menuItemsArray.value.length - 1
    let nextIndex

    if ([EVENT_CODE.up, EVENT_CODE.down].includes(code)) {
      if (code === EVENT_CODE.up) {
        nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
      } else {
        nextIndex = currentIndex < max ? currentIndex + 1 : max
      }

      removeTabindex()
      resetTabindex(menuItems.value[nextIndex])
      menuItems.value[nextIndex].focus()
      ev.preventDefault()
      ev.stopPropagation()
    } else if (code === EVENT_CODE.enter) {
      triggerElFocus()
      target.click()

      if (_instance.props.hideOnClick) {
        _instance.hide()
      }
    } else if ([EVENT_CODE.tab, EVENT_CODE.esc].includes(code)) {
      _instance.hide()
      triggerElFocus()
    }
  }

  function initAria() {
    dropdownEl.value.setAttribute('id', listId.value)
    triggerEl.setAttribute('aria-haspopup', 'list')
    triggerEl.setAttribute('aria-controls', listId.value)

    if (!_instance.props.splitButton) {
      triggerEl.setAttribute('role', 'button')
      triggerEl.setAttribute('tabindex', _instance.props.tabindex)
      addClass(triggerEl, ns.b('self-define'))
    }
  }

  function initEvent() {
    triggerEl?.addEventListener('keydown', handleTriggerKeyDown)
    dropdownEl.value?.addEventListener('keydown', handleItemKeyDown, true)
  }

  function initDomOperation() {
    menuItems.value = dropdownEl.value.querySelectorAll("[tabindex='-1']")
    menuItemsArray.value = [...menuItems.value]

    initEvent()
    initAria()
  }

  function triggerElFocus() {
    triggerEl.focus()
  }

  initDomOperation()
}
