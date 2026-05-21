<script setup lang="ts">
import { computed, ref } from "vue";
import { tracks } from "../../data/tracks/tracks";
import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { Exercise } from "../../domain/exercises/exercise.types";
import type { RaceSession } from "../../domain/race/race-session.types";
import type { StudentProfile } from "../../domain/students/student.types";
import { exerciseRepository } from "../../services/exercises/exercise-repository";
import { rewardService } from "../../services/scoring/reward.service";
import { scoreService } from "../../services/scoring/score.service";
import { streakService } from "../../services/scoring/streak.service";
import { raceSessionStorage } from "../../services/storage/race-session.storage";
import AppButton from "../../shared/components/AppButton.vue";
import ScoreBadge from "../../shared/components/ScoreBadge.vue";
import { todayIso } from "../../shared/utils/date";
import { createId } from "../../shared/utils/id";
import MiniGameRenderer from "../minigames/MiniGameRenderer.vue";
import CheckpointCard from "./CheckpointCard.vue";
import TrackProgress from "./TrackProgress.vue";

const props = defineProps<{
  student: StudentProfile;
}>();

const emit = defineEmits<{
  finish: [session: RaceSession];
  changeStudent: [];
  openBuilder: [];
}>();

const track = tracks[0];
const session = ref(loadSession());
const currentCheckpoint = computed(() => track.checkpoints[session.value.currentCheckpointIndex]);
const currentExercise = computed<Exercise | undefined>(() =>
  currentCheckpoint.value ? exerciseRepository.getExerciseForCheckpoint(currentCheckpoint.value) : undefined,
);

function loadSession(): RaceSession {
  const existing = raceSessionStorage.getActiveSession(props.student.id);
  if (existing && existing.trackId === track.id && !existing.completedAt) {
    return existing;
  }

  const nextSession: RaceSession = {
    id: createId("race"),
    studentId: props.student.id,
    trackId: track.id,
    currentCheckpointIndex: 0,
    score: { points: 0, correctAnswers: 0, mistakes: 0 },
    streak: { current: 0, best: 0 },
    results: [],
    earnedBadges: [],
    startedAt: todayIso(),
  };
  raceSessionStorage.saveActiveSession(nextSession);
  return nextSession;
}

function handleCompleted(result: AnswerResult): void {
  const updated: RaceSession = {
    ...session.value,
    score: scoreService.applyResult(session.value.score, result),
    streak: streakService.applyResult(session.value.streak, result),
    results: [...session.value.results, result],
    currentCheckpointIndex: session.value.currentCheckpointIndex + 1,
  };

  if (updated.currentCheckpointIndex >= track.checkpoints.length) {
    const completed = {
      ...updated,
      completedAt: todayIso(),
    };
    const withRewards = {
      ...completed,
      earnedBadges: rewardService.calculateBadges(completed),
    };
    session.value = withRewards;
    raceSessionStorage.completeSession(withRewards);
    emit("finish", withRewards);
    return;
  }

  session.value = updated;
  raceSessionStorage.saveActiveSession(updated);
}

function restartRace(): void {
  const fresh: RaceSession = {
    id: createId("race"),
    studentId: props.student.id,
    trackId: track.id,
    currentCheckpointIndex: 0,
    score: { points: 0, correctAnswers: 0, mistakes: 0 },
    streak: { current: 0, best: 0 },
    results: [],
    earnedBadges: [],
    startedAt: todayIso(),
  };
  session.value = fresh;
  raceSessionStorage.saveActiveSession(fresh);
}
</script>

<template>
  <main class="race-page">
    <header class="race-header">
      <div>
        <p class="eyebrow">Turbo Français</p>
        <h1>{{ track.title }}</h1>
        <p>{{ track.description }}</p>
      </div>
      <div class="header-actions">
        <AppButton variant="ghost" @click="$emit('openBuilder')">Builder</AppButton>
        <AppButton variant="ghost" @click="$emit('changeStudent')">Andere student</AppButton>
      </div>
    </header>

    <section class="score-row">
      <ScoreBadge label="Student" :value="student.displayName" />
      <ScoreBadge label="Punten" :value="session.score.points" />
      <ScoreBadge label="Juist" :value="session.score.correctAnswers" />
      <ScoreBadge label="Streak" :value="session.streak.current" />
      <ScoreBadge label="Beste streak" :value="session.streak.best" />
    </section>

    <TrackProgress :track="track" :current-index="session.currentCheckpointIndex" />

    <div v-if="currentCheckpoint && currentExercise" class="race-grid">
      <CheckpointCard :checkpoint="currentCheckpoint" :exercise="currentExercise" />
      <section class="game-panel">
        <MiniGameRenderer :key="currentExercise.id" :exercise="currentExercise" @completed="handleCompleted" />
      </section>
    </div>

    <section v-else class="game-panel">
      <h2>Geen oefening gevonden</h2>
      <p>Dit checkpoint verwijst naar ontbrekende data.</p>
      <AppButton @click="restartRace">Herstart race</AppButton>
    </section>
  </main>
</template>

<style scoped>
.race-page {
  display: grid;
  gap: 20px;
  padding: 24px 20px 40px;
}

.race-header {
  align-items: start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  text-align: left;
}

.eyebrow {
  color: #f97316;
  font-weight: 900;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  margin: 0 0 8px;
}

.header-actions,
.score-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.race-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
}

.game-panel {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(30, 41, 59, 0.08);
  padding: 20px;
  text-align: left;
}

@media (max-width: 780px) {
  .race-header,
  .race-grid {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
