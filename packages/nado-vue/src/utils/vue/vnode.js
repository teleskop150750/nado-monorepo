import { camelize, isArray } from '@vue/shared'
import { Comment, createBlock, createCommentVNode, Fragment, isVNode, openBlock, Text } from 'vue'

import { debugWarn } from '../error.js'
import { hasOwn } from '../objects.js'

const SCOPE = 'utils/vue/vnode'

export function isFragment(node) {
  return isVNode(node) && node.type === Fragment
}

export function isText(node) {
  return isVNode(node) && node.type === Text
}

export function isComment(node) {
  return isVNode(node) && node.type === Comment
}

const TEMPLATE = 'template'

export function isTemplate(node) {
  return isVNode(node) && node.type === TEMPLATE
}

export function isValidElementNode(node) {
  return isVNode(node) && !isFragment(node) && !isComment(node)
}
export const getFirstValidNode = (nodes, maxDepth = 3) => {
  if (Array.isArray(nodes)) {
    return getChildren(nodes[0], maxDepth)
  }

  return getChildren(nodes, maxDepth)
}

/**
 * get a valid child node (not fragment nor comment)
 * @param node {import('vue').VNode} node to be searched
 * @param depth {number} depth to be searched
 */
function getChildren(node, depth) {
  if (isComment(node)) {
    return
  }

  if (isFragment(node) || isTemplate(node)) {
    return depth > 0 ? getFirstValidNode(node.children, depth - 1) : undefined
  }

  return node
}

export function renderIf(condition, ...args) {
  return condition ? renderBlock(...args) : createCommentVNode('v-if', true)
}

export function renderBlock(...args) {
  // @ts-ignore
  // eslint-disable-next-line no-sequences
  return openBlock(), createBlock(...args)
}

export const getNormalizedProps = (node) => {
  if (!isVNode(node)) {
    debugWarn(SCOPE, '[getNormalizedProps] must be a VNode')

    return {}
  }

  const raw = node.props || {}
  const type = (isVNode(node.type) ? node.type.props : undefined) || {}
  const props = {}

  Object.keys(type).forEach((key) => {
    if (hasOwn(type[key], 'default')) {
      props[key] = type[key].default
    }
  })

  Object.keys(raw).forEach((key) => {
    props[camelize(key)] = raw[key]
  })

  return props
}

export const ensureOnlyChild = (children) => {
  if (!isArray(children) || children.length > 1) {
    throw new Error('expect to receive a single Vue element child')
  }

  return children[0]
}

export const flattedChildren = (children) => {
  const vNodes = isArray(children) ? children : [children]
  const result = []

  vNodes.forEach((child) => {
    if (isArray(child)) {
      result.push(...flattedChildren(child))
    } else if (isVNode(child) && isArray(child.children)) {
      result.push(...flattedChildren(child.children))
    } else {
      result.push(child)
    }
  })

  return result
}
