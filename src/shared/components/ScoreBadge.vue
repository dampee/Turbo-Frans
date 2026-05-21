<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>

<template>
  <div class="score-badge">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
  </div>
</template>

<style scoped>
.score-badge {
  align-items: center;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #075985;
  display: inline-flex;
  gap: 8px;
  padding: 8px 12px;
}

.score-badge span {
  font-size: 0.86rem;
}
</style>
