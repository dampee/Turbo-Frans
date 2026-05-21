<script setup lang="ts">
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { Exercise } from "../../domain/exercises/exercise.types";
import CrackCodeGame from "./CrackCodeGame.vue";
import FillBlankGame from "./FillBlankGame.vue";
import MatchPairsGame from "./MatchPairsGame.vue";
import MultipleChoiceGame from "./MultipleChoiceGame.vue";
import SecretWordGame from "./SecretWordGame.vue";

defineProps<{
  exercise: Exercise;
}>();

defineEmits<{
  completed: [result: AnswerResult];
}>();
</script>

<template>
  <FillBlankGame v-if="exercise.type === 'fill-blank'" :exercise="exercise" @completed="$emit('completed', $event)" />
  <MultipleChoiceGame
    v-else-if="exercise.type === 'multiple-choice'"
    :exercise="exercise"
    @completed="$emit('completed', $event)"
  />
  <MatchPairsGame
    v-else-if="exercise.type === 'match-pairs'"
    :exercise="exercise"
    @completed="$emit('completed', $event)"
  />
  <SecretWordGame
    v-else-if="exercise.type === 'secret-word'"
    :exercise="exercise"
    @completed="$emit('completed', $event)"
  />
  <CrackCodeGame v-else :exercise="exercise" @completed="$emit('completed', $event)" />
</template>
