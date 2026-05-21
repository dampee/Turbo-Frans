<script setup lang="ts">
import type { RaceSession } from "../../domain/race/race-session.types";
import { rewardService } from "../../services/scoring/reward.service";
import AppButton from "../../shared/components/AppButton.vue";
import AppCard from "../../shared/components/AppCard.vue";
import RewardBadge from "../../shared/components/RewardBadge.vue";
import ScoreBadge from "../../shared/components/ScoreBadge.vue";

defineProps<{
  session: RaceSession;
}>();

defineEmits<{
  restart: [];
  changeStudent: [];
}>();
</script>

<template>
  <main class="finish-page">
    <AppCard class="finish-card">
      <p class="eyebrow">Finish</p>
      <h1>Race voltooid</h1>
      <section class="score-row">
        <ScoreBadge label="Score" :value="session.score.points" />
        <ScoreBadge label="Juist" :value="session.score.correctAnswers" />
        <ScoreBadge label="Mistakes" :value="session.score.mistakes" />
        <ScoreBadge label="Beste streak" :value="session.streak.best" />
      </section>

      <section>
        <h2>Badges en rewards</h2>
        <div v-if="session.earnedBadges.length" class="badges">
          <RewardBadge
            v-for="earned in session.earnedBadges"
            :key="earned.badgeId"
            :badge="rewardService.findBadge(earned.badgeId) ?? { id: earned.badgeId, title: earned.badgeId, description: '', icon: '★' }"
          />
        </div>
        <p v-else>Geen badges deze keer.</p>
      </section>

      <section>
        <h2>Fouten om te oefenen</h2>
        <ul v-if="session.results.some((result) => result.mistakes.length)">
          <li v-for="result in session.results" :key="result.exerciseId">
            <span v-if="result.mistakes.length">{{ result.mistakes.join(", ") }}</span>
          </li>
        </ul>
        <p v-else>Perfecte rit zonder fouten.</p>
      </section>

      <div class="actions">
        <AppButton @click="$emit('restart')">Nog een race</AppButton>
        <AppButton variant="ghost" @click="$emit('changeStudent')">Andere student</AppButton>
      </div>
    </AppCard>
  </main>
</template>

<style scoped>
.finish-page {
  display: grid;
  min-height: 100vh;
  padding: 30px 20px;
  place-items: center;
}

.finish-card {
  display: grid;
  gap: 20px;
  max-width: 860px;
  width: 100%;
}

.eyebrow {
  color: #16a34a;
  font-weight: 900;
  text-transform: uppercase;
}

h1,
h2 {
  color: #0f172a;
  margin: 0;
}

.score-row,
.badges,
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

ul {
  margin: 0;
  padding-left: 20px;
}
</style>
