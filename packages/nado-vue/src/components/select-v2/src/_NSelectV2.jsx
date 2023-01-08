/* eslint-disable max-len */
// import { popper } from '@popperjs/core'
// import { provide, reactive, toRefs, withModifiers } from 'vue'

// import { EVENT_CODE } from '../../../constants/aria.js'
// import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../../../constants/event.js'
// import { createComponent, hSlot, stopAndPrevent } from '../../../utils/index.js'
// import { NTag } from '../../tag/index.js'
// import { NTooltip } from '../../tooltip/index.js'
// import { NSelectDropdown } from './NSelectDropdown.jsx'
// import { selectProps } from './selectProps.js'
// import { selectV2InjectionKey } from './token.js'
// import useSelect from './useSelect.js'

// export default createComponent({
//   name: 'NSelectV2',
//   props: selectProps,
//   emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'remove-tag', 'clear', 'visible-change', 'focus', 'blur'],

//   setup(props, { slots, emit }) {
//     const {
//       // data exports
//       collapseTagSize,
//       currentPlaceholder,
//       expanded,
//       emptyText,
//       popupHeight,
//       debounce,
//       filteredOptions,
//       iconComponent,
//       iconReverse,
//       inputWrapperStyle,
//       popperSize,
//       dropdownMenuVisible,
//       hasModelValue,
//       // readonly,
//       shouldShowPlaceholder,
//       selectDisabled,
//       selectSize,
//       showClearBtn,
//       states,
//       tagMaxWidth,
//       nsSelectV2,
//       nsInput,

//       // refs items exports
//       calculatorRef,
//       controlRef,
//       inputRef,
//       menuRef,
//       popper,
//       selectRef,
//       selectionRef,

//       popperRef,

//       validateState,

//       // methods exports
//       debouncedOnInputChange,
//       deleteTag,
//       getLabel,
//       getValueKey,
//       handleBlur,
//       handleClear,
//       handleClickOutside,
//       handleDel,
//       handleEsc,
//       handleFocus,
//       handleMenuEnter,
//       handleResize,
//       toggleMenu,
//       scrollTo,
//       onInput,
//       onKeyboardNavigate,
//       onKeyboardSelect,
//       onSelect,
//       onHover,
//       onUpdateInputValue,
//     } = useSelect(props, emit)

//     // TODO, remove the any cast to align the actual API.
//     provide(selectV2InjectionKey, {
//       props: reactive({
//         ...toRefs(props),
//         height: popupHeight,
//       }),
//       popper,
//       onSelect,
//       onHover,
//       onKeyboardNavigate,
//       onKeyboardSelect,
//     })

//     /** @param {KeyboardEvent} evt */
//     function handlerMultipleInputKeydown(evt) {
//       switch (evt.code) {
//         case EVENT_CODE.up: {
//           stopAndPrevent(evt)
//           onKeyboardNavigate('backward')
//           break
//         }
//         case EVENT_CODE.down: {
//           stopAndPrevent(evt)
//           onKeyboardNavigate('forward')
//           break
//         }
//         case EVENT_CODE.enter: {
//           stopAndPrevent(evt)
//           onKeyboardSelect()
//           break
//         }
//         case EVENT_CODE.esc: {
//           stopAndPrevent(evt)
//           handleEsc()
//           break
//         }
//         case EVENT_CODE.delete: {
//           handleDel(evt)
//           break
//         }
//         default:
//         // No default
//       }
//     }

//     /** @param {KeyboardEvent} evt */
//     function handlerInputKeydown(evt) {
//       switch (evt.code) {
//         case EVENT_CODE.up: {
//           stopAndPrevent(evt)
//           onKeyboardNavigate('backward')
//           break
//         }
//         case EVENT_CODE.down: {
//           stopAndPrevent(evt)
//           onKeyboardNavigate('forward')
//           break
//         }
//         case EVENT_CODE.enter: {
//           stopAndPrevent(evt)
//           onKeyboardSelect()
//           break
//         }
//         case EVENT_CODE.esc: {
//           stopAndPrevent(evt)
//           handleEsc()
//           break
//         }
//         default:
//         // No default
//       }
//     }

