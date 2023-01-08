// import { useNamespace } from '../../../hooks/index.js'
// import { createComponent } from '../../../utils/index.js'

// export default createComponent({
//   props: {
//     item: {
//       type: Object,
//       required: true,
//     },
//     style: {
//       type: Object,
//       default: () => ({}),
//     },
//     height: {
//       type: Number,
//     },
//   },
//   setup(props) {
//     const ns = useNamespace('select')

//     return () =>
//       props.item.isTitle ? (
//         <div class={ns.be('group', 'title')} style={[props.style, { lineHeight: `${props.height}px` }]}>
//           {props.item.label}
//         </div>
//       ) : (
//         <div class={ns.be('group', 'split')} style={props.style}>
//           <span class={ns.be('group', 'split-dash')} style={{ top: `${props.height / 2}px` }} />
//         </div>
//       )
//   },
// })
