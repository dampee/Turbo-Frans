<script setup lang="ts">
import { computed, ref } from "vue";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { CrackCodeExercise } from "../../domain/exercises/exercise.types";
import AppButton from "../../shared/components/AppButton.vue";
import { todayIso } from "../../shared/utils/date";
import { normalizeAnswer } from "../../shared/utils/normalizeAnswer";

const props = defineProps<{
  exercise: CrackCodeExercise;
}>();

const emit = defineEmits<{
  completed: [result: AnswerResult];
}>();

const answers = ref<Record<string, string>>({});
const openedSymbols = computed(() =>
  props.exercise.steps
    .filter((step) => step.acceptedAnswers.map(normalizeAnswer).includes(normalizeAnswer(answers.value[step.id] ?? "")))
    .map((step) => step.rewardSymbol),
);

function submit(): void {
  const mistakes = props.exercise.steps
    .filter((step) => !step.acceptedAnswers.map(normalizeAnswer).includes(normalizeAnswer(answers.value[step.id] ?? "")))
    .map((step) => `${step.question}: ${answers.value[step.id] || "(leeg)"}`);
  const isCorrect = mistakes.length === 0;

  emit("completed", {
    exerciseId: props.exercise.id,
    isCorrect,
    earnedPoints: isCorrect ? props.exercise.points : Math.max(0, props.exercise.points - mistakes.length * 3),
    mistakes,
    usedHint: false,
    completedAt: todayIso(),
  });
}
</script>

<template>
  <form class="crack-code" @submit.prevent="submit">
    <p>{{ exercise.prompt }}</p>
    <div class="symbols">
      <span v-for="(step, index) in exercise.steps" :key="step.id">
        {{ openedSymbols[index] ?? "?" }}
      </span>
    </div>

    <label v-for="step in exercise.steps" :key="step.id" class="step">
      <span>{{ step.question }}</span>
      <input v-model="answers[step.id]" autocomplete="off" />
    </label>

    <AppButton type="submit" :disabled="Object.keys(answers).length < exercise.steps.length">
      Open de finish
    </AppButton>
    <p class="final-message">{{ exercise.finalMessage }}</p>
  </form>
</template>

<style scoped>
.crack-code {
  display: grid;
  gap: 14px;
}

.symbols {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.symbols span {
  background: #111827;
  border-radius: 8px;
  color: #fef3c7;
  display: grid;
  font-size: 1.4rem;
  font-weight: 900;
  height: 44px;
  place-items: center;
  width: 44px;
}

.step {
  display: grid;
  gap: 8px;
}

.step span {
  color: #334155;
  font-weight: 700;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  padding: 10px 12px;
}

.final-message {
  color: #0f766e;
  font-weight: 800;
}
</style>
