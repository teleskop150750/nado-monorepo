import { defineComponent, markRaw } from 'vue'

export const createComponent = (raw) => markRaw(defineComponent(raw))

/** @param {Object} raw */
export const createDirective = (raw) => markRaw(raw)
