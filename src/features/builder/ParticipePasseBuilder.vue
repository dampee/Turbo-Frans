<script setup lang="ts">
import { computed, reactive } from "vue";
import type { FrenchVerb, FrenchVerbGroup } from "../../domain/french/french-verb.types";
import AppCard from "../../shared/components/AppCard.vue";
import ExerciseJsonPreview from "./ExerciseJsonPreview.vue";

const form = reactive({
  infinitive: "manger",
  translationNl: "eten",
  participePasse: "mangé",
  auxiliary: "avoir" as "avoir" | "être",
  group: "er" as FrenchVerbGroup,
  moduleIds: "casse-cou-5-module-5",
  tags: "regular, participe-passe",
  notes: "",
});

const verb = computed<FrenchVerb>(() => ({
  infinitive: form.infinitive.trim(),
  translationNl: form.translationNl.trim(),
  participePasse: form.participePasse.trim(),
  auxiliary: form.auxiliary,
  group: form.group,
  moduleIds: splitCsv(form.moduleIds),
  tags: splitCsv(form.tags),
  notes: form.notes.trim() || undefined,
}));

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
</script>

<template>
  <AppCard class="builder-card">
    <div>
      <h2>Participe passe builder</h2>
      <p>Maak brondata voor een nieuw Frans werkwoord.</p>
    </div>

    <div class="form-grid">
      <label>
        Infinitive
        <input v-model="form.infinitive" />
      </label>
      <label>
        Dutch translation
        <input v-model="form.translationNl" />
      </label>
      <label>
        Participe passe
        <input v-model="form.participePasse" />
      </label>
      <label>
        Auxiliary
        <select v-model="form.auxiliary">
          <option value="avoir">avoir</option>
          <option value="être">être</option>
        </select>
      </label>
      <label>
        Group
        <select v-model="form.group">
          <option value="er">er</option>
          <option value="ir">ir</option>
          <option value="re">re</option>
          <option value="irregular">irregular</option>
        </select>
      </label>
      <label>
        Module ids
        <input v-model="form.moduleIds" />
      </label>
      <label>
        Tags
        <input v-model="form.tags" />
      </label>
      <label class="wide">
        Notes
        <textarea v-model="form.notes" rows="3" />
      </label>
    </div>

    <ExerciseJsonPreview title="FrenchVerb JSON" :value="verb" />
  </AppCard>
</template>

<style scoped>
.builder-card {
  display: grid;
  gap: 18px;
}

h2 {
  color: #0f172a;
  margin: 0 0 4px;
}

.form-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

label {
  color: #334155;
  display: grid;
  font-weight: 800;
  gap: 6px;
}

.wide {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  padding: 10px 12px;
}
</style>
