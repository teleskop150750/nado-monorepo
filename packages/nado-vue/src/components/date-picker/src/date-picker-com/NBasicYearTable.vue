<script setup>
import dayjs from 'dayjs'
import { computed, nextTick, ref, watch } from 'vue'

import { useLocale, useNamespace } from '../../../../hooks/index.js'
import { ensureArray, hasClass } from '../../../../utils/index.js'
import { rangeArr } from '../../../date-time-picker/index.js'
import { basicYearTableProps } from '../props/basic-year-table.js'

const props = defineProps(basicYearTableProps)

const emit = defineEmits(['pick'])

/**
 * @param {number} year
 * @param {string} lang
 */
const datesInYear = (year, lang) => {
  const firstDay = dayjs(String(year)).locale(lang).startOf('year')
  const lastDay = firstDay.endOf('year')
  const numOfDays = lastDay.dayOfYear()

  return rangeArr(numOfDays).map((n) => firstDay.add(n, 'day').toDate())
}

const ns = useNamespace('year-table')
const cellNs = useNamespace('year-table-cell')

const { locale, lang } = useLocale()
const tbodyRef = ref()
const currentCellRef = ref()
const startYear = computed(() => Math.floor(props.date.year() / 10) * 10)

const focus = () => {
  currentCellRef.value?.focus()
}

/**
 * @param {number} year
 */
const getCellStyle = (year, className) => {
  const style = {}
  const today = dayjs().locale(lang)

  // @ts-ignore
  style[`${className}--is-disabled`] = props.disabledDate ? datesInYear(year, lang).every(props.disabledDate) : false

  style[`${className}--is-current`] =
    // @ts-ignore
    ensureArray(props.parsedValue).findIndex((d) => d.year() === year) >= 0

  style[`${className}--is-today`] = today.year() === year

  return style
}

/**
 * @param {number} year
 */
const isSelectedCell = (year) =>
  (year === startYear.value && props.date.year() < startYear.value && props.date.year() > startYear.value + 9) ||
  ensureArray(props.date).findIndex((date) => date.year() === year) >= 0

/**
 * @param {MouseEvent | KeyboardEvent} event
 */
const handleYearTableClick = (event) => {
  const clickTarget = event.target
  // @ts-ignore
  const target = clickTarget.closest('td')

  if (target && target.textContent) {
    if (hasClass(target, 'disabled')) {
      return
    }

    // eslint-disable-next-line unicorn/prefer-dom-node-text-content
    const year = target.textContent || target.innerText

    emit('pick', Number(year))
  }
}

watch(
  () => props.date,
  async () => {
    if (tbodyRef.value?.contains(document.activeElement)) {
      await nextTick()
      currentCellRef.value?.focus()
    }
  },
)

defineExpose({
  /**
   * @description focus on the current cell
   */
  focus,
})
</script>

<template>
  <table role="grid" :aria-label="locale.el.datepicker.yearTablePrompt" :class="ns.b()" @click="handleYearTableClick">
    <tbody ref="tbodyRef" :class="ns.e('body')">
      <tr v-for="(_, i) in 3" :key="i">
        <template v-for="(__, j) in 4" :key="i + '_' + j">
          <td
            v-if="i * 4 + j < 10"
            :ref="
              (el) =>
                // @ts-ignore
                isSelectedCell(startYear + i * 4 + j) && (currentCellRef = el)
            "
            :class="[getCellStyle(startYear + i * 4 + j, ns.e('cell')), ns.e('cell'), ns.eIs('cell', 'available')]"
            :aria-selected="`${isSelectedCell(startYear + i * 4 + j)}`"
            :tabindex="isSelectedCell(startYear + i * 4 + j) ? 0 : -1"
            @keydown.space.prevent.stop="handleYearTableClick"
            @keydown.enter.prevent.stop="handleYearTableClick"
          >
            <span :class="[getCellStyle(startYear + i * 4 + j, cellNs.b()), cellNs.b()]">
              {{ startYear + i * 4 + j }}
            </span>
          </td>
          <td v-else />
        </template>
      </tr>
    </tbody>
  </table>
</template>