//     return () => {
//       const Input = (inputProps) => (
//         <input
//           id={props.id}
//           ref={inputRef}
//           v-model-text={states.displayInputValue}
//           autocomplete={props.autocomplete}
//           aria-autocomplete="list"
//           aria-haspopup="listbox"
//           autocapitalize="off"
//           aria-expanded={expanded.value}
//           aria-labelledby={props.label}
//           class={inputProps.class}
//           disabled={props.disabled}
//           role="combobox"
//           readonly={!props.filterable}
//           spellcheck="false"
//           type="text"
//           name={props.name}
//           unselectable={expanded.value ? 'on' : undefined}
//           onUpdate:modelValue={onUpdateInputValue}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onInput={onInput}
//           onKeydown={inputProps.onKeydown}
//         />
//       )

//       const TagList = (array = []) => {
//         array.map((selected, idx) => (
//           <div key={idx} class={nsSelectV2.e('selected-item')}>
//             <NTag
//               key={getValueKey(selected)}
//               class="in-tooltip"
//               closable={!selectDisabled.value && !selected.disabled}
//               size={collapseTagSize.value}
//               hit={selected.hitState}
//               onClose={(evt) => {
//                 deleteTag(evt, selected)
//               }}
//             >
//               <span
//                 class={nsSelectV2.e('tag-text')}
//                 style={{
//                   maxWidth: `${tagMaxWidth.value}px`,
//                 }}
//               >
//                 {getLabel(selected)}
//               </span>
//             </NTag>
//           </div>
//         ))
//       }

//       const MultipleTooltipContent = () => (
//         <div class={nsSelectV2.e('selection')}>{TagList(states.cachedOptions.slice(1))}</div>
//       )

//       const MultipleTooltip = () => (
//         <NTag closable={false} size={collapseTagSize.value}>
//           {props.collapseTagsTooltip ? (
//             <NTooltip
//               disabled={dropdownMenuVisible.value}
//               fallback-placements={['bottom', 'top', 'right', 'left']}
//               effect={props.effect}
//               placement="bottom"
//               teleported={false}
//             >
//               {{
//                 // @ts-ignore
//                 default: () => <span class={nsSelectV2.e('tag-text')}>+ {props.modelValue.length - 1}</span>,
//                 content: () => MultipleTooltipContent(),
//               }}
//             </NTooltip>
//           ) : (
//             <span class={nsSelectV2.e('tag-text')}>
//               +{' '}
//               {
//                 // @ts-ignore
//                 props.modelValue.length - 1
//               }
//             </span>
//           )}
//         </NTag>
//       )

//       const SelectTrigger = () => (
//         <div
//           ref={selectionRef}
//           class={[
//             nsSelectV2.e('wrapper'),
//             nsSelectV2.is('focused', states.isComposing),
//             nsSelectV2.is('hovering', states.comboBoxHovering),
//             nsSelectV2.is('filterable', props.filterable),
//             nsSelectV2.is('disabled', selectDisabled.value),
//           ]}
//         >
//           {/* slots.prefix */}
//           {slots.prefix && <div>{slots.prefix}</div>}

//           {/* multiple */}
//           {props.multiple ? (
//             <div class={nsSelectV2.e('selection')}>
//               {/* collapseTags */}
//               {/* @ts-ignore */}
//               {props.collapseTags && props.modelValue.length > 0 ? (
//                 <div class={nsSelectV2.e('selected-item')}>
//                   <NTag
//                     closable={!selectDisabled.value && !states.cachedOptions[0]?.disable}
//                     size={collapseTagSize.value}
//                     onClose={(evt) => {
//                       deleteTag(evt, states.cachedOptions[0])
//                     }}
//                   >
//                     <span
//                       class={nsSelectV2.e('tag-text')}
//                       style={{
//                         maxWidth: `${tagMaxWidth}px`,
//                       }}
//                     >
//                       {states.cachedOptions[0]?.label}
//                     </span>
//                   </NTag>
//                   {/* @ts-ignore */}
//                   {props.modelValue.length > 1 && MultipleTooltip()}
//                 </div>
//               ) : (
//                 TagList(states.cachedOptions)
//               )}

