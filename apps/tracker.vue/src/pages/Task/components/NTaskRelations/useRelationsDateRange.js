import { dayjs } from '@nado/nado-gantt-chart'
import { computed } from 'vue'

export const useRelationsDateRange = (tasks, formData) => {
  const tasksMap = computed(() => Object.fromEntries(tasks.value.map((item) => [item.id, item])))

  const minDate = computed(() => {
    if (formData.affects === undefined || formData.affects === null) {
      return undefined
    }

    if (formData.affects.length === 0) {
      return undefined
    }

    if (Object.keys(tasksMap.value).length === 0) {
      return undefined
    }

    const dates = formData.affects.map((id) => new Date(tasksMap.value[id].endDate).getTime())

    if (dates.length === 0) {
      return undefined
    }

    const localeDate = dayjs(Math.max(...dates))

    return localeDate.utc()
  })

  const maxDate = computed(() => {
    if (formData.depends === undefined || formData.depends === null) {
      return undefined
    }

    if (formData.depends.length === 0) {
      return undefined
    }

    if (Object.keys(tasksMap.value).length === 0) {
      return undefined
    }

    const dates = formData.depends.map((id) => new Date(tasksMap.value[id].startDate).getTime())

    if (dates.length === 0) {
      return undefined
    }

    const localeDate = dayjs(new Date(Math.min(...dates)))

    return localeDate.utc()
  })

  return {
    minDate,
    maxDate,
  }
}
