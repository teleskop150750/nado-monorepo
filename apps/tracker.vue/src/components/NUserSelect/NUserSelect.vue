<script setup>
// @ts-nocheck
import { NAvatar, NCheckbox, NFormItem, NIconClose, NInput, NPopover, NVirtualList } from '@nado/nado-vue-ui'
import { computed } from 'vue'

import UserPreview from './NUserPreview.vue'

const props = defineProps({
  search: {
    type: String,
    default: '',
  },
  users: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:search', 'select', 'unselect'])

const userOptions = computed(() =>
  props.users.map((user) => {
    let selected = false
    let disabled = false
    const selectedIds = props.selected.map((item) => item.id)
    const disabledIds = props.disabled.map((item) => item.id)

    if (selectedIds.includes(user.id)) {
      selected = true
    }

    if (disabledIds.includes(user.id)) {
      disabled = true
    }

    return {
      value: user,
      label: `${user.fullName.firstName[0]}. ${user.fullName.lastName}`,
      disabled,
      selected,
    }
  }),
)

const availableUsers = computed(() => userOptions.value.filter((el) => !el.disabled))
const selectedUsers = computed(() =>
  props.selected.map((user) => {
    let disabled = false
    const disabledIds = props.disabled.map((item) => item.id)

    if (disabledIds.includes(user.id)) {
      disabled = true
    }

    return {
      value: user,
      label: `${user.fullName.firstName[0]}. ${user.fullName.lastName}`,
      disabled,
    }
  }),
)
const availableSelectedUsers = computed(() => availableUsers.value.filter((el) => el.selected))

const isSelectAll = computed(() => {
  if (availableUsers.value.length === availableSelectedUsers.value.length) {
    return true
  }

  if (availableSelectedUsers.value.length === 0) {
    return false
  }

  return 0
})

function handleSearch(value) {
  emit('update:search', value)
}

function handleSelectAll(value) {
  if (value) {
    emit(
      'select',
      userOptions.value.filter((el) => !el.disabled && !el.selected),
    )
  } else {
    emit(
      'unselect',
      userOptions.value.filter((el) => !el.disabled && el.selected),
    )
  }
}

function handleSelect(value, user) {
  if (value) {
    emit('select', [user])
  } else {
    emit('unselect', [user])
  }
}
</script>

<template>
  <div class="n-user-select">
    <div class="n-user-select__header">
      <div class="n-user-select__header-input">
        <NFormItem label="Поиск" prop="email" hide-hint>
          <NInput
            :model-value="search"
            placeholder="example@gmail.com"
            autocomplete="off"
            @update:model-value="handleSearch"
          />
        </NFormItem>
      </div>
      <div class="n-user-select__header-checkbox">
        <NCheckbox :model-value="isSelectAll" @update:model-value="handleSelectAll" />
      </div>
    </div>

    <div class="n-user-select__body">
      <NVirtualList
        v-if="userOptions.length > 0"
        :scrollbar-always-on="true"
        :cache="3"
        :height="46 * 5"
        :item-size="46"
        :data="userOptions"
      >
        <template #default="{ index, style, data }">
          <div class="n-user-select__item" :class="[index % 2 === 0 && 'scrollbar-demo-item--white']" :style="style">
            <div class="n-user-select__item-avatar">
              <NAvatar :user-name="data[index].label" />
            </div>
            <div class="n-user-select__item-info">
              <p class="n-user-select__item-name">
                {{ data[index].label }}
              </p>
              <span class="n-user-select__item-email">{{ data[index].value.email }}</span>
            </div>
            <div class="n-user-select__item-checkbox">
              <NCheckbox
                :model-value="data[index].selected"
                :disabled="data[index].disabled"
                @update:model-value="handleSelect($event, data[index])"
              />
            </div>
          </div>
        </template>
      </NVirtualList>
      <p v-else class="n-user-select__not-found">Пользователи не найдены</p>
    </div>

    <div class="n-user-select__footer">
      <div class="n-user-select__users">
        <div v-for="user in selectedUsers" :key="user.value.id" class="n-user-select__user">
          <NPopover placement="top" title="Пользователь" :width="200" trigger="click">
            <template #reference>
              <button type="button" class="n-user-select__user-button">
                <NAvatar class="n-user-select__user-button-icon" :user-name="user.label" />
              </button>
            </template>
            <template #default>
              <UserPreview :user="user.value" />
            </template>
          </NPopover>
          <button
            v-if="!user.disabled"
            class="n-user-select__user-delete"
            type="button"
            @click="handleSelect(false, user)"
          >
            <NIconClose class="n-user-select__user-delete-icon" />
          </button>
        </div>
      </div>
    </div>
    <!-- <pre>{{ users }}</pre> -->
  </div>
</template>

<style>
.n-user-select__header {
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: 1rem;
  align-items: flex-end;

  margin-bottom: 1rem;
  padding: 0 17px 0 0;
}

.n-user-select__body {
  border: 1px solid var(--el-card-border-color);
  border-radius: var(--el-card-border-radius);
}

.n-user-select__item {
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  justify-content: space-between;
  align-items: center;

  height: 46px;
  padding: 0 1rem;

  border-bottom: 1px solid var(--n-sys-color-info-200);
}

.n-user-select__item-info {
  display: grid;

  height: 100%;
  margin: 0;
  padding: 0 1rem;
}

.n-user-select__item-name {
  display: flex;
  align-items: center;

  margin: 0;

  font-size: 15px;
  line-height: 1;
}

.n-user-select__item-email {
  display: flex;
  align-items: center;

  color: var(--n-sys-color-info-400);
  font-size: 14px;
  line-height: 1;
  motion: 0;
}

.n-user-select__footer {
  min-height: 64px;
  padding: 1rem 0;
}

.n-user-select__users {
  position: relative;

  display: flex;
  gap: 0.5rem;
}

.n-user-select__user {
  position: relative;
}

.n-user-select__user-button {
  display: block;

  margin: 0;
  padding: 0;

  border: 0;

  background-color: transparent;

  cursor: pointer;
}

.n-user-select__user-delete {
  position: absolute;
  top: 0;
  right: 0;

  display: block;

  width: 12px;
  height: 12px;
  margin: 0;
  padding: 0;

  color: white;

  border: none;
  border-radius: 16px;

  background-color: black;

  box-shadow: 0 0 0 2px white;

  cursor: pointer;
}

.n-user-select__user-delete-icon {
  display: block;

  width: 100%;
  height: 100%;
}

.n-user-select__not-found {
  padding: 0 1rem;
}
</style>
