type NodeStyle = {
  contextStyle: string
  boxSizing: string
  paddingSize: number
  borderSize: number
}

type TextAreaHeight = {
  height: string
  minHeight?: string
}

type NodeStyle = {
  contextStyle: string
  boxSizing: string
  paddingSize: number
  borderSize: number
}

type TextAreaHeight = {
  height: string
  minHeight?: string
}

export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows?: number,
  maxRows?: number,
): TextAreaHeight
