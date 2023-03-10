export const useTimePanel = ({ getAvailableHours, getAvailableMinutes, getAvailableSeconds }) => {
  const getAvailableTime = (date, role, first, compareDate = undefined) => {
    const availableTimeGetters = {
      hour: getAvailableHours,
      minute: getAvailableMinutes,
      second: getAvailableSeconds,
    }
    let result = date

    // eslint-disable-next-line semi-style
    ;['hour', 'minute', 'second'].forEach((type) => {
      if (availableTimeGetters[type]) {
        let availableTimeSlots
        const method = availableTimeGetters[type]

        switch (type) {
          case 'minute': {
            availableTimeSlots = method(result.hour(), role, compareDate)
            break
          }
          case 'second': {
            availableTimeSlots = method(result.hour(), result.minute(), role, compareDate)
            break
          }
          default: {
            availableTimeSlots = method(role, compareDate)
            break
          }
        }

        if (availableTimeSlots?.length && !availableTimeSlots.includes(result[type]())) {
          const pos = first ? 0 : availableTimeSlots.length - 1

          result = result[type](availableTimeSlots[pos])
        }
      }
    })

    return result
  }

  const timePickerOptions = {}

  const onSetOption = ([key, val]) => {
    timePickerOptions[key] = val
  }

  return {
    timePickerOptions,

    getAvailableTime,
    onSetOption,
  }
}
