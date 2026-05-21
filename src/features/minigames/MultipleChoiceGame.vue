<script setup lang="ts">
import { ref } from "vue";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { MultipleChoiceExercise } from "../../domain/exercises/exercise.types";
import { speechService } from "../../services/speech/speech.service";
import AppButton from "../../shared/components/AppButton.vue";
import { todayIso } from "../../shared/utils/date";

const props = defineProps<{
  exercise: MultipleChoiceExercise;
}>();

const emit = defineEmits<{
  completed: [result: AnswerResult];
}>();

const selectedChoiceId = ref("");
const feedback = ref("");

function submit(): void {
  const choice = props.exercise.choices.find((candidate) => candidate.id === selectedChoiceId.value);
  const isCorrect = Boolean(choice?.isCorrect);
  const correctChoice = props.exercise.choices.find((candidate) => candidate.isCorrect);
  feedback.value = isCorrect ? "Correct!" : `Nog oefenen. Het antwoord is ${correctChoice?.text ?? "onbekend"}.`;

  emit("completed", {
    exerciseId: props.exercise.id,
    isCorrect,
    earnedPoints: isCorrect ? props.exercise.points : 0,
    mistakes: isCorrect || !choice ? [] : [choice.text],
    usedHint: false,
    completedAt: todayIso(),
  });
}

function speak(): void {
  speechService.speakFrench(props.exercise.speechText ?? props.exercise.question);
}
</script>

<template>
  <div class="mini-game">
    <div class="prompt-row">
      <div>
        <p>{{ exercise.prompt }}</p>
        <h3>{{ exercise.question }}</h3>
      </div>
      <AppButton v-if="exercise.speechText" variant="ghost" @click="speak">Luister</AppButton>
    </div>

    <form class="choices" @submit.prevent="submit">
      <label v-for="choice in exercise.choices" :key="choice.id" class="choice">
        <input v-model="selectedChoiceId" type="radio" :value="choice.id" />
        <span>{{ choice.text }}</span>
      </label>

      <AppButton type="submit" :disabled="!selectedChoiceId">Controleer</AppButton>
      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </form>
  </div>
</template>

<style scoped>
.mini-game,
.choices {
  display: grid;
  gap: 14px;
}

.prompt-row {
  align-items: start;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

h3 {
  color: #0f172a;
  margin: 4px 0 0;
}

.choice {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 12px;
}

.feedback {
  color: #475569;
  font-weight: 700;
}
</style>
