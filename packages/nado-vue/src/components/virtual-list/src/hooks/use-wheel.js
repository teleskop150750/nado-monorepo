import { cAF, isFirefox, rAF } from '../../../../utils/index.js'
import { HORIZONTAL, VERTICAL } from '../defaults.js'

const LayoutKeys = {
  [HORIZONTAL]: 'deltaX',
  [VERTICAL]: 'deltaY',
}
const useWheel = ({ atEndEdge, atStartEdge, layout }, onWheelDelta) => {
  let frameHandle
  let offset = 0
  // let scrollLock = false
  // let lockHandle = null
  // const lockScroll = () => {
  //   clearTimeout(lockHandle)
  //   scrollLock = true
  //   lockHandle = setTimeout(() => scrollLock = false, 50)
  // }
  const hasReachedEdge = (offsetValue) => {
    const edgeReached = (offsetValue < 0 && atStartEdge.value) || (offsetValue > 0 && atEndEdge.value)

    return edgeReached
  }

  const onWheel = (evt) => {
    cAF(frameHandle)
    const newOffset = evt[LayoutKeys[layout.value]]

    if (hasReachedEdge(offset) && hasReachedEdge(offset + newOffset)) {
      return
    }

    offset += newOffset

    if (!isFirefox()) {
      evt.preventDefault()
    }

    frameHandle = rAF(() => {
      onWheelDelta(offset)
      offset = 0
    })
  }

  return {
    hasReachedEdge,
    onWheel,
  }
}

export default useWheel
