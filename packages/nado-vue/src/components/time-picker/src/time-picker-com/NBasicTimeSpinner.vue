<!-- eslint-disable no-use-before-define -->
<script setup>
import { debounce } from 'lodash-unified'
import { computed, inject, nextTick, onMounted, ref, unref, watch } from 'vue'

import { vRepeatClick } from '../../../../directives/index.js'
import { useNamespace } from '../../../../hooks/index.js'
import { NIconChevronDown, NIconChevronUp } from '../../../../icons/index.js'
import { PICKER_BASE_INJECTION_KEY } from '../../../../tokens/picker.js'
import { buildTimeList } from '../../../date-time-picker/index.js'
import { NScrollbar } from '../../../scrollbar/index.js'
import { getTimeLists } from '../composables/useTimePicker.js'
import { timeUnits } from '../constants.js'
import { basicTimeSpinnerProps } from '../props/basic-time-spinner-props.js'

const props = defineProps(basicTimeSpinnerProps)
const emit = defineEmits(['change', 'select-range', 'set-option'])

const ns = useNamespace('time')

const dataTimePicker = inject(PICKER_BASE_INJECTION_KEY)

const currentSpinner = ref('')
const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(
  props.disabledHours,
  props.disabledMinutes,
  props.disabledSeconds,
)

// data
let isScrolling = false

const currentScrollbar = ref()
const listHoursRef = ref()
const listMinutesRef = ref()
const listSecondsRef = ref()
const listRefsMap = {
  hours: listHoursRef,
  minutes: listMinutesRef,
  seconds: listSecondsRef,
}

const scrollBarHeight = (type) => unref(listRefsMap[type]).$el.offsetHeight

// computed
const spinnerItems = computed(() => (props.showSeconds ? timeUnits : timeUnits.slice(0, 2)))

const timePartials = computed(() => {
  const { spinnerDate } = props
  const hours = spinnerDate.hour()
  const minutes = spinnerDate.minute()
  const seconds = spinnerDate.second()

  return { hours, minutes, seconds }
})

const timeList = computed(() => {
  const { hours, minutes } = unref(timePartials)

  return {
    hours: getHoursList(props.role),
    minutes: getMinutesList(hours, props.role),
    seconds: getSecondsList(hours, minutes, props.role),
  }
})

const arrowControlTimeList = computed(() => {
  const { hours, minutes, seconds } = unref(timePartials)

  return {
    hours: buildTimeList(hours, 23),
    minutes: buildTimeList(minutes, 59),
    seconds: buildTimeList(seconds, 59),
  }
})

const adjustCurrentSpinner = (type) => {
  adjustSpinner(type, unref(timePartials)[type])
}
const debouncedResetScroll = debounce((type) => {
  isScrolling = false
  adjustCurrentSpinner(type)
}, 200)

/**
 * @param {number} hour
 */
const getAmPmFlag = (hour) => {
  const shouldShowAmPm = !!props.amPmMode

  if (!shouldShowAmPm) {
    return ''
  }

  const isCapital = props.amPmMode === 'A'
  // todo locale
  let content = hour < 12 ? ' am' : ' pm'

  if (isCapital) {
    content = content.toUpperCase()
  }

  return content
}

const emitSelectRange = (type) => {
  let range

  switch (type) {
    case 'hours': {
      range = [0, 2]
      break
    }
    case 'minutes': {
      range = [3, 5]
      break
    }
    case 'seconds': {
      range = [6, 8]
      break
    }
    default:
    // No default
  }

  currentSpinner.value = type
  const [left, right] = range

  emit('select-range', left, right)
  currentScrollbar.value = type
}

const adjustSpinners = () => {
  adjustCurrentSpinner('hours')
  adjustCurrentSpinner('minutes')
  adjustCurrentSpinner('seconds')
}

/**
 * @param {HTMLElement} el
 */
const getScrollbarElement = (el) => el.querySelector(`.${ns.namespace}-scrollbar__wrap`)

const typeItemHeight = (type) => {
  const scrollbar = unref(listRefsMap[type])

  return scrollbar?.$el.querySelector('li').offsetHeight || 0
}

const adjustSpinner = (type, value) => {
  if (props.arrowControl) {
    return
  }

  const scrollbar = unref(listRefsMap[type])

  if (scrollbar && scrollbar.$el) {
    getScrollbarElement(scrollbar.$el).scrollTop = Math.max(0, value * typeItemHeight(type))
  }
}

/**
 * @param {any} type
 * @param {number} now
 * @param {number} step
 * @param {number} total
 */
const findNextUnDisabled = (type, now, step, total) => {
  let next = (now + step + total) % total
  const list = unref(timeList)[type]

  while (list[next] && next !== now) {
    next = (next + step + total) % total
  }

  return next
}

/**
 * @param {number} step
 */
const scrollDown = (step) => {
  if (!currentScrollbar.value) {
    emitSelectRange('hours')
  }

  const label = currentScrollbar.value
  const now = unref(timePartials)[label]
  const total = currentScrollbar.value === 'hours' ? 24 : 60
  const next = findNextUnDisabled(label, now, step, total)

  modifyDateField(label, next)
  adjustSpinner(label, next)
  nextTick(() => emitSelectRange(label))
}

const onIncrement = () => {
  scrollDown(1)
}

const onDecrement = () => {
  scrollDown(-1)
}

/**
 * @param {any} type
 * @param {number} value
 */
