const buttons = new Set([
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'h1',
  'h2',
  'h3',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'undo',
  'redo',
])

export const editorProps = {
  modelValue: {
    type: String,
    required: true,
  },
  initialContent: {
    type: String,
    required: false,
    default: '',
  },
  activeButtons: {
    type: Array,
    validator(list) {
      for (const el of list) {
        // The value must match one of these strings
        if (!buttons.has(el)) {
          return false
        }
      }

      return true
    },
    default: () => [...buttons],
  },
}
