<script setup lang="ts">
import type { Exercise } from "../../domain/exercises/exercise.types";
import type { Checkpoint } from "../../domain/race/track.types";
import AppCard from "../../shared/components/AppCard.vue";

defineProps<{
  checkpoint: Checkpoint;
  exercise?: Exercise;
}>();
</script>

<template>
  <AppCard class="checkpoint-card">
    <p class="label">Checkpoint</p>
    <h2>{{ checkpoint.title }}</h2>
    <p>{{ checkpoint.description }}</p>
    <p v-if="exercise" class="meta">{{ exercise.title }} · {{ exercise.points }} punten</p>
  </AppCard>
</template>

<style scoped>
.checkpoint-card {
  display: grid;
  gap: 6px;
}

.label {
  color: #f97316;
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
}

h2 {
  color: #0f172a;
  margin: 0;
}

.meta {
  color: #0f766e;
  font-weight: 800;
}
</style>
