import { POPPER_CONTAINER_SELECTOR, useDelayedToggleProps, useNamespace } from '../../../hooks/index.js'
import { popperContentProps } from '../../popper/src/popperContentProps.js'

const ns = useNamespace('tooltip')

export const useTooltipContentProps = {
  ...useDelayedToggleProps,
  ...popperContentProps,
  appendTo: {
    type: [String, Object],
    default: POPPER_CONTAINER_SELECTOR,
  },
  content: {
    type: String,
    default: '',
  },
  rawContent: {
    type: Boolean,
    default: false,
  },
  persistent: Boolean,
  ariaLabel: String,
  // поскольку опора переключения модели генерируется динамически
  // таким образом, типизация не может быть оценена typescript как тип:
  // [name]: { type: Boolean, default: null }
  // поэтому нам нужно объявить это снова для проверки типа.
  visible: {
    type: Boolean,
    default: null,
  },
  transition: {
    type: String,
    default: `${ns.namespace}-fade-in-linear`,
  },
  teleported: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
  },
}
