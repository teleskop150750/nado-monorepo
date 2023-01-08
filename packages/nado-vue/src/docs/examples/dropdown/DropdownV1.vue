<script setup>
import { NDropdown, NDropdownItem, NDropdownMenu } from '../../../components/index.js'
import { NIconArrowDown } from '../../../icons/index.js'
</script>

<template>
  <h3 class="n-title-3">Basic</h3>

  <NDropdown>
    <span class="n-dropdown-link">
      Dropdown List
      <span class="icon">
        <NIconArrowDown />
      </span>
    </span>
    <template #dropdown>
      <NDropdownMenu>
        <NDropdownItem>Action 1</NDropdownItem>
        <NDropdownItem>Action 2</NDropdownItem>
        <NDropdownItem>Action 3</NDropdownItem>
        <NDropdownItem disabled>Action 4</NDropdownItem>
        <NDropdownItem divided>Action 5</NDropdownItem>
      </NDropdownMenu>
    </template>
  </NDropdown>
</template>

<style scoped>
.example-showcase .n-dropdown-link {
  display: flex;
  align-items: center;

  color: var(--n-sys-color-primary);

  cursor: pointer;
}

.icon {
  vertical-align: middle;
}
</style>
