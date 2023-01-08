<script setup>
import ButtonV1 from './examples/button/ButtonV1.vue'
import ButtonV2 from './examples/button/ButtonV2.vue'
import ButtonV3 from './examples/button/ButtonV3.vue'
import ButtonV4 from './examples/button/ButtonV4.vue'
import ButtonV5 from './examples/button/ButtonV5.vue'
import ButtonV6 from './examples/button/ButtonV6.vue'
import ButtonV7 from './examples/button/ButtonV7.vue'
import ButtonV8 from './examples/button/ButtonV8.vue'
import ButtonV9 from './examples/button/ButtonV9.vue'
import NCard from './NCard.vue'
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Button</h2>
    <ButtonV1 />
    <ButtonV2 />
    <ButtonV3 />
    <ButtonV4 />
    <ButtonV5 />
    <ButtonV6 />
    <ButtonV7 />
    <ButtonV8 />
    <ButtonV9 />
  </NCard>
</template>

<style scoped>
.btn-fixed-width {
  width: 180px;
}

.mt-0 {
  margin-top: 0;
}
</style>
