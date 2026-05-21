<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary",
    disabled: false,
  },
);
</script>

<template>
  <button class="app-button" :class="variant" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  min-height: 42px;
  padding: 10px 16px;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    background 120ms ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.primary {
  background: #f97316;
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.25);
  color: #fff7ed;
}

.secondary {
  background: #0f766e;
  color: #ecfeff;
}

.ghost {
  background: #eef2ff;
  color: #3730a3;
}
</style>
