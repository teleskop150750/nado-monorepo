import { unref } from 'vue'

import { useTimeout } from '../useTimeout/index.js'

export const useDelayedToggleProps = {
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
}
export const useDelayedToggle = ({ showAfter, hideAfter, open, close }) => {
  const { registerTimeout } = useTimeout()

  /**
   * @param {?Event} evt
   */
  const onOpen = (evt = null) => {
    registerTimeout(() => {
      open(evt)
    }, unref(showAfter))
  }

  /**
   * @param {?Event} evt
   */
  const onClose = (evt = null) => {
    registerTimeout(() => {
      close(evt)
    }, unref(hideAfter))
  }

  return {
    onOpen,
    onClose,
  }
}
