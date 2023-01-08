import { createCollectionWithScope } from '../../collection/index.js'

export const rovingFocusGroupProps = {
  style: { type: [String, Array, Object] },
  currentTabId: {
    type: String,
  },
  defaultCurrentTabId: String,
  loop: Boolean,
  dir: {
    type: String, // left for direction support
    values: ['ltr', 'rtl'],
    default: 'ltr',
  },
  orientation: {
    // left for orientation support
    type: String,
  },

  onBlur: Function,
  onFocus: Function,
  onMousedown: Function,
}

const { COLLECTION_INJECTION_KEY, COLLECTION_ITEM_INJECTION_KEY, NCollection, NCollectionItem } =
  createCollectionWithScope('RovingFocusGroup')

export {
  NCollection,
  NCollectionItem,
  COLLECTION_INJECTION_KEY as ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY as ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
}