//               {/* selected-item */}
//               <div
//                 class={[nsSelectV2.e('selected-item'), nsSelectV2.e('input-wrapper')]}
//                 style={inputWrapperStyle.value}
//               >
//                 {Input({
//                   class: [nsSelectV2.is(selectSize.value), nsSelectV2.e('combobox-input')],
//                   onKeydown: handlerMultipleInputKeydown,
//                 })}

//                 {/* filterable */}
//                 {props.filterable && (
//                   <span
//                     ref={calculatorRef}
//                     aria-hidden="true"
//                     class={nsSelectV2.e('input-calculator')}
//                     v-text={states.displayInputValue}
//                   />
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div class={[nsSelectV2.e('selected-item'), nsSelectV2.e('input-wrapper')]}>
//               {Input({
//                 class: [nsSelectV2.e('combobox-input')],
//                 onKeydown: handlerInputKeydown,
//               })}
//               {props.filterable && (
//                 <span
//                   ref={calculatorRef}
//                   aria-hidden={true}
//                   class={[nsSelectV2.e('selected-item'), nsSelectV2.e('input-calculator')]}
//                   v-text={states.displayInputValue}
//                 />
//               )}
//             </div>
//           )}

//           {/* shouldShowPlaceholder */}
//           {shouldShowPlaceholder.value && (
//             <span
//               class={[
//                 nsSelectV2.e('placeholder'),
//                 nsSelectV2.is(
//                   'transparent',
//                   // @ts-ignore
//                   states.isComposing || (props.multiple ? props.modelValue.length === 0 : !hasModelValue),
//                 ),
//               ]}
//             >
//               {currentPlaceholder.value}
//             </span>
//           )}

//           {/* suffix */}
//           <span class={nsSelectV2.e('suffix')}>
//             {iconComponent.value && (
//               <span v-show={!showClearBtn.value} class={[nsSelectV2.e('caret'), nsInput.e('icon'), iconReverse.value]}>
//                 <iconComponent.value />
//               </span>
//             )}

//             {showClearBtn.value && props.clearIcon && (
//               <span class={[nsSelectV2.e('caret'), nsInput.e('icon')]}>
//                 {/** @ts-ignore */}
//                 <props.clearIcon />
//               </span>
//             )}
//           </span>
//         </div>
//       )

//       return (
//         <div
//           ref={selectRef}
//           // v-click-outside:[popperRef]="handleClickOutside"
//           class={[nsSelectV2.b(), nsSelectV2.m(selectSize)]}
//           onClick={withModifiers(toggleMenu, ['stop'])}
//           onMouseenter={() => {
//             states.comboBoxHovering = true
//           }}
//           onMouseleave={() => {
//             states.comboBoxHovering = false
//           }}
//         >
//           <NTooltip
//             ref={popper}
//             visible={dropdownMenuVisible.value}
//             teleported={props.teleported}
//             popper-class={[nsSelectV2.e('popper'), props.popperClass]}
//             gpu-acceleration={false}
//             stop-popper-mouse-event={false}
//             popper-options={props.popperOptions}
//             fallback-placements={['bottom-start', 'top-start', 'right', 'left']}
//             effect={props.effect}
//             placement={props.placement}
//             pure={true}
//             transition={`${nsSelectV2.namespace}-zoom-in-top`}
//             trigger="click"
//             persistent={props.persistent}
//             onBeforeShow={handleMenuEnter}
//             onHide={() => {
//               states.inputValue = states.displayInputValue
//             }}
//           >
//             {{
//               default: () => SelectTrigger(),
//               content: () => (
//                 <NSelectDropdown
//                   ref={menuRef}
//                   data={filteredOptions}
//                   width={popperSize}
//                   hovering-index={states.hoveringIndex}
//                   scrollbar-always-on={props.scrollbarAlwaysOn}
//                 >
//                   {{
//                     default: (scope) => {
//                       slots.default(scope)
//                     },
//                     empty: () => hSlot(slots.empty, <p class={nsSelectV2.e('empty')}>{emptyText.value ?? ''}</p>),
//                   }}
//                 </NSelectDropdown>
//               ),
//             }}
//           </NTooltip>
//         </div>
//       )
//     }
//   },
// })
