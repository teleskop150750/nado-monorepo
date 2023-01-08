// import { computed, withModifiers } from 'vue'

// import { useNamespace } from '../../../hooks/index.js'
// import { createComponent } from '../../../utils/index.js'
// import { optionProps } from './optionProps.js'
// import { useOption } from './useOption.js'

// export default createComponent({
//   props: optionProps,
//   emits: ['select', 'hover'],
//   setup(props, { emit }) {
//     const ns = useNamespace('select-v2')
//     const { hoverItem, selectOptionClick } = useOption(props, { emit })
//     const optionClasses = computed(() => [
//       ns.be('dropdown', 'item'),
//       ns.beIs('dropdown', 'item', 'selected', props.selected),
//       ns.beIs('dropdown', 'item', 'disabled', props.disabled),
//       ns.beIs('dropdown', 'item', 'created', props.created),
//       ns.beIs('dropdown', 'item', 'hover', props.hovering),
//     ])

//     return {
//       ns,
//       hoverItem,
//       selectOptionClick,
//       optionClasses,
//     }
//   },
//   render() {
//     return (
//       <li
//         aria-selected={this.selected}
//         style={this.style}
//         class={this.optionClasses}
//         onMouseenter={this.hoverItem}
//         onClick={withModifiers(() => {
//           console.log('onCLick')
//           this.selectOptionClick()
//         }, ['stop'])}
//       >
//         {this.$slots.default ? (
//           this.$slots.default({ index: this.index, disabled: this.disabled })
//         ) : (
//           <span>{this.item.label}</span>
//         )}
//       </li>
//     )
//   },
// })
