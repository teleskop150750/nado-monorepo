import { ref, watch } from 'vue'

import { makeList } from '../../../date-time-picker/index.js'

const makeAvailableArr = (disabledList) => {
  const trueOrNumber = (isDisabled, index) => isDisabled || index

  const getNumber = (predicate) => predicate !== true

  return disabledList.map(trueOrNumber).filter(getNumber)
}

export const getTimeLists = (disabledHours, disabledMinutes, disabledSeconds) => {
  const getHoursList = (role, compare) => makeList(24, disabledHours && (() => disabledHours?.(role, compare)))

  const getMinutesList = (hour, role, compare) =>
    makeList(60, disabledMinutes && (() => disabledMinutes?.(hour, role, compare)))

  const getSecondsList = (hour, minute, role, compare) =>
    makeList(60, disabledSeconds && (() => disabledSeconds?.(hour, minute, role, compare)))

  return {
    getHoursList,
    getMinutesList,
    getSecondsList,
  }
}

export const buildAvailableTimeSlotGetter = (disabledHours, disabledMinutes, disabledSeconds) => {
  const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(disabledHours, disabledMinutes, disabledSeconds)

  const getAvailableHours = (role, compare) => makeAvailableArr(getHoursList(role, compare))

  const getAvailableMinutes = (hour, role, compare) => makeAvailableArr(getMinutesList(hour, role, compare))

  const getAvailableSeconds = (hour, minute, role, compare) =>
    makeAvailableArr(getSecondsList(hour, minute, role, compare))

  return {
    getAvailableHours,
    getAvailableMinutes,
    getAvailableSeconds,
  }
}

export const useOldValue = (props) => {
  const oldValue = ref(props.parsedValue)

  watch(
    () => props.visible,
    (val) => {
      if (!val) {
        oldValue.value = props.parsedValue
      }
    },
  )

  return oldValue
}
