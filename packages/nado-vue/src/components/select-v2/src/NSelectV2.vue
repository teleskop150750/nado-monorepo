<script>
import { isBoolean } from '@vueuse/core'
import { computed, defineComponent, provide, reactive, toRefs } from 'vue'

import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../constants/index.js'
import { ClickOutside } from '../../../directives/index.js'
import { useFormItem, useFormItemInputId } from '../../../hooks/index.js'
import { NTag } from '../../tag/index.js'
import { NTooltip } from '../../tooltip/index.js'
import { NSelectDropdown } from './NSelectDropdown.jsx'
import { selectProps } from './selectProps.js'
import { selectV2InjectionKey } from './token.js'
import useSelect from './useSelect.js'

export default defineComponent({
  name: 'NSelectV2',
  components: { NTooltip, NSelectDropdown, NTag },
  directives: { ClickOutside },
  props: selectProps,
  emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'remove-tag', 'clear', 'visible-change', 'focus', 'blur'],
  setup(props, { emit }) {
    const API = useSelect(props, emit)

    const { formItem } = useFormItem()
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem,
    })

    const isSuccess = computed(() => (isBoolean(props.success) ? props.success : Boolean(formItem?.isSuccess)))
    const isError = computed(() => (isBoolean(props.error) ? props.error : Boolean(formItem?.isError)))

    // TODO, remove the any cast to align the actual API.
    provide(selectV2InjectionKey, {
      props: reactive({
        ...toRefs(props),
        height: API.popupHeight,
      }),
      popper: API.popper,
      onSelect: API.onSelect,
      onHover: API.onHover,
      onKeyboardNavigate: API.onKeyboardNavigate,
      onKeyboardSelect: API.onKeyboardSelect,
    })

    return { ...API, isSuccess, isError, inputId }
  },
})
</script>

