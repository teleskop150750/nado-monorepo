import { isFunction } from '@vue/shared'
import { isClient } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'

import { isBoolean, vmHasRouter } from '../../utils/index.js'
import { getCurrentInstance } from '../getCurrentInstance/index.js'

const _prop = {
  type: Boolean,
  default: null,
}

const _event = {
  type: Function,
}

/**
 * @param {string} name
 */
export const createModelToggleComposable = (name) => {
  const updateEventKey = `update:${name}`
  const updateEventKeyRaw = `onUpdate:${name}`
  const useModelToggleEmits = [updateEventKey]
  const useModelToggleProps = {
    [name]: _prop,
    [updateEventKeyRaw]: _event,
  }

  /**
   * @param {{
   *  indicator: import('vue').Ref<boolean>
   *  toggleReason?: import('vue').Ref<Event | undefined>
   *  shouldHideWhenRouteChanges?: import('vue').Ref<boolean>
   *  shouldProceed?: () => boolean
   *  onShow?: (event?: Event) => void
   *  onHide?: (event?: Event) => void
   * }} ModelToggleParams
   */
  const useModelToggle = ({ indicator, toggleReason, shouldHideWhenRouteChanges, shouldProceed, onShow, onHide }) => {
    const instance = getCurrentInstance('useModelToggle')
    const { emit } = instance
    const { props } = instance
    const hasUpdateHandler = computed(() => isFunction(props[updateEventKeyRaw]))
    // когда оно соответствует значению по умолчанию, мы говорим, что это отсутствует
    // хотя это может быть ошибочно передано пользователем, но нам нужно исключить это
    // условие
    const isModelBindingAbsent = computed(() => props[name] === null)

    /**
     * @param {Event | null} evt
     */
    const doShow = (evt = null) => {
      if (indicator.value === true) {
        return
      }

      indicator.value = true

      if (toggleReason) {
        toggleReason.value = evt
      }

      if (isFunction(onShow)) {
        onShow(evt)
      }
    }

    /**
     * @param {Event | null} evt
     */
    const doHide = (evt = null) => {
      if (indicator.value === false) {
        return
      }

      indicator.value = false

      if (toggleReason) {
        toggleReason.value = evt
      }

      if (isFunction(onHide)) {
        onHide(evt)
      }
    }

    /**
     * @param {Event | null} evt
     */
    const show = (evt = null) => {
      if (props.disabled === true || (isFunction(shouldProceed) && !shouldProceed())) {
        return
      }

      const shouldEmit = hasUpdateHandler.value && isClient

      if (shouldEmit) {
        emit(updateEventKey, true)
      }

      if (isModelBindingAbsent.value || !shouldEmit) {
        doShow(evt)
      }
    }

    /**
     * @param {Event | null} evt
     */
    const hide = (evt = null) => {
      if (props.disabled === true || !isClient) {
        return
      }

      const shouldEmit = hasUpdateHandler.value && isClient

      if (shouldEmit) {
        emit(updateEventKey, false)
      }

      if (isModelBindingAbsent.value || !shouldEmit) {
        doHide(evt)
      }
    }

    /**
     * @param {boolean} val
     */
    const onChange = (val) => {
      if (!isBoolean(val)) {
        return
      }

      if (props.disabled && val) {
        if (hasUpdateHandler.value) {
          emit(updateEventKey, false)
        }
      } else if (indicator.value !== val) {
        if (val) {
          doShow()
        } else {
          doHide()
        }
      }
    }

    const toggle = () => {
      if (indicator.value) {
        hide()
      } else {
        show()
      }
    }

    watch(() => props[name], onChange)

    if (shouldHideWhenRouteChanges && vmHasRouter(instance)) {
      watch(
        () => ({
          // eslint-disable-next-line unicorn/consistent-destructuring
          ...instance.proxy.$route,
        }),
        () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide()
          }
        },
      )
    }

    onMounted(() => {
      // @ts-ignore
      onChange(props[name])
    })

    return {
      hide,
      show,
      toggle,
      hasUpdateHandler,
    }
  }

  return {
    useModelToggle,
    useModelToggleProps,
    useModelToggleEmits,
  }
}
const { useModelToggle, useModelToggleProps, useModelToggleEmits } = createModelToggleComposable('modelValue')

export { useModelToggle, useModelToggleEmits, useModelToggleProps }
