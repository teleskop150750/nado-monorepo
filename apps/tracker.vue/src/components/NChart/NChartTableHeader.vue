<script setup></script>

<template>
  <div class="n-chart-table-item">
    <div class="n-chart-table-item__name">Название</div>
    <div class="n-chart-table-item__author">Автор</div>
    <div class="n-chart-table-item__author">Исполнители</div>
  </div>
</template>

<style>
.n-chart-table-item {
  display: grid;
  grid-template-columns: var(--n-chart-table-size);
  align-items: center;

  height: 100%;
  padding: 4px;

  font-size: 12px;
}
</style>
