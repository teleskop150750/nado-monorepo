<script>
import { computed, defineComponent, getCurrentInstance, provide, ref, toRef, unref } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { useId, useLocale, useNamespace, useSize } from '../../../hooks/index.js'
import { NIconArrowDown } from '../../../icons/index.js'
import { addUnit } from '../../../utils/index.js'
import { NButton } from '../../button/index.js'
import { NOnlyChild } from '../../only-child/index.js'
import { NRovingFocusGroup } from '../../roving-focus-group/index.js'
import { NScrollbar } from '../../scrollbar/index.js'
import { NTooltip } from '../../tooltip/index.js'
import { dropdownProps, NCollection as NDropdownCollection } from './dropdown.js'
import { DROPDOWN_INJECTION_KEY, DROPDOWN_LOCAL_INJECTION_KEY } from './tokens.js'

const { NButtonGroup } = NButton

export default defineComponent({
  name: 'NDropdown',
  components: {
    NButton,
    NButtonGroup,
    NTooltip,
    NScrollbar,
    NDropdownCollection,
    NRovingFocusGroup,
    NOnlyChild,
    NIconArrowDown,
  },
  props: dropdownProps,
  emits: ['visible-change', 'click', 'command'],
  setup(props, { emit }) {
    const _instance = getCurrentInstance()
    const ns = useNamespace('dropdown')
    const { locale } = useLocale()

    const triggeringElementRef = ref()
    const referenceElementRef = ref()
    const popperRef = ref(undefined)
    const contentRef = ref(undefined)
    const scrollbar = ref(undefined)
    const currentTabId = ref(undefined)
    const isUsingKeyboard = ref(false)
    const triggerKeys = [EVENT_CODE.enter, EVENT_CODE.space, EVENT_CODE.down]

    const dropdownSize = useSize()
    const wrapStyle = computed(() => ({
      maxHeight: addUnit(props.maxHeight),
    }))
    const dropdownTriggerKls = computed(() => [ns.m(dropdownSize.value)])

    const defaultTriggerId = useId().value
    const triggerId = computed(() => props.id || defaultTriggerId)

    function handleClick() {
      handleClose()
    }

    function handleClose() {
      popperRef.value?.onClose()
    }

    function handleOpen() {
      popperRef.value?.onOpen()
    }

    function commandHandler(...args) {
      emit('command', ...args)
    }

    function onItemEnter() {
      // NOOP for now
    }

    function onItemLeave() {
      const contentEl = unref(contentRef)

      contentEl?.focus()
      currentTabId.value = null
    }

    function handleCurrentTabIdChange(id) {
      currentTabId.value = id
    }

    /**
     * @param {Event} evt
     */
    function handleEntryFocus(evt) {
      if (!isUsingKeyboard.value) {
        evt.preventDefault()
        evt.stopImmediatePropagation()
      }
    }

    function handleBeforeShowTooltip() {
      emit('visible-change', true)
    }

    /**
     * @param {Event} [evt]
     */
    function handleShowTooltip(evt) {
      if (evt?.type === 'keydown') {
        contentRef.value.focus()
      }
    }

    function handleBeforeHideTooltip() {
      emit('visible-change', false)
    }

    provide(DROPDOWN_INJECTION_KEY, {
      contentRef,
      role: computed(() => props.role),
      triggerId,
      isUsingKeyboard,
      onItemEnter,
      onItemLeave,
    })

    provide(DROPDOWN_LOCAL_INJECTION_KEY, {
      instance: _instance,
      dropdownSize,
      handleClick,
      commandHandler,
      // @ts-ignore
      trigger: toRef(props, 'trigger'),
      // @ts-ignore
      hideOnClick: toRef(props, 'hideOnClick'),
    })

    // TODO: проверить вызов
    /**
     * @param {Event} evt
     */
    function onFocusAfterTrapped(evt) {
      evt.preventDefault()
      contentRef.value?.focus?.({
        preventScroll: true,
      })
    }

    /**
     * @param {MouseEvent} evt
     */
    function handlerMainButtonClick(evt) {
      emit('click', evt)
    }

    return {
      locale,
      ns,
      scrollbar,
      wrapStyle,
      dropdownTriggerKls,
      dropdownSize,
      triggerId,
      triggerKeys,
      currentTabId,
      handleCurrentTabIdChange,
      handlerMainButtonClick,
      handleEntryFocus,
      handleClose,
      handleOpen,
      handleBeforeShowTooltip,
      handleShowTooltip,
      handleBeforeHideTooltip,
      onFocusAfterTrapped,
      popperRef,
      contentRef,
      triggeringElementRef,
      referenceElementRef,
    }
  },
})
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <NTooltip
      ref="popperRef"
      :show-arrow="false"
      :role="role"
      :effect="effect"
      :fallback-placements="['bottom', 'top']"
      :popper-options="popperOptions"
      :gpu-acceleration="false"
      :hide-after="trigger === 'hover' ? hideTimeout : 0"
      :manual-mode="true"
      :placement="placement"
      :popper-class="[ns.e('popper'), popperClass]"
      :reference-element="referenceElementRef?.$el"
      :trigger="trigger"
      :trigger-keys="triggerKeys"
      :trigger-target-el="contentRef"
      :show-after="trigger === 'hover' ? showTimeout : 0"
      :stop-popper-mouse-event="false"
      :virtual-ref="triggeringElementRef"
      :virtual-triggering="splitButton"
      :disabled="disabled"
      :transition="`${ns.namespace.value}-zoom-in-top`"
      :teleported="teleported"
      pure
      persistent
      @before-show="handleBeforeShowTooltip"
      @show="handleShowTooltip"
      @before-hide="handleBeforeHideTooltip"
    >
      <template #content>
        <NScrollbar ref="scrollbar" :wrap-style="wrapStyle" tag="div" :view-class="ns.e('list')">
          <NRovingFocusGroup
            :loop="loop"
            :current-tab-id="currentTabId"
            orientation="horizontal"
            @current-tab-id-change="handleCurrentTabIdChange"
            @entry-focus="handleEntryFocus"
          >
            <NDropdownCollection>
              <slot name="dropdown" />
            </NDropdownCollection>
          </NRovingFocusGroup>
        </NScrollbar>
      </template>
      <template v-if="!splitButton" #default>
        <NOnlyChild :id="triggerId" role="button" :tabindex="tabindex">
          <slot name="default" />
        </NOnlyChild>
      </template>
    </NTooltip>
    <template v-if="splitButton">
      <NButtonGroup>
        <NButton
          ref="referenceElementRef"
          v-bind="buttonProps"
          :size="dropdownSize"
          :type="type"
          :disabled="disabled"
          :tabindex="tabindex"
          @click="handlerMainButtonClick"
        >
          <slot name="default" />
        </NButton>
        <NButton
          :id="triggerId"
          ref="triggeringElementRef"
          v-bind="buttonProps"
          role="button"
          :size="dropdownSize"
          :type="type"
          :class="ns.e('caret-button')"
          :disabled="disabled"
          :tabindex="tabindex"
          :aria-label="locale.el?.dropdown?.toggleDropdown || 'toggleDropdown'"
        >
          <span :class="ns.e('icon')"><NIconArrowDown :class="ns.e('icon-svg')" /></span>
        </NButton>
      </NButtonGroup>
    </template>
  </div>
</template>
