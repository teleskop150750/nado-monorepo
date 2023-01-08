<script setup>
import { isNil } from 'lodash-unified'
import { computed } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { NIconCheck, NIconCheckCircle, NIconClose, NIconCloseCircle, NIconWarning } from '../../../icons/index.js'
import { isFunction, isString } from '../../../utils/index.js'
import { progressProps } from './props.js'

const props = defineProps(progressProps)

defineOptions({
  name: 'NProgress',
})

const STATUS_COLOR_MAP = {
  success: 'var(--n-sys-color-success)',
  error: 'var(--n-sys-color-error)',
  warn: 'var(--n-sys-color-warn)',
  primary: 'var(--n-sys-color-primary)',
  default: 'var(--n-sys-color-secondary)',
}

const ns = useNamespace('progress')

/** @type {import('vue').ComputedRef<any>} */
const strokeLinecap = computed(() => props.strokeLinecap)

const compStrokeWidth = computed(() => {
  if (isNil(props.strokeWidth)) {
    return props.textInside ? 24 : 6
  }

  return props.strokeWidth
})

const barStyle = computed(() => ({
  width: `${props.percentage}%`,
  animationDuration: `${props.duration}s`,
  backgroundColor: getCurrentColor(props.percentage),
}))

const relativeStrokeWidth = computed(() => ((compStrokeWidth.value / props.width) * 100).toFixed(1))

const radius = computed(() => {
  if (['circle', 'dashboard'].includes(props.type)) {
    return Number.parseInt(`${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`)
  }

  return 0
})

const trackPath = computed(() => {
  const r = radius.value
  const isDashboard = props.type === 'dashboard'

  return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${r}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? '-' : ''}${r * 2}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? '' : '-'}${r * 2}
          `
})

const perimeter = computed(() => 2 * Math.PI * radius.value)

const rate = computed(() => (props.type === 'dashboard' ? 0.75 : 1))

const strokeDashoffset = computed(() => {
  const offset = (-1 * perimeter.value * (1 - rate.value)) / 2

  return `${offset}px`
})

const trailPathStyle = computed(() => ({
  strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value,
}))

const circlePathStyle = computed(() => ({
  strokeDasharray: `${perimeter.value * rate.value * (props.percentage / 100)}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value,
  transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s',
}))

const stroke = computed(() =>
  props.color ? getCurrentColor(props.percentage) : STATUS_COLOR_MAP[props.appearance] || STATUS_COLOR_MAP.default,
)

const statusIcon = computed(() => {
  if (props.appearance === 'warn') {
    return NIconWarning
  }

  if (props.type === 'line') {
    return props.appearance === 'success' ? NIconCheckCircle : NIconCloseCircle
  }

  return props.appearance === 'success' ? NIconCheck : NIconClose
})

const progressTextSize = computed(() =>
  props.type === 'line' ? 12 + compStrokeWidth.value * 0.4 : props.width * 0.111_111 + 2,
)

const content = computed(() => props.format(props.percentage))

const canShowPercentageContent = computed(() => ['primary', 'secondary'].includes(props.appearance))

function getColors(color) {
  const span = 100 / color.length
  const seriesColors = color.map((seriesColor, index) => {
    if (isString(seriesColor)) {
      return {
        color: seriesColor,
        percentage: (index + 1) * span,
      }
    }

    return seriesColor
  })

  return seriesColors.sort((a, b) => a.percentage - b.percentage)
}

function getCurrentColor(percentage) {
  const { color } = props

  if (isFunction(color)) {
    return color(percentage)
  }

  if (isString(color)) {
    return color
  }

  const colors = getColors(color)

  for (const _color of colors) {
    if (_color.percentage > percentage) {
      return _color.color
    }
  }

  return colors.at(-1)?.color
}
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(`type-${type}`),
      ns.m(`appearance-${appearance}`),
      {
        [ns.m('without-text')]: !showText,
        [ns.m('text-inside')]: textInside,
      },
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div v-if="type === 'line'" :class="ns.b('bar')">
      <div :class="ns.be('bar', 'outer')" :style="{ height: `${compStrokeWidth}px` }">
        <div
          :class="[ns.be('bar', 'inner'), { [ns.bem('bar', 'inner', 'indeterminate')]: indeterminate }]"
          :style="barStyle"
        >
          <div v-if="(showText || $slots.default) && textInside" :class="ns.be('bar', 'inner-text')">
            <slot :percentage="percentage">
              <span>{{ content }}</span>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-else :class="ns.b('circle')" :style="{ height: `${width}px`, width: `${width}px` }">
      <svg viewBox="0 0 100 100">
        <path
          :class="ns.be('circle', 'track')"
          :d="trackPath"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        />
        <path
          :class="ns.be('circle', 'path')"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          :opacity="percentage ? 1 : 0"
          :stroke-linecap="strokeLinecap"
          :stroke-width="relativeStrokeWidth"
          :style="circlePathStyle"
        />
      </svg>
    </div>
    <div
      v-if="(showText || $slots.default) && !textInside"
      :class="ns.e('text')"
      :style="{ fontSize: `${progressTextSize}px` }"
    >
      <slot :percentage="percentage">
        <span v-if="canShowPercentageContent">{{ content }}</span>
        <span v-else :class="ns.e('icon')"><component :is="statusIcon" /></span>
      </slot>
    </div>
  </div>
</template>
