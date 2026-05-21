<script setup lang="ts">
import type { Badge } from "../../domain/race/reward.types";

defineProps<{
  badge: Badge;
}>();
</script>

<template>
  <div class="reward-badge" :title="badge.description">
    <span class="icon">{{ badge.icon }}</span>
    <span>{{ badge.title }}</span>
  </div>
</template>

<style scoped>
.reward-badge {
  align-items: center;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  color: #92400e;
  display: inline-flex;
  font-weight: 700;
  gap: 8px;
  padding: 8px 12px;
}

.icon {
  font-size: 1.2rem;
}
</style>
