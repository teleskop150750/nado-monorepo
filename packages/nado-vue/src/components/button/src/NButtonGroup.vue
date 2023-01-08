<script setup>
import { provide, reactive, toRef } from 'vue'

import { useNamespace } from '../../../hooks/index.js'
import { buttonGroupContextKey } from '../../../tokens/index.js'
import { buttonGroupProps } from './group-props.js'

const props = defineProps(buttonGroupProps)

defineOptions({
  name: 'NButtonGroup',
})

provide(
  buttonGroupContextKey,
  reactive({
    size: toRef(props, 'size'),
    appearance: toRef(props, 'appearance'),
  }),
)
const ns = useNamespace('button-group')
</script>

<template>
  <div :class="`${ns.b()}`">
    <slot />
  </div>
</template>
