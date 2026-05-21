<script setup lang="ts">
import { computed, ref } from "vue";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { MatchPairsExercise } from "../../domain/exercises/exercise.types";
import AppButton from "../../shared/components/AppButton.vue";
import { todayIso } from "../../shared/utils/date";
import { shuffle } from "../../shared/utils/shuffle";

const props = defineProps<{
  exercise: MatchPairsExercise;
}>();

const emit = defineEmits<{
  completed: [result: AnswerResult];
}>();

const selections = ref<Record<string, string>>({});
const feedback = ref("");
const rightOptions = computed(() => shuffle(props.exercise.pairs, props.exercise.id));

function submit(): void {
  const mistakes = props.exercise.pairs
    .filter((pair) => selections.value[pair.id] !== pair.right)
    .map((pair) => `${pair.left} -> ${selections.value[pair.id] || "(geen keuze)"}`);
  const isCorrect = mistakes.length === 0;
  feedback.value = isCorrect ? "Alle paren kloppen." : "Er zitten nog verkeerde paren tussen.";

  emit("completed", {
    exerciseId: props.exercise.id,
    isCorrect,
    earnedPoints: isCorrect ? props.exercise.points : Math.max(0, props.exercise.points - mistakes.length * 4),
    mistakes,
    usedHint: false,
    completedAt: todayIso(),
  });
}
</script>

<template>
  <div class="mini-game">
    <p>{{ exercise.prompt }}</p>
    <form class="pairs" @submit.prevent="submit">
      <label v-for="pair in exercise.pairs" :key="pair.id" class="pair-row">
        <span>{{ pair.left }}</span>
        <select v-model="selections[pair.id]">
          <option value="">Kies...</option>
          <option v-for="option in rightOptions" :key="option.id" :value="option.right">
            {{ option.right }}
          </option>
        </select>
      </label>

      <AppButton type="submit" :disabled="Object.keys(selections).length < exercise.pairs.length">
        Controleer paren
      </AppButton>
      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </form>
  </div>
</template>

<style scoped>
.mini-game,
.pairs {
  display: grid;
  gap: 14px;
}

.pair-row {
  align-items: center;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(120px, 1fr) minmax(140px, 1fr);
}

.pair-row span {
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
  font-weight: 800;
  padding: 10px 12px;
}

select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  padding: 10px 12px;
}

.feedback {
  color: #475569;
  font-weight: 700;
}

@media (max-width: 620px) {
  .pair-row {
    grid-template-columns: 1fr;
  }
}
</style>
