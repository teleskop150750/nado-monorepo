import { useResizeObserver } from '@vueuse/core'
import { computed, nextTick, onMounted, provide, reactive, toRefs, Transition, unref, withModifiers } from 'vue'

import { EVENT_CODE } from '../../../constants/aria.js'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../constants/event.js'
import { ClickOutside as vClickOutside } from '../../../directives/index.js'
import { useFocus, useNamespace, useRender } from '../../../hooks/index.js'
import { selectKey } from '../../../tokens/index.js'
import { createComponent, hSlot, prevent, stopAndPrevent } from '../../../utils/index.js'
import { NInput } from '../../input/index.js'
import { NScrollbar } from '../../scrollbar/index.js'
import { NTag } from '../../tag/index.js'
import { NTooltip } from '../../tooltip/index.js'
import { NOption } from './NOption.jsx'
import { NSelectDropdown } from './NSelectDropdown.jsx'
import { selectProps } from './selectProps.js'
import { useSelect, useSelectStates } from './useSelect.js'

const COMPONENT_NAME = 'NSelect'

export const NSelect = createComponent({
  name: COMPONENT_NAME,
  directives: { ClickOutside: vClickOutside },
  props: selectProps,
  emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'remove-tag', 'clear', 'visible-change', 'focus', 'blur'],

  setup(props, ctx) {
    const nsSelect = useNamespace('select')
    const nsInput = useNamespace('input')
    const states = useSelectStates(props)
    const { slots, emit } = ctx
    const {
      optionsArray,
      selectSize,
      readonly,
      handleResize,
      collapseTagSize,
      debouncedOnInputChange,
      debouncedQueryChange,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      setSelected,
      resetInputHeight,
      managePlaceholder,
      showClose,
      selectDisabled,

      iconComponent,
      iconReverse,

      showNewOption,
      emptyText,
      toggleLastOptionHitState,
      resetInputState,
      handleComposition,
      onOptionCreate,
      onOptionDestroy,
      handleMenuEnter,
      handleFocus,
      blur,

      handleBlur,
      handleClearClick,
      handleClose,
      handleKeydownEscape,

      toggleMenu,
      selectOption,
      getValueKey,
      navigateOptions,
      dropMenuVisible,

      referenceRef,
      inputRef,
      tooltipRef,
      tagsRef,
      selectWrapperRef,
      scrollbarRef,

      queryChange,
      groupQueryChange,
      handleMouseEnter,
      handleMouseLeave,
    } = useSelect(props, states, ctx)

    const { focus } = useFocus(referenceRef)

    const {
      inputWidth,
      selected,
      inputLength,
      filteredOptionsCount,
      visible,
      softFocus,
      selectedLabel,
      hoverIndex,
      query,
      inputHovering,
      currentPlaceholder,
      menuVisibleOnFocus,
      // isOnComposition,
      isSilentBlur,
      options,
      cachedOptions,
      optionsCount,
      prefixWidth,
      tagInMultiLine,
    } = toRefs(states)

    const wrapperClasses = computed(() => {
      const classList = [
        nsSelect.b(),
        nsSelect.is('focus', visible.value),
        nsSelect.is('disabled', selectDisabled.value),
      ]
      const _selectSize = unref(selectSize)

      if (_selectSize) {
        classList.push(nsSelect.m(`size-${_selectSize}`))
      }

      return classList
    })

    const selectTagsStyle = computed(() => ({
      maxWidth: `${unref(inputWidth) - 32}px`,
      width: '100%',
    }))

    const tagTextStyle = computed(() => {
      const maxWidth = unref(inputWidth) > 123 ? unref(inputWidth) - 123 : unref(inputWidth) - 75

      return { maxWidth: `${maxWidth}px` }
    })

    provide(
      selectKey,
      // @ts-ignore
      reactive({
        props,
        options,
        optionsArray,
        cachedOptions,
        optionsCount,
        filteredOptionsCount,
        hoverIndex,
        handleOptionSelect,
        onOptionCreate,
        onOptionDestroy,
        selectWrapperRef,
        selected,
        setSelected,
        queryChange,
        groupQueryChange,
      }),
    )

    onMounted(() => {
      currentPlaceholder.value = props.placeholder
      states.cachedPlaceHolder = props.placeholder

      if (props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0) {
        currentPlaceholder.value = ''
      }

      useResizeObserver(selectWrapperRef, handleResize)

      if (props.remote && props.multiple) {
        resetInputHeight()
      }

      nextTick(() => {
        const refEl = referenceRef.value && referenceRef.value.$el

        if (!refEl) {
          return
        }

        inputWidth.value = refEl.getBoundingClientRect().width

        if (slots.prefix) {
          const prefix = refEl.querySelector(`.${nsInput.e('prefix')}`)

          prefixWidth.value = Math.max(prefix.getBoundingClientRect().width + 5, 30)
        }
      })
      setSelected()
    })

    if (props.multiple && !Array.isArray(props.modelValue)) {
      emit(UPDATE_MODEL_EVENT, [])
    }

    if (!props.multiple && Array.isArray(props.modelValue)) {
      emit(UPDATE_MODEL_EVENT, '')
    }

    const popperPaneRef = computed(() => tooltipRef.value?.popperRef?.contentRef)

    /** @param {KeyboardEvent} evt  */
    function handleFilterKeydown(evt) {
      resetInputState(evt)
      switch (evt.code) {
        case EVENT_CODE.down: {
          prevent(evt)
          navigateOptions('next')
          break
        }
        case EVENT_CODE.up: {
          prevent(evt)
          navigateOptions('prev')
          break
        }
        case EVENT_CODE.esc: {
          handleKeydownEscape(evt)
          break
        }
        case EVENT_CODE.enter: {
          stopAndPrevent(evt)
          selectOption()
          break
        }
        case EVENT_CODE.delete: {
          deletePrevTag()
          break
        }
        case EVENT_CODE.tab: {
          visible.value = false
          break
        }
        default:
        // No default
      }
    }

    /** @param {KeyboardEvent} evt */
    function handlerInputKeydown(evt) {
      switch (evt.code) {
        case EVENT_CODE.down: {
          prevent(evt)
          navigateOptions('next')
          break
        }
        case EVENT_CODE.up: {
          prevent(evt)
          navigateOptions('prev')
          break
        }
        case EVENT_CODE.esc: {
          handleKeydownEscape(evt)
          break
        }
        case EVENT_CODE.enter: {
          stopAndPrevent(evt)
          selectOption()
          break
        }
        case EVENT_CODE.tab: {
          visible.value = false
          break
        }
        default:
        // No default
      }
    }

    useRender(() => {
      const SelectContent = () => (
        <NSelectDropdown>
          <NScrollbar
            v-show={options.value.size > 0 && !props.loading}
            ref={scrollbarRef}
            tag={'ul'}
            wrap-class={nsSelect.be('dropdown', 'wrap')}
            view-class={nsSelect.be('dropdown', 'list')}
            class={[
              nsSelect.eIs(
                'scrollbar',
                'empty',
                !props.allowCreate && Boolean(query.value) && filteredOptionsCount.value === 0,
              ),
            ]}
          >
            {showNewOption.value && <NOption value={query.value} created={true} />}

            {hSlot(slots.default)}
          </NScrollbar>

          {emptyText.value &&
            (!props.allowCreate || props.loading || (props.allowCreate && options.value.size === 0)) &&
            hSlot(slots.empty, <p class={nsSelect.be('dropdown', 'empty')}>{emptyText.value}</p>)}
        </NSelectDropdown>
      )

      const MultipleTooltipContent = () => (
        <div class={nsSelect.e('collapse-tags')}>
          {selected.value.slice(1).map((item, idx) => (
            <div key={idx} class={nsSelect.e('collapse-tag')}>
              <NTag
                key={getValueKey(item)}
                class="in-tooltip"
                closable={!selectDisabled.value && !item.isDisabled}
                size={collapseTagSize.value}
                hit={item.hitState}
                type={props.tagType}
                style={{ margin: '2px' }}
                onClose={(evt) => {
                  deleteTag(evt, item)
                }}
              >
                <span
                  class={nsSelect.e('tag-text')}
                  style={{
                    maxWidth: `${inputWidth.value - 75}px`,
                  }}
                >
                  {item.currentLabel}
                </span>
              </NTag>
            </div>
          ))}
        </div>
      )

      const MultipleTooltip = () => (
        <NTag closable={false} size={collapseTagSize.value} type={props.tagType}>
          {props.collapseTagsTooltip ? (
            <NTooltip
              disabled={dropMenuVisible.value}
              fallback-placements={['bottom', 'top', 'right', 'left']}
              effect={props.effect}
              placement="bottom"
              teleported={props.teleported}
            >
              {{
                default: () => <span class={nsSelect.e('tag-text')}>+ {selected.value.length - 1}</span>,
                content: () => MultipleTooltipContent(),
              }}
            </NTooltip>
          ) : (
            <span class={nsSelect.e('tag-text')}>+ {selected.value.length - 1}</span>
          )}
        </NTag>
      )

      const TriggerMultipleContent = () => (
        <div ref={tagsRef} class={nsSelect.e('tags')} style={selectTagsStyle.value}>
          {props.collapseTags && selected.value.length > 0 && (
            <span
              class={[
                nsSelect.b('tags-wrapper'),
                nsSelect.bHas('tags-wrapper', 'prefix', prefixWidth.value && selected.value.length > 0),
              ]}
            >
              <NTag
                closable={!selectDisabled.value && !selected.value[0].isDisabled}
                size={collapseTagSize.value}
                hit={selected.value[0].hitState}
                type={props.tagType}
                onClose={(evt) => deleteTag(evt, selected.value[0])}
              >
                <span class={nsSelect.e('tag-text')} style={tagTextStyle.value}>
                  {selected.value[0].currentLabel}
                </span>
              </NTag>

              {selected.value.length > 1 && MultipleTooltip()}
            </span>
          )}
          {!props.collapseTags && (
            <Transition onAfterLeave={resetInputHeight}>
              <span
                class={[
                  nsSelect.b('tags-wrapper'),
                  nsSelect.bHas('tags-wrapper', 'prefix', prefixWidth.value && selected.value.length > 0),
                ]}
              >
                {selected.value.map((item) => (
                  <NTag
                    key={getValueKey(item)}
                    closable={!selectDisabled.value && !item.isDisabled}
                    size={collapseTagSize.value}
                    hit={item.hitState}
                    type={props.tagType}
                    onClose={(evt) => {
                      deleteTag(evt, item)
                    }}
                  >
                    <span class={nsSelect.e('tag-text')} style={{ maxWidth: `${inputWidth.value - 75}px` }}>
                      {item.currentLabel}
                    </span>
                  </NTag>
                ))}
              </span>
            </Transition>
          )}

          {props.filterable && (
            <input
              ref={inputRef}
              v-model={query.value}
              type="text"
              class={[nsSelect.e('search-input'), nsSelect.em('search-input', `size-${selectSize.value}`)]}
              disabled={selectDisabled.value}
              autocomplete={props.autocomplete}
              style={{
                marginLeft:
                  (prefixWidth.value && selected.value.length === 0) || tagInMultiLine.value
                    ? `${prefixWidth.value}px`
                    : '',
                flexGrow: 1,
                width: `${inputLength.value / (inputWidth.value - 32)}%`,
                maxWidth: `${inputWidth.value - 42}px`,
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyup={managePlaceholder}
              onKeydown={handleFilterKeydown}
              onInput={debouncedQueryChange}
            />
          )}
        </div>
      )

      const SelectTrigger = () => (
        <div
          class={nsSelect.e('trigger')}
          onMouseenter={() => {
            inputHovering.value = true
          }}
          onMouseleave={() => {
            inputHovering.value = false
          }}
        >
          {props.multiple && TriggerMultipleContent()}

          <NInput
            id={props.id}
            ref={referenceRef}
            v-model={selectedLabel.value}
            class={nsSelect.e('input-filter')}
            type="text"
            placeholder={currentPlaceholder.value}
            name={props.name}
            autocomplete={props.autocomplete}
            disabled={selectDisabled.value}
            readonly={readonly.value}
            validate-event={false}
            tabindex={props.multiple && props.filterable ? -1 : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={debouncedOnInputChange}
            onPaste={debouncedOnInputChange}
            onKeydown={handlerInputKeydown}
          >
            {{
              prefix: () => {
                slots.prefix && (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {hSlot(slots.prefix)}
                  </div>
                )
              },
              suffix: () => (
                <>
                  {iconComponent.value && !showClose.value && (
                    <span
                      class={[
                        nsSelect.e('icon'),
                        nsSelect.e('caret'),
                        nsSelect.eIs('caret', 'reverse', iconReverse.value),
                      ]}
                    >
                      <iconComponent.value />
                    </span>
                  )}
                  {showClose.value && props.clearIcon && (
                    <span class={[nsSelect.e('icon'), nsSelect.e('clear')]} onClick={handleClearClick}>
                      {
                        // @ts-ignore */
                        <props.clearIcon />
                      }
                    </span>
                  )}
                </>
              ),
            }}
          </NInput>
        </div>
      )

      return (
        <div
          ref={selectWrapperRef}
          v-click-outside={[handleClose, popperPaneRef.value]}
          class={wrapperClasses.value}
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
          onClick={withModifiers(toggleMenu, ['stop'])}
        >
          <NTooltip
            ref={tooltipRef}
            visible={dropMenuVisible.value}
            placement={props.placement}
            teleported={props.teleported}
            popper-class={[nsSelect.e('popper'), props.popperClass]}
            fallback-placements={['bottom-start', 'top-start', 'right', 'left']}
            effect={props.effect}
            showArrow={false}
            pure={true}
            offset={12}
            trigger={'click'}
            transition={`${nsSelect.namespace}-zoom-in-top`}
            stop-popper-mouse-event={false}
            gpu-acceleration={false}
            persistent={props.persistent}
            onShow={handleMenuEnter}
          >
            {{
              default: () => SelectTrigger(),
              content: () => SelectContent(),
            }}
          </NTooltip>
        </div>
      )
    })

    return {
      tagInMultiLine,
      prefixWidth,
      selectSize,
      readonly,
      handleResize,
      collapseTagSize,
      debouncedOnInputChange,
      debouncedQueryChange,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      inputWidth,
      selected,
      inputLength,
      filteredOptionsCount,
      visible,
      softFocus,
      selectedLabel,
      hoverIndex,
      query,
      inputHovering,
      currentPlaceholder,
      menuVisibleOnFocus,
      // isOnComposition,
      isSilentBlur,
      options,
      resetInputHeight,
      managePlaceholder,
      showClose,
      selectDisabled,
      iconComponent,
      iconReverse,
      showNewOption,
      emptyText,
      toggleLastOptionHitState,
      resetInputState,
      handleComposition,
      handleMenuEnter,
      handleFocus,
      blur,
      handleBlur,
      handleClearClick,
      handleClose,
      handleKeydownEscape,
      toggleMenu,
      selectOption,
      getValueKey,
      navigateOptions,
      dropMenuVisible,
      focus,

      referenceRef,
      inputRef,
      tooltipRef,
      popperPaneRef,
      tagsRef,
      selectWrapperRef,
      scrollbarRef,

      wrapperKls: wrapperClasses,
      selectTagsStyle,
      nsSelect,
      tagTextStyle,
      handleMouseEnter,
      handleMouseLeave,

      handlerInputKeydown,
      handleFilterKeydown,

      ClickOutside: vClickOutside,
    }
  },
})
