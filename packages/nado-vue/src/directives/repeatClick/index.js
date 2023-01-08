import { isFunction } from '../../utils/index.js'

export const REPEAT_INTERVAL = 100
export const REPEAT_DELAY = 600

export const vRepeatClick = {
  beforeMount(el, binding) {
    const { value } = binding
    const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction(value) ? {} : value

    let intervalId
    let delayId

    const handler = () => (isFunction(value) ? value() : value.handler())

    const clear = () => {
      if (delayId) {
        clearTimeout(delayId)
        delayId = undefined
      }

      if (intervalId) {
        clearInterval(intervalId)
        intervalId = undefined
      }
    }

    el.addEventListener('mousedown', (evt) => {
      if (evt.button !== 0) {
        return
      }

      clear()
      handler()

      document.addEventListener('mouseup', () => clear(), {
        once: true,
      })

      delayId = setTimeout(() => {
        intervalId = setInterval(() => {
          handler()
        }, interval)
      }, delay)
    })
  },
}
