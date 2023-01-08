<script>
// @ts-nocheck
import { defineComponent } from 'vue'

import { useNamespace } from '../../../hooks/index.js'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const ns = useNamespace('select')

    return {
      ns,
    }
  },
})
</script>

<template>
  <div v-if="item.isTitle" :class="ns.be('dropdown', 'group-title')" :style="[style, { lineHeight: `${height}px` }]">
    {{ item.label }}
  </div>
  <div v-else :class="ns.be('dropdown', 'group-split')" :style="style">
    <span :class="ns.be('dropdown', 'group-split-dash')" :style="{ top: `${height / 2}px` }" />
  </div>
</template>
