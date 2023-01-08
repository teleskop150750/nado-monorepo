import {
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  LTR,
  PageKey,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  RTL_OFFSET_POS_DESC,
} from './defaults.js'

export const getScrollDir = (prev, cur) => (prev < cur ? FORWARD : BACKWARD)
export const getIsHorizontal = (dir) => dir === LTR || dir === RTL || dir === HORIZONTAL
export const isRTL = (dir) => dir === RTL

let cachedRTLResult = null

export function getRTLOffsetType(recalculate = false) {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement('div')
    const outerStyle = outerDiv.style

    outerStyle.width = '50px'
    outerStyle.height = '50px'
    outerStyle.overflow = 'scroll'
    outerStyle.direction = 'rtl'
    const innerDiv = document.createElement('div')
    const innerStyle = innerDiv.style

    innerStyle.width = '100px'
    innerStyle.height = '100px'
    outerDiv.append(innerDiv)
    document.body.append(outerDiv)

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = RTL_OFFSET_POS_DESC
    } else {
      outerDiv.scrollLeft = 1

      cachedRTLResult = outerDiv.scrollLeft === 0 ? RTL_OFFSET_NAG : RTL_OFFSET_POS_ASC
    }

    outerDiv.remove()

    return cachedRTLResult
  }

  return cachedRTLResult
}

export const getRelativePos = (e, layout) => ('touches' in e ? e.touches[0][PageKey[layout]] : e[PageKey[layout]])

export function renderThumbStyle({ move, size, bar }, layout) {
  const style = {}
  const translate = `translate${bar.axis}(${move}px)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate

  if (layout === 'horizontal') {
    style.height = '100%'
  } else {
    style.width = '100%'
  }

  return style
}
