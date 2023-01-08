import { cAF, isFirefox, rAF } from '../../../../utils/index.js'

export const useGridWheel = ({ atXEndEdge, atXStartEdge, atYEndEdge, atYStartEdge }, onWheelDelta) => {
  let frameHandle = null
  let xOffset = 0
  let yOffset = 0
  const hasReachedEdge = (x, y) => {
    const xEdgeReached = (x < 0 && atXStartEdge.value) || (x > 0 && atXEndEdge.value)
    const yEdgeReached = (y < 0 && atYStartEdge.value) || (y > 0 && atYEndEdge.value)

    return xEdgeReached && yEdgeReached
  }
  const onWheel = (evt) => {
    cAF(frameHandle)
    let x = evt.deltaX
    let y = evt.deltaY

    // Имитируйте собственное поведение при использовании сенсорной панели / трекпада для поворота.
    if (Math.abs(x) > Math.abs(y)) {
      y = 0
    } else {
      x = 0
    }

    // Специальный случай для Windows-машины с клавишей shift + колесиком прокрутки
    if (evt.shiftKey && y !== 0) {
      x = y
      y = 0
    }

    if (hasReachedEdge(xOffset, yOffset) && hasReachedEdge(xOffset + x, yOffset + y)) {
      return
    }

    xOffset += x
    yOffset += y

    if (!isFirefox()) {
      evt.preventDefault()
    }

    frameHandle = rAF(() => {
      onWheelDelta(xOffset, yOffset)
      xOffset = 0
      yOffset = 0
    })
  }

  return {
    hasReachedEdge,
    onWheel,
  }
}
