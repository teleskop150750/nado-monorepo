<template>
  <div class="login-layout">
    <main class="login-layout__main">
      <slot />
    </main>
  </div>
</template>

<style>
.login-layout {
  background-color: var(--n-sys-color-secondary-800);
}

.login-layout__main {
  min-height: 100vh;
}
</style>
