<script setup lang="ts">
import { computed, ref } from "vue";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { FillBlankExercise } from "../../domain/exercises/exercise.types";
import { speechService } from "../../services/speech/speech.service";
import AppButton from "../../shared/components/AppButton.vue";
import { todayIso } from "../../shared/utils/date";
import { normalizeAnswer } from "../../shared/utils/normalizeAnswer";

const props = defineProps<{
  exercise: FillBlankExercise;
}>();

const emit = defineEmits<{
  completed: [result: AnswerResult];
}>();

const answer = ref("");
const usedHint = ref(false);
const feedback = ref("");
const sentenceParts = computed(() => props.exercise.sentence.split("___"));

function submit(): void {
  const normalized = normalizeAnswer(answer.value);
  const accepted = props.exercise.acceptedAnswers.map(normalizeAnswer);
  const isCorrect = accepted.includes(normalized);
  feedback.value = isCorrect ? "Juist, gas geven!" : `Bijna. Het juiste antwoord is ${props.exercise.acceptedAnswers[0]}.`;

  emit("completed", {
    exerciseId: props.exercise.id,
    isCorrect,
    earnedPoints: isCorrect ? (usedHint.value ? Math.ceil(props.exercise.points * 0.7) : props.exercise.points) : 0,
    mistakes: isCorrect ? [] : [answer.value || "(leeg antwoord)"],
    usedHint: usedHint.value,
    completedAt: todayIso(),
  });
}

function speak(): void {
  speechService.speakFrench(props.exercise.speechText ?? props.exercise.sentence.replace("___", ""));
}
</script>

<template>
  <div class="mini-game">
    <div class="prompt-row">
      <p>{{ exercise.prompt }}</p>
      <AppButton v-if="exercise.speechText" variant="ghost" @click="speak">Luister</AppButton>
    </div>

    <form class="answer-form" @submit.prevent="submit">
      <p class="sentence">
        <span>{{ sentenceParts[0] }}</span>
        <input v-model="answer" autocomplete="off" aria-label="Antwoord" />
        <span>{{ sentenceParts[1] }}</span>
      </p>

      <p v-if="usedHint && exercise.hint" class="hint">{{ exercise.hint }}</p>
      <div class="actions">
        <AppButton v-if="exercise.hint" type="button" variant="ghost" @click="usedHint = true">Hint</AppButton>
        <AppButton type="submit" :disabled="!answer.trim()">Controleer</AppButton>
      </div>
      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </form>
  </div>
</template>

<style scoped>
.mini-game,
.answer-form {
  display: grid;
  gap: 16px;
}

.prompt-row {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.sentence {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.4rem;
  gap: 8px;
}

input {
  border: 2px solid #93c5fd;
  border-radius: 8px;
  font: inherit;
  max-width: 180px;
  padding: 8px 10px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hint,
.feedback {
  color: #475569;
  font-weight: 700;
}
</style>