const modifyDateField = (type, value) => {
  const list = unref(timeList)[type]
  const isDisabled = list[value]

  if (isDisabled) {
    return
  }

  const { hours, minutes, seconds } = unref(timePartials)

  let changeTo

  switch (type) {
    case 'hours': {
      changeTo = props.spinnerDate.hour(value).minute(minutes)
      break
    }
    case 'minutes': {
      changeTo = props.spinnerDate.hour(hours).minute(value).second(seconds)
      break
    }
    case 'seconds': {
      changeTo = props.spinnerDate.hour(hours).minute(minutes).second(value)
      break
    }
    default:
    // No default
  }

  emit('change', changeTo)
}

const handleClick = (type, { value, disabled }) => {
  if (!disabled) {
    modifyDateField(type, value)
    emitSelectRange(type)
    adjustSpinner(type, value)
  }
}

const handleScroll = (type) => {
  if (dataTimePicker?.isClearing.value) {
    return
  }

  isScrolling = true
  debouncedResetScroll(type)
  const value = Math.min(
    Math.round(
      (getScrollbarElement(unref(listRefsMap[type]).$el).scrollTop -
        (scrollBarHeight(type) * 0.5 - 10) / typeItemHeight(type) +
        3) /
        typeItemHeight(type),
    ),
    type === 'hours' ? 23 : 59,
  )

  modifyDateField(type, value)
}
const bindScrollEvent = () => {
  const bindFunction = (type) => {
    const scrollbar = unref(listRefsMap[type])

    if (scrollbar && scrollbar.$el) {
      getScrollbarElement(scrollbar.$el).addEventListener('scroll', () => {
        // TODO: scroll is emitted when set scrollTop programmatically
        // should find better solutions in the future!
        handleScroll(type)
      })
      // useEventListener(scrollbar.$el, 'scroll', () => {
      //   handleScroll(type)
      // })
    }
  }

  bindFunction('hours')
  bindFunction('minutes')
  bindFunction('seconds')
}

onMounted(() => {
  nextTick(() => {
    !props.arrowControl && bindScrollEvent()
    adjustSpinners()

    // set selection on the first hour part
    if (props.role === 'start') {
      emitSelectRange('hours')
    }
  })
})

const setRef = (scrollbar, type) => {
  listRefsMap[type].value = scrollbar
}

emit('set-option', [`${props.role}_scrollDown`, scrollDown])
emit('set-option', [`${props.role}_emitSelectRange`, emitSelectRange])

watch(
  () => props.spinnerDate,
  () => {
    if (isScrolling) {
      return
    }

    adjustSpinners()
  },
)
</script>

<template>
  <div :class="[ns.b('spinner'), ns.bHas('spinner', 'seconds', showSeconds)]">
    <template v-if="!arrowControl">
      <NScrollbar
        v-for="item in spinnerItems"
        :key="item"
        :ref="(scrollbar) => setRef(scrollbar, item)"
        :class="[ns.be('spinner', 'wrapper'), ns.beIs('spinner', 'wrapper', 'active', item === currentSpinner)]"
        wrap-style="max-height: inherit;"
        :view-class="ns.be('spinner', 'list')"
        noresize
        tag="ul"
        @mouseenter="emitSelectRange(item)"
        @mousemove="adjustCurrentSpinner(item)"
      >
        <li
          v-for="(disabled, key) in timeList[item]"
          :key="key"
          :class="[
            ns.be('spinner', 'item'),
            ns.beIs('spinner', 'item', 'active', key === timePartials[item]),
            ns.beIs('spinner', 'item', 'disabled', disabled),
          ]"
          @click="handleClick(item, { value: key, disabled })"
        >
          <template v-if="item === 'hours'">
            {{ ('0' + (amPmMode ? key % 12 || 12 : key)).slice(-2) }}{{ getAmPmFlag(key) }}
          </template>
          <template v-else>
            {{ ('0' + key).slice(-2) }}
          </template>
        </li>
      </NScrollbar>
    </template>
    <template v-if="arrowControl">
      <div
        v-for="item in spinnerItems"
        :key="item"
        :ref="(scrollbar) => setRef(scrollbar, item)"
        :class="[
          ns.be('spinner', 'wrapper'),
          ns.beIs('spinner', 'wrapper', 'arrow'),
          ns.beIs('spinner', 'wrapper', 'active', item === currentSpinner),
        ]"
        @mouseenter="emitSelectRange(item)"
      >
        <span v-repeat-click="onDecrement" class="arrow-up" :class="[ns.be('spinner', 'arrow')]">
          <NIconChevronUp />
        </span>
        <span v-repeat-click="onIncrement" class="arrow-down" :class="[ns.be('spinner', 'arrow')]">
          <NIconChevronDown />
        </span>
        <ul :class="ns.be('spinner', 'list')">
          <li
            v-for="(time, key) in arrowControlTimeList[item]"
            :key="key"
            :class="[
              ns.be('spinner', 'item'),
              ns.beIs('spinner', 'item', 'active', time === timePartials[item]),
              ns.beIs('spinner', 'item', 'disabled', timeList[item][time]),
            ]"
          >
            <template v-if="typeof time === 'number'">
              <template v-if="item === 'hours'">
                {{ ('0' + (amPmMode ? time % 12 || 12 : time)).slice(-2) }}{{ getAmPmFlag(time) }}
              </template>
              <template v-else>
                {{ ('0' + time).slice(-2) }}
              </template>
            </template>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
