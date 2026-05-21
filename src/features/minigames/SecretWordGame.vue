<script setup lang="ts">
import { computed, ref } from "vue";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { SecretWordExercise } from "../../domain/exercises/exercise.types";
import { speechService } from "../../services/speech/speech.service";
import AppButton from "../../shared/components/AppButton.vue";
import { todayIso } from "../../shared/utils/date";
import { normalizeAnswer } from "../../shared/utils/normalizeAnswer";

const props = defineProps<{
  exercise: SecretWordExercise;
}>();

const emit = defineEmits<{
  completed: [result: AnswerResult];
}>();

const answer = ref("");
const mask = computed(() =>
  props.exercise.answer
    .split("")
    .map((letter, index) => (props.exercise.revealedLetters?.includes(index) ? letter : "_"))
    .join(" "),
);

function submit(): void {
  const isCorrect = normalizeAnswer(answer.value) === normalizeAnswer(props.exercise.answer);
  emit("completed", {
    exerciseId: props.exercise.id,
    isCorrect,
    earnedPoints: isCorrect ? props.exercise.points : 0,
    mistakes: isCorrect ? [] : [answer.value],
    usedHint: Boolean(props.exercise.revealedLetters?.length),
    completedAt: todayIso(),
  });
}

function speak(): void {
  speechService.speakFrench(props.exercise.speechText ?? props.exercise.answer);
}
</script>

<template>
  <form class="secret-word" @submit.prevent="submit">
    <p>{{ exercise.prompt }}</p>
    <p class="clue">{{ exercise.clue }}</p>
    <p class="mask">{{ mask }}</p>
    <input v-model="answer" autocomplete="off" aria-label="Geheim woord" />
    <div class="actions">
      <AppButton v-if="exercise.speechText" type="button" variant="ghost" @click="speak">Luister</AppButton>
      <AppButton type="submit" :disabled="!answer.trim()">Controleer</AppButton>
    </div>
  </form>
</template>

<style scoped>
.secret-word {
  display: grid;
  gap: 14px;
}

.clue {
  color: #475569;
}

.mask {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0;
}

input {
  border: 2px solid #93c5fd;
  border-radius: 8px;
  font: inherit;
  max-width: 260px;
  padding: 10px 12px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
