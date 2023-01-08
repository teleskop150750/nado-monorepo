<script setup>
import { computed } from 'vue';
import { avatarProps } from './avatar.js';

const props = defineProps(avatarProps)
const backgrounds = [
  '#cddc39',
  '#f44336',
  '#ffc107',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ff9800',
  '#ff5722',
]

const parsedUserName = computed(() => props.userName.split(' ').map((el) => el.slice(0, 1)).slice(0, 2).join(''))

const background = computed(() => {
  const number = parsedUserName.value.split('').reduce((accumulator, currentValue) => accumulator + currentValue.charCodeAt(0), 0)

  return backgrounds[number % backgrounds.length]
})

const style = computed(() => ({
  backgroundColor: background.value,
  height: `${props.size}px`,
  width: `${props.size}px`,
}))
</script>

<template>
  <span class="n-avatar" :style="style">
    {{ parsedUserName }}
  </span>
</template>
