import { isNumber, useTimeoutFn } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, provide, ref, unref, watch } from 'vue'

import { useId, useNamespace } from '../../../hooks/index.js'
import { TOOLTIP_V2_OPEN, tooltipV2RootKey } from '../../../tokens/index.js'
import { createComponent, isPropAbsent } from '../../../utils/index.js'
import { tooltipRootProps } from './rootProps.js'

export const NTooltipRoot = createComponent({
  name: 'NTooltipRoot',
  props: tooltipRootProps,
  setup(props, { expose, slots }) {
    /**
     * внутреннее открытое состояние, когда значение модели не было предоставлено,
     * вместо этого используйте его как индикатор
     */
    const _open = ref(props.defaultOpen)
    const triggerRef = ref(null)

    const open = computed({
      get: () => (isPropAbsent(props.open) ? _open.value : props.open),
      set: (val) => {
        _open.value = val
        props['onUpdate:open']?.(val)
      },
    })

    const isOpenDelayed = computed(() => isNumber(props.delayDuration) && props.delayDuration > 0)

    const { start: onDelayedOpen, stop: clearTimer } = useTimeoutFn(
      () => {
        open.value = true
      },
      computed(() => props.delayDuration),
      {
        immediate: false,
      },
    )

    const ns = useNamespace('tooltip')

    const contentId = useId()

    function onNormalOpen() {
      clearTimer()
      open.value = true
    }

    function onDelayOpen() {
      unref(isOpenDelayed) ? onDelayedOpen() : onNormalOpen()
    }

    const onOpen = onNormalOpen

    function onClose() {
      clearTimer()
      open.value = false
    }

    function onChange(openVal) {
      if (openVal) {
        document.dispatchEvent(new CustomEvent(TOOLTIP_V2_OPEN))
        onOpen()
      }

      props.onOpenChange?.(openVal)
    }

    watch(open, onChange)

    onMounted(() => {
      // Держит открытой только 1 всплывающую подсказку за раз
      document.addEventListener(TOOLTIP_V2_OPEN, onClose)
    })

    onBeforeUnmount(() => {
      clearTimer()
      document.removeEventListener(TOOLTIP_V2_OPEN, onClose)
    })

    provide(tooltipV2RootKey, {
      contentId,
      triggerRef,
      ns,

      onClose,
      onDelayOpen,
      onOpen,
    })

    expose({
      /**
       * @description открыть tooltip программно
       */
      onOpen,

      /**
       * @description закрыть tooltip programmatically
       */
      onClose,
    })

    return () => slots.default({ open })
  },
})
