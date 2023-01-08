/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
import { nextTick, ref, watch } from 'vue'

// import { shouldIgnoreKey } from '../../utils/private/key-composition.js'

// leave NAMED_MASKS at top of file (code referenced from docs)
const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####',
}

const TOKENS = {
  '#': { pattern: '[\\d]', negate: '[^\\d]' },

  S: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]' },
  N: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]' },

  A: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: (v) => v.toLocaleUpperCase() },
  a: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: (v) => v.toLocaleLowerCase() },

  X: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: (v) => v.toLocaleUpperCase() },
  x: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: (v) => v.toLocaleLowerCase() },
}

const KEYS = Object.keys(TOKENS)

KEYS.forEach((key) => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern)
})

const tokenRegexMask = new RegExp(`\\\\([^.*+?^\${}()|([\\]])|([.*+?^\${}()|[\\]])|([${KEYS.join('')}])|(.)`, 'g')
const escRegex = /[$()*+.?[\\\]^{|}]/g

const MARKER = String.fromCodePoint(1)

export const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean,
}

export const useMask = (props, emit, emitValue, inputRef) => {
  let maskMarked
  let maskReplaced
  let computedMask
  let computedUnmask

  const hasMask = ref(null)
  const innerValue = ref(getInitialMaskedValue())

  function getIsTypeText() {
    return ['textarea', 'text', 'search', 'url', 'tel', 'password'].includes(props.type)
  }

  watch(() => props.type, updateMaskInternals)

  watch(
    () => props.mask,
    (v) => {
      if (v !== undefined) {
        updateMaskValue(innerValue.value, true)
      } else {
        const val = unmaskValue(innerValue.value)

        updateMaskInternals()
        props.modelValue !== val && emit('update:modelValue', val)
      }
    },
  )

  watch(
    () => props.fillMask + props.reverseFillMask,
    () => {
      hasMask.value === true && updateMaskValue(innerValue.value, true)
    },
  )

  watch(
    () => props.unmaskedValue,
    () => {
      hasMask.value === true && updateMaskValue(innerValue.value)
    },
  )

  function getInitialMaskedValue() {
    updateMaskInternals()

    if (hasMask.value === true) {
      const masked = maskValue(unmaskValue(props.modelValue))

      return props.fillMask !== false ? fillWithMask(masked) : masked
    }

    return props.modelValue
  }

  function getPaddedMaskMarked(size) {
    if (size < maskMarked.length) {
      return maskMarked.slice(-size)
    }

    let pad = ''
    let localMaskMarked = maskMarked
    const padPos = localMaskMarked.indexOf(MARKER)

    if (padPos > -1) {
      for (let i = size - localMaskMarked.length; i > 0; i--) {
        pad += MARKER
      }

      localMaskMarked = localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos)
    }

    return localMaskMarked
  }

  function updateMaskInternals() {
    hasMask.value = props.mask !== undefined && props.mask.length > 0 && getIsTypeText()

    if (hasMask.value === false) {
      computedUnmask = undefined
      maskMarked = ''
      maskReplaced = ''

      return
    }

    const localComputedMask = NAMED_MASKS[props.mask] === undefined ? props.mask : NAMED_MASKS[props.mask]
    const fillChar = typeof props.fillMask === 'string' && props.fillMask.length > 0 ? props.fillMask.slice(0, 1) : '_'
    const fillCharEscaped = fillChar.replace(escRegex, '\\$&')
    const unmask = []
    const extract = []
    const mask = []

    let firstMatch = props.reverseFillMask === true
    let unmaskChar = ''
    let negateChar = ''

    localComputedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
      if (token !== undefined) {
        const c = TOKENS[token]

        mask.push(c)
        negateChar = c.negate

        if (firstMatch === true) {
          extract.push(`(?:${negateChar}+)?(${c.pattern}+)?(?:${negateChar}+)?(${c.pattern}+)?`)
          firstMatch = false
        }

        extract.push(`(?:${negateChar}+)?(${c.pattern})?`)
      } else if (esc !== undefined) {
        unmaskChar = `\\${esc === '\\' ? '' : esc}`
        mask.push(esc)
        unmask.push(`([^${unmaskChar}]+)?${unmaskChar}?`)
      } else {
        const c = char1 !== undefined ? char1 : char2

        unmaskChar = c === '\\' ? '\\\\\\\\' : c.replace(escRegex, '\\\\$&')
        mask.push(c)
        unmask.push(`([^${unmaskChar}]+)?${unmaskChar}?`)
      }
    })

    const unmaskMatcher = new RegExp(
      `^${unmask.join('')}(${unmaskChar === '' ? '.' : `[^${unmaskChar}]`}+)?${
        unmaskChar === '' ? '' : `[${unmaskChar}]*`
      }$`,
    )
    const extractLast = extract.length - 1
    const extractMatcher = extract.map((re, index) => {
      if (index === 0 && props.reverseFillMask === true) {
        return new RegExp(`^${fillCharEscaped}*${re}`)
      }

      if (index === extractLast) {
        return new RegExp(
          `^${re}(${negateChar === '' ? '.' : negateChar}+)?${
            props.reverseFillMask === true ? '$' : `${fillCharEscaped}*`
          }`,
        )
      }

      return new RegExp(`^${re}`)
    })

    computedMask = mask
    computedUnmask = (val) => {
      const unmaskMatch = unmaskMatcher.exec(props.reverseFillMask === true ? val : val.slice(0, mask.length))

      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join('')
      }

      const extractMatch = []
      const extractMatcherLength = extractMatcher.length

      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[i].exec(str)

        if (m === null) {
          break
        }

        str = str.slice(m.shift().length)
        extractMatch.push(...m)
      }

      if (extractMatch.length > 0) {
        return extractMatch.join('')
      }

      return val
    }
    maskMarked = mask.map((v) => (typeof v === 'string' ? v : MARKER)).join('')
    maskReplaced = maskMarked.split(MARKER).join(fillChar)
  }

  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value
    const end = inp.selectionEnd
    const endReverse = inp.value.length - end
    const unmasked = unmaskValue(rawVal)

    // Update here so unmask uses the original fillChar
    updateMaskInternalsFlag === true && updateMaskInternals()

    const preMasked = maskValue(unmasked)
    const masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked
    const changed = innerValue.value !== masked

    // We want to avoid "flickering" so we set value immediately
    inp.value !== masked && (inp.value = masked)

    changed === true && (innerValue.value = masked)

    document.activeElement === inp &&
      nextTick(() => {
        if (masked === maskReplaced) {
          const cursor = props.reverseFillMask === true ? maskReplaced.length : 0

          inp.setSelectionRange(cursor, cursor, 'forward')

          return
        }

        if (inputType === 'insertFromPaste' && props.reverseFillMask !== true) {
          const cursor = end - 1

          moveCursor.right(inp, cursor, cursor)

          return
        }

        if (['deleteContentBackward', 'deleteContentForward'].includes(inputType)) {
          const cursor =
            props.reverseFillMask === true
              ? end === 0
                ? masked.length > preMasked.length
                  ? 1
                  : 0
                : Math.max(
                    0,
                    masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1),
                  ) + 1
              : end

          inp.setSelectionRange(cursor, cursor, 'forward')

          return
        }

        if (props.reverseFillMask === true) {
          if (changed === true) {
            const cursor = Math.max(
              0,
              masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)),
            )

            if (cursor === 1 && end === 1) {
              inp.setSelectionRange(cursor, cursor, 'forward')
            } else {
              moveCursor.rightReverse(inp, cursor, cursor)
            }
          } else {
            const cursor = masked.length - endReverse

            inp.setSelectionRange(cursor, cursor, 'backward')
          }
        } else if (changed === true) {
          const cursor = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1)

          moveCursor.right(inp, cursor, cursor)
        } else {
          const cursor = end - 1

          moveCursor.right(inp, cursor, cursor)
        }
      })

    const val = props.unmaskedValue === true ? unmaskValue(masked) : masked

    String(props.modelValue) !== val && emitValue(val, true)
  }

  function moveCursorForPaste(inp, start, end) {
    const preMasked = maskValue(unmaskValue(inp.value))

    start = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, start))

    inp.setSelectionRange(start, end, 'forward')
  }

  const moveCursor = {
    left(inp, start, end, selection) {
      const noMarkBefore = !maskMarked.slice(start - 1).includes(MARKER)
      let i = Math.max(0, start - 1)

      for (; i >= 0; i--) {
        if (maskMarked[i] === MARKER) {
          start = i
          noMarkBefore === true && start++
          break
        }
      }

      if (i < 0 && maskMarked[start] !== undefined && maskMarked[start] !== MARKER) {
        return moveCursor.right(inp, 0, 0)
      }

      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, 'backward')
    },

    right(inp, start, end, selection) {
      const limit = inp.value.length
      let i = Math.min(limit, end + 1)

      for (; i <= limit; i++) {
        if (maskMarked[i] === MARKER) {
          end = i
          break
        } else if (maskMarked[i - 1] === MARKER) {
          end = i
        }
      }

      if (i > limit && maskMarked[end - 1] !== undefined && maskMarked[end - 1] !== MARKER) {
        return moveCursor.left(inp, limit, limit)
      }

      inp.setSelectionRange(selection ? start : end, end, 'forward')
    },

    leftReverse(inp, start, end, selection) {
      const localMaskMarked = getPaddedMaskMarked(inp.value.length)
      let i = Math.max(0, start - 1)

      for (; i >= 0; i--) {
        if (localMaskMarked[i - 1] === MARKER) {
          start = i
          break
        } else if (localMaskMarked[i] === MARKER) {
          start = i

          if (i === 0) {
            break
          }
        }
      }

      if (i < 0 && localMaskMarked[start] !== undefined && localMaskMarked[start] !== MARKER) {
        return moveCursor.rightReverse(inp, 0, 0)
      }

      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, 'backward')
    },

    rightReverse(inp, start, end, selection) {
      const limit = inp.value.length
      const localMaskMarked = getPaddedMaskMarked(limit)
      const noMarkBefore = !localMaskMarked.slice(0, end + 1).includes(MARKER)
      let i = Math.min(limit, end + 1)

      for (; i <= limit; i++) {
        if (localMaskMarked[i - 1] === MARKER) {
          end = i
          end > 0 && noMarkBefore === true && end--
          break
        }
      }

      if (i > limit && localMaskMarked[end - 1] !== undefined && localMaskMarked[end - 1] !== MARKER) {
        return moveCursor.leftReverse(inp, limit, limit)
      }

      inp.setSelectionRange(selection === true ? start : end, end, 'forward')
    },
  }

  function onMaskedKeydown(e) {
    const inp = inputRef.value
    const start = inp.selectionStart
    const end = inp.selectionEnd

    if (e.keyCode === 37 || e.keyCode === 39) {
      // Left / Right
      const fn = moveCursor[(e.keyCode === 39 ? 'right' : 'left') + (props.reverseFillMask === true ? 'Reverse' : '')]

      e.preventDefault()
      fn(inp, start, end, e.shiftKey)
    } else if (
      e.keyCode === 8 && // Backspace
      props.reverseFillMask !== true &&
      start === end
    ) {
      moveCursor.left(inp, start, end, true)
    } else if (
      e.keyCode === 46 && // Delete
      props.reverseFillMask === true &&
      start === end
    ) {
      moveCursor.rightReverse(inp, start, end, true)
    }
  }

  function maskValue(val) {
    if (val === undefined || val === null || val === '') {
      return ''
    }

    if (props.reverseFillMask === true) {
      return maskValueReverse(val)
    }

    const mask = computedMask

    let valIndex = 0
    let output = ''

    for (const maskDef of mask) {
      const valChar = val[valIndex]

      if (typeof maskDef === 'string') {
        output += maskDef
        valChar === maskDef && valIndex++
      } else if (valChar !== undefined && maskDef.regex.test(valChar)) {
        output += maskDef.transform !== undefined ? maskDef.transform(valChar) : valChar
        valIndex++
      } else {
        return output
      }
    }

    return output
  }

  function maskValueReverse(val) {
    const mask = computedMask
    const firstTokenIndex = maskMarked.indexOf(MARKER)

    let valIndex = val.length - 1
    let output = ''

    for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex > -1; maskIndex--) {
      const maskDef = mask[maskIndex]

      let valChar = val[valIndex]

      if (typeof maskDef === 'string') {
        output = maskDef + output
        valChar === maskDef && valIndex--
      } else if (valChar !== undefined && maskDef.regex.test(valChar)) {
        do {
          output = (maskDef.transform !== undefined ? maskDef.transform(valChar) : valChar) + output
          valIndex--
          valChar = val[valIndex]
          // eslint-disable-next-line no-unmodified-loop-condition
        } while (firstTokenIndex === maskIndex && valChar !== undefined && maskDef.regex.test(valChar))
      } else {
        return output
      }
    }

    return output
  }

  function unmaskValue(val) {
    return typeof val !== 'string' || computedUnmask === undefined
      ? typeof val === 'number'
        ? computedUnmask(`${val}`)
        : val
      : computedUnmask(val)
  }

  function fillWithMask(val) {
    if (maskReplaced.length - val.length <= 0) {
      return val
    }

    return props.reverseFillMask === true && val.length > 0
      ? maskReplaced.slice(0, -val.length) + val
      : val + maskReplaced.slice(val.length)
  }

  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown,
  }
}
