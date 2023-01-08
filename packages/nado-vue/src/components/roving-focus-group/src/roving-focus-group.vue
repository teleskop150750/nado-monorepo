<script>
// @ts-nocheck
import { defineComponent } from 'vue'

import { NCollection as NFocusGroupCollection } from './roving-focus-group.js'
import NRovingFocusGroupImpl from './roving-focus-group-impl.vue'

export default defineComponent({
  name: 'NRovingFocusGroup',
  components: {
    NFocusGroupCollection,
    NRovingFocusGroupImpl,
  },
})
</script>

<template>
  <NFocusGroupCollection>
    <NRovingFocusGroupImpl v-bind="$attrs">
      <slot />
    </NRovingFocusGroupImpl>
  </NFocusGroupCollection>
</template>
