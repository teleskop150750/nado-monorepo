<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="n-user-preview">
    <p class="n-user-preview__name">{{ user.fullName.firstName }} {{ user.fullName.lastName }}</p>

    <div v-if="user.post || user.department" class="n-user-preview__work">
      <p v-if="user.post" class="n-user-preview__post">{{ user.post }}</p>
      <p v-if="user.department" class="n-user-preview__department">
        {{ user.department }}
      </p>
    </div>

    <div class="n-user-preview__personal">
      <p class="n-user-preview__email">{{ user.email }}</p>
      <p v-if="user.phone" class="n-user-preview__phone">{{ user.phone }}</p>
    </div>
  </div>
</template>

<style>
.n-user-preview__name {
  margin: 0;
  margin-bottom: 1rem;

  font-weight: 600;
  font-size: 14px;
  line-height: 1;
}

.n-user-preview__work {
  margin-bottom: 1rem;
}

.n-user-preview__post {
  margin: 0;

  color: var(--n-sys-color-info-400);
  font-size: 12;
}

.n-user-preview__department {
  margin: 0;

  color: var(--n-sys-color-info-400);
  font-size: 12;
}

.n-user-preview__email {
  margin: 0;

  color: var(--n-sys-color-info-400);
  font-size: 12;
}

.n-user-preview__phone {
  margin: 0;

  color: var(--n-sys-color-info-400);
  font-size: 12;
}
</style>
