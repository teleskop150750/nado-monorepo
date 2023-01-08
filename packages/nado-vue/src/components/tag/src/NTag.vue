<script setup>
import { computed } from 'vue'

import { useNamespace, useSize } from '../../../hooks/index.js'
import { NIconClose } from '../../../icons/index.js'
import { stop } from '../../../utils/index.js'
import { tagEmits, tagProps } from './props.js'

const props = defineProps(tagProps)

const emit = defineEmits(tagEmits)

defineOptions({
  name: 'NTag',
})

const ns = useNamespace('tag')
const size = useSize()

const classes = computed(() => {
  const { appearance, closable } = props

  return [ns.b(), ns.is('closable', closable), ns.m(`size-${size.value}`), ns.m(`appearance-${appearance}`)]
})

// methods
/** @param {MouseEvent} evt */
function handleClose(evt) {
  stop(evt)
  emit('close', evt)
}

/** @param {MouseEvent} evt */
function handleClick(evt) {
  emit('click', evt)
}
</script>

<template>
  <span :class="classes" @click="handleClick">
    <span :class="ns.e('content')"><slot /></span>

    <template v-if="closable">
      <span :class="ns.e('close')" @click="handleClose">
        <NIconClose />
      </span>
    </template>
  </span>
</template>
