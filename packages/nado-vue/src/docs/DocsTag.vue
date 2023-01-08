<script setup>
import { NTag } from '../components/index.js'
import NCard from './NCard.vue'
</script>

<template>
  <NCard>
    <h2 class="n-title-2">Tag</h2>

    <h3 class="n-title-3">Basic usage</h3>
    <div class="row">
      <div class="col">
        <NTag appearance="info">Label</NTag>
      </div>
      <div class="col">
        <NTag>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="success">Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="secondary">Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="warn">Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="error">Label</NTag>
      </div>
    </div>

    <h3 class="n-title-3">Removable Tag</h3>
    <div class="row">
      <div class="col">
        <NTag appearance="info" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="primary" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="success" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="secondary" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="warn" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag appearance="error" closable>Label</NTag>
      </div>
    </div>

    <h3 class="n-title-3">Sizes</h3>
    <div class="row">
      <div class="col">
        <NTag size="small">Label</NTag>
      </div>
      <div class="col">
        <NTag size="default">Label</NTag>
      </div>
      <div class="col">
        <NTag size="large">Label</NTag>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <NTag size="small" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag size="default" closable>Label</NTag>
      </div>
      <div class="col">
        <NTag size="large" closable>Label</NTag>
      </div>
    </div>
  </NCard>
</template>
