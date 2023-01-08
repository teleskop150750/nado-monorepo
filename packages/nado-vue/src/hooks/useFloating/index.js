import { arrow as arrowCore, computePosition } from '@floating-ui/dom'
import { isClient, unrefElement } from '@vueuse/core'
import { isNil } from 'lodash-unified'
import { isRef, onMounted, ref, unref, watchEffect } from 'vue'

import { keysOf } from '../../utils/index.js'

export const useFloatingProps = {}

const unrefReference = (elRef) => {
  if (!isClient) {
    return
  }

  if (!elRef) {
    return elRef
  }

  const unrefEl = unrefElement(elRef)

  if (unrefEl) {
    return unrefEl
  }

  return isRef(elRef) ? unrefEl : elRef
}

export const getPositionDataWithUnit = (record, key) => {
  const value = record?.[key]

  return isNil(value) ? '' : `${value}px`
}

export const useFloating = ({ middleware, placement, strategy }) => {
  const referenceRef = ref()
  const contentRef = ref()
  const x = ref()
  const y = ref()
  /** @type {import('@floating-ui/dom/src/types.js').ComputePositionReturn['middlewareData']} */
  const middlewareData = ref({})

  const states = {
    x,
    y,
    placement,
    strategy,
    middlewareData,
  }

  const update = async () => {
    if (!isClient) {
      return
    }

    const referenceEl = unrefReference(referenceRef)
    const contentEl = unrefElement(contentRef)

    if (!referenceEl || !contentEl) {
      return
    }

    const data = await computePosition(referenceEl, contentEl, {
      placement: unref(placement),
      strategy: unref(strategy),
      middleware: unref(middleware),
    })

    keysOf(states).forEach((key) => {
      states[key].value = data[key]
    })
  }

  onMounted(() => {
    watchEffect(() => {
      update()
    })
  })

  return {
    ...states,
    update,
    referenceRef,
    contentRef,
  }
}

export const arrowMiddleware = ({ arrowRef, padding }) => ({
  name: 'arrow',
  options: {
    element: arrowRef,
    padding,
  },

  fn(args) {
    const arrowEl = unref(arrowRef)

    if (!arrowEl) {
      return {}
    }

    return arrowCore({
      element: arrowEl,
      padding,
    }).fn(args)
  },
})
