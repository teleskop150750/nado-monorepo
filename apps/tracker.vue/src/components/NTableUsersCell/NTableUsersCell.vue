<script setup>
import { NAvatar } from '@nado/nado-vue-ui'
import { computed } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },

  max: {
    type: Number,
    default: 3,
  },
  size: {
    type: Number,
    default: 26,
  },
})

const computedUsers = computed(() => {
  if (props.users.length > props.max) {
    return props.users.slice(0, props.max)
  }

  return props.users
})

const add = computed(() => props.users.length - props.max)
</script>

<template>
  <div class="n-table-users">
    <NAvatar
      v-for="user in computedUsers"
      :key="user.id"
      :size="size"
      class="n-table-users__user"
      :user-name="`${user.fullName.firstName[0]}. ${user.fullName.lastName}`"
    />

    <span v-if="add > 0" class="n-table-users__add"> +{{ add }} </span>
  </div>
</template>

<style>
.n-table-users {
  max-width: 160px;

  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;
}

.n-table-users__user {
  margin: 2px;
}
</style>
