<template>
  <div class="docs-card">
    <slot />
  </div>
</template>

<style>
.docs-card {
  --surface-card: hsl(0deg 0% 100%);

  margin-bottom: 2rem;
  padding: 2rem;
  box-sizing: border-box;

  color: var(--text-color);
  font-weight: 400;
  font-size: 14px;

  border-radius: 10px;

  background-color: var(--surface-card);
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
}

h2,
h3 {
  margin: 1.5em 0 1em;
}

h1:first-child,
h2:first-child,
h3:first-child,
h4:first-child,
h5:first-child,
h6:first-child {
  margin-top: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-end;
}

.row + .row {
  margin-top: 1rem;
}

.row.center {
  justify-content: center;
}
</style>
