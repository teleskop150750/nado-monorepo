import { ref, unref, watch } from 'vue'

import { getCurrentInstance, useLocale, useNamespace } from '../../../../hooks/index.js'
import { isArray } from '../../../../utils/index.js'
import { getDefaultValue, isValidRange } from '../utils.js'
import { useShortcut } from './useShortcut.js'

/**
 *
 * @param {import('../props/shared.js').PanelRangeSharedProps} props
 * @param {import('./use-range-picker-types.js').UseRangePickerProps} param1
 * @returns
 */
export const useRangePicker = (props, { defaultValue, leftDate, rightDate, unit, onParsedValueChanged }) => {
  const { emit } = getCurrentInstance('useRangePicker')

  const drpNs = useNamespace('date-range-picker')
  const { locale, lang } = useLocale()
  const handleShortcutClick = useShortcut(lang)
  const minDate = ref()
  const maxDate = ref()
  const rangeState = ref({
    endDate: null,
    selecting: false,
  })
  /**
   * @param {import('../props/shared.js').RangeState} val
   */
  const handleChangeRange = (val) => {
    rangeState.value = val
  }

  const handleRangeConfirm = (visible = false) => {
    const _minDate = unref(minDate)
    const _maxDate = unref(maxDate)

    if (isValidRange([_minDate, _maxDate])) {
      emit('pick', [_minDate, _maxDate], visible)
    }
  }

  /**
   * @param {boolean} selecting
   */
  const onSelect = (selecting) => {
    rangeState.value.selecting = selecting

    if (!selecting) {
      rangeState.value.endDate = null
    }
  }

  const restoreDefault = () => {
    const [start, end] = getDefaultValue(unref(defaultValue), {
      lang: unref(lang),
      unit,
      unlinkPanels: props.unlinkPanels,
    })

    minDate.value = undefined
    maxDate.value = undefined
    leftDate.value = start
    rightDate.value = end
  }

  watch(
    defaultValue,
    (val) => {
      if (val) {
        restoreDefault()
      }
    },
    { immediate: true },
  )

  watch(
    () => props.parsedValue,
    (parsedValue) => {
      if (isArray(parsedValue) && parsedValue.length === 2) {
        const [start, end] = parsedValue

        minDate.value = start
        leftDate.value = start
        maxDate.value = end
        onParsedValueChanged(unref(minDate), unref(maxDate))
      } else {
        restoreDefault()
      }
    },
    { immediate: true },
  )

  return {
    minDate,
    maxDate,
    rangeState,
    lang,
    drpNs,

    handleChangeRange,
    handleRangeConfirm,
    handleShortcutClick,
    onSelect,
    locale,
  }
}