<template>
  <div
    ref="selectRef"
    v-click-outside:[popperRef]="handleClickOutside"
    :class="[
      nsSelectV2.b(),
      nsSelectV2.m(`size-${selectSize}`),
      nsSelectV2.is('success', isSuccess),
      nsSelectV2.is('error', isError),
      nsSelectV2.is('focused', states.isComposing),
      nsSelectV2.is('hovering', states.comboBoxHovering),
      nsSelectV2.is('filterable', filterable),
      nsSelectV2.is('disabled', selectDisabled),
    ]"
    @click.stop="toggleMenu"
    @mouseenter="states.comboBoxHovering = true"
    @mouseleave="states.comboBoxHovering = false"
  >
    <NTooltip
      ref="popper"
      :visible="dropdownMenuVisible"
      :teleported="teleported"
      :popper-class="[nsSelectV2.e('popper'), popperClass]"
      :gpu-acceleration="false"
      :stop-popper-mouse-event="false"
      :popper-options="popperOptions"
      :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
      :effect="effect"
      :placement="placement"
      :show-arrow="false"
      pure
      :transition="`${nsSelectV2.namespace.value}-zoom-in-top`"
      trigger="click"
      :persistent="persistent"
      @before-show="handleMenuEnter"
      @hide="states.inputValue = states.displayInputValue"
    >
      <template #default>
        <div ref="selectionRef" :class="[nsSelectV2.e('wrapper')]">
          <div v-if="$slots.prefix">
            <slot name="prefix" />
          </div>

          <div v-if="multiple" :class="nsSelectV2.e('selection')">
            <template v-if="collapseTags && modelValue.length > 0">
              <div :class="nsSelectV2.e('selected-item')">
                <NTag
                  :closable="!selectDisabled && !states.cachedOptions[0]?.disable"
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                  @close="deleteTag($event, states.cachedOptions[0])"
                >
                  <span
                    :class="nsSelectV2.e('tag-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                    >{{ states.cachedOptions[0]?.label }}</span
                  >
                </NTag>
                <NTag
                  v-if="modelValue.length > 1"
                  :closable="false"
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                >
                  <NTooltip
                    v-if="collapseTagsTooltip"
                    :disabled="dropdownMenuVisible"
                    :fallback-placements="['bottom', 'top', 'right', 'left']"
                    :effect="effect"
                    placement="bottom"
                    :teleported="false"
                  >
                    <template #default>
                      <span
                        :class="nsSelectV2.e('tag-text')"
                        :style="{
                          maxWidth: `${tagMaxWidth}px`,
                        }"
                      >
                        + {{ modelValue.length - 1 }}
                      </span>
                    </template>
                    <template #content>
                      <div :class="nsSelectV2.e('collapse-tags')">
                        <div
                          v-for="(selected, idx) in states.cachedOptions.slice(1)"
                          :key="idx"
                          :class="nsSelectV2.e('collapse-tag')"
                        >
                          <NTag
                            :key="getValueKey(selected)"
                            :closable="!selectDisabled && !selected.disabled"
                            :size="collapseTagSize"
                            class="in-tooltip"
                            type="info"
                            disable-transitions
                            @close="deleteTag($event, selected)"
                          >
                            <span
                              :class="nsSelectV2.e('tag-text')"
                              :style="{
                                maxWidth: `${tagMaxWidth}px`,
                              }"
                            >
                              {{ getLabel(selected) }}
                            </span>
                          </NTag>
                        </div>
                      </div>
                    </template>
                  </NTooltip>
                  <span
                    v-else
                    :class="nsSelectV2.e('tag-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                    >+ {{ modelValue.length - 1 }}</span
                  >
                </NTag>
              </div>
            </template>

            <template v-else>
              <div v-for="(selected, idx) in states.cachedOptions" :key="idx" :class="nsSelectV2.e('selected-item')">
                <NTag
                  :key="getValueKey(selected)"
                  :closable="!selectDisabled && !selected.disabled"
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                  @close="deleteTag($event, selected)"
                >
                  <span
                    :class="nsSelectV2.e('tag-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                    >{{ getLabel(selected) }}</span
                  >
                </NTag>
              </div>
            </template>

            <div :class="[nsSelectV2.e('selected-item'), nsSelectV2.e('input-wrapper')]" :style="inputWrapperStyle">
              <input
                :id="inputId"
                ref="inputRef"
                v-model="states.displayInputValue"
                :autocomplete="autocomplete"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                autocapitalize="off"
                :aria-expanded="expanded"
                :aria-labelledby="label"
                :class="[nsSelectV2.is(selectSize), nsSelectV2.e('combobox-input')]"
                :disabled="disabled"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                type="text"
                :name="name"
                :unselectable="expanded ? 'on' : undefined"
                @update:modelValue="onUpdateInputValue"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="onInput"
                @keydown.up.stop.prevent="onKeyboardNavigate('backward')"
                @keydown.down.stop.prevent="onKeyboardNavigate('forward')"
                @keydown.enter.stop.prevent="onKeyboardSelect"
                @keydown.esc.stop.prevent="handleEsc"
                @keydown.delete.stop="handleDel"
              />
              <span
                v-if="filterable"
                ref="calculatorRef"
                aria-hidden="true"
                :class="nsSelectV2.e('input-calculator')"
                v-text="states.displayInputValue"
              />
            </div>
          </div>

          <template v-else>
            <div :class="[nsSelectV2.e('selected-item'), nsSelectV2.e('input-wrapper')]">
              <input
                :id="inputId"
                ref="inputRef"
                v-model="states.displayInputValue"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                :aria-labelledby="label"
                :aria-expanded="expanded"
                autocapitalize="off"
                :autocomplete="autocomplete"
                :class="nsSelectV2.e('combobox-input')"
                :disabled="disabled"
                :name="name"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                type="text"
                :unselectable="expanded ? 'on' : undefined"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="onInput"
                @keydown.up.stop.prevent="onKeyboardNavigate('backward')"
                @keydown.down.stop.prevent="onKeyboardNavigate('forward')"
                @keydown.enter.stop.prevent="onKeyboardSelect"
                @keydown.esc.stop.prevent="handleEsc"
                @update:modelValue="onUpdateInputValue"
              />
            </div>
            <span
              v-if="filterable"
              ref="calculatorRef"
              aria-hidden="true"
              :class="[nsSelectV2.e('selected-item'), nsSelectV2.e('input-calculator')]"
              v-text="states.displayInputValue"
            />
          </template>

          <span
            v-if="shouldShowPlaceholder"
            :class="[
              nsSelectV2.e('placeholder'),
              nsSelectV2.eIs('placeholder', 'transparent', multiple ? modelValue.length === 0 : !hasModelValue),
            ]"
          >
            {{ currentPlaceholder }}
          </span>

          <span :class="nsSelectV2.e('suffix')">
            <span
              v-if="iconComponent"
              v-show="!showClearBtn"
              :class="[nsInput.e('icon'), nsSelectV2.e('caret'), nsSelectV2.eIs('caret', 'reverse', isReverse)]"
            >
              <component :is="iconComponent" />
            </span>
            <span
              v-if="showClearBtn && clearIcon"
              :class="[nsSelectV2.e('caret'), nsInput.e('icon')]"
              @click.prevent.stop="handleClear"
            >
              <component :is="clearIcon" />
            </span>
          </span>
        </div>
      </template>
      <template #content>
        <NSelectDropdown
          ref="menuRef"
          :data="filteredOptions"
          :width="popperSize"
          :hovering-index="states.hoveringIndex"
          :scrollbar-always-on="scrollbarAlwaysOn"
        >
          <template v-if="$slots.default" #default="scope">
            <slot v-bind="scope" />
          </template>
          <template #empty>
            <slot name="empty">
              <p :class="nsSelectV2.e('empty')">
                {{ emptyText ? emptyText : '' }}
              </p>
            </slot>
          </template>
        </NSelectDropdown>
      </template>
    </NTooltip>
  </div>
</template>
