<script setup>
import { NButton, NDropdown, NDropdownItem, NDropdownMenu } from '../../../components/index.js'
import { NIconArrowDown } from '../../../icons/index.js'

const handleClick = () => {
  // eslint-disable-next-line no-alert
  alert('button click')
}
</script>

<template>
  <div class="flex flex-wrap items-center">
    <NDropdown>
      <NButton>
        Dropdown List<span class="el-icon--right"><NIconArrowDown /></span>
      </NButton>
      <template #dropdown>
        <NDropdownMenu>
          <NDropdownItem>Action 1</NDropdownItem>
          <NDropdownItem>Action 2</NDropdownItem>
          <NDropdownItem>Action 3</NDropdownItem>
          <NDropdownItem>Action 4</NDropdownItem>
          <NDropdownItem>Action 5</NDropdownItem>
        </NDropdownMenu>
      </template>
    </NDropdown>
    <NDropdown split-button @click="handleClick">
      Dropdown List
      <template #dropdown>
        <NDropdownMenu>
          <NDropdownItem>Action 1</NDropdownItem>
          <NDropdownItem>Action 2</NDropdownItem>
          <NDropdownItem>Action 3</NDropdownItem>
          <NDropdownItem>Action 4</NDropdownItem>
          <NDropdownItem>Action 5</NDropdownItem>
        </NDropdownMenu>
      </template>
    </NDropdown>
  </div>
</template>

<style scoped>
.example-showcase .NDropdown + .NDropdown {
  margin-left: 15px;
}

.example-showcase .NDropdown-link {
  display: flex;
  align-items: center;

  color: var(--el-color-primary);

  cursor: pointer;
}
</style>
