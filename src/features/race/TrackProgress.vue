<script setup lang="ts">
import type { Track } from "../../domain/race/track.types";

defineProps<{
  track: Track;
  currentIndex: number;
}>();
</script>

<template>
  <ol class="track-progress" aria-label="Track checkpoints">
    <li
      v-for="(checkpoint, index) in track.checkpoints"
      :key="checkpoint.id"
      :class="{ complete: index < currentIndex, current: index === currentIndex }"
    >
      <span class="dot">{{ index < currentIndex ? "✓" : index + 1 }}</span>
      <span>{{ checkpoint.title }}</span>
    </li>
  </ol>
</template>

<style scoped>
.track-progress {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  gap: 8px;
  min-height: 48px;
  padding: 8px;
}

.dot {
  background: #cbd5e1;
  border-radius: 999px;
  color: #fff;
  display: grid;
  flex: 0 0 auto;
  font-size: 0.86rem;
  font-weight: 900;
  height: 28px;
  place-items: center;
  width: 28px;
}

.complete {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #166534;
}

.complete .dot {
  background: #16a34a;
}

.current {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a3412;
}

.current .dot {
  background: #f97316;
}
</style>
