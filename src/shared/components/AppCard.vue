<template>
  <section class="app-card">
    <slot />
  </section>
</template>

<style scoped>
.app-card {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(30, 41, 59, 0.08);
  padding: 20px;
}
</style>
