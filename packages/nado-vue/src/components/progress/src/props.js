const appearances = new Set(['primary', 'secondary', 'info', 'success', 'warn', 'error'])

export const progressProps = {
  type: {
    type: String,
    default: 'line',
    validator(val) {
      return ['line', 'circle', 'dashboard'].includes(val)
    },
  },
  percentage: {
    type: Number,
    default: 0,
    validator: (val) => val >= 0 && val <= 100,
  },
  appearance: {
    type: String,
    default: 'secondary',
    validator(val) {
      return appearances.has(val)
    },
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3,
  },
  strokeWidth: {
    type: Number,
    default: undefined,
  },
  strokeLinecap: {
    type: String,
    default: 'round',
  },
  textInside: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 126,
  },
  showText: {
    type: Boolean,
    default: true,
  },
  color: {
    type: [String, Array, Function],
    default: '',
  },
  format: {
    type: Function,
    default: (percentage) => `${percentage}%`,
  },
}
