import dayjs from 'dayjs'
import { useAttrs, useSlots } from 'vue'

import { getCurrentInstance } from '../../../../hooks/index.js'
import { isFunction } from '../../../../utils/index.js'

export const useShortcut = (lang) => {
  const { emit } = getCurrentInstance('useShortcut')
  const attrs = useAttrs()
  const slots = useSlots()

  /**
   *
   * @param {import('./useShortcut.js').Shortcut} shortcut
   * @returns
   */
  const handleShortcutClick = (shortcut) => {
    const shortcutValues = isFunction(shortcut.value)
      ? // @ts-ignore
        shortcut.value()
      : shortcut.value

    if (shortcutValues) {
      emit('pick', [dayjs(shortcutValues[0]).locale(lang), dayjs(shortcutValues[1]).locale(lang)])

      return
    }

    if (shortcut.onClick) {
      shortcut.onClick({
        attrs,
        slots,
        emit,
      })
    }
  }

  return handleShortcutClick
}
