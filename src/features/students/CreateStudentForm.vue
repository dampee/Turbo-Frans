<script setup lang="ts">
import { ref } from "vue";
import AppButton from "../../shared/components/AppButton.vue";

const emit = defineEmits<{
  create: [displayName: string];
}>();

const displayName = ref("");

function submit(): void {
  const name = displayName.value.trim();
  if (!name) {
    return;
  }

  emit("create", name);
  displayName.value = "";
}
</script>

<template>
  <form class="create-student-form" @submit.prevent="submit">
    <label for="student-name">Nieuwe bestuurder</label>
    <div class="row">
      <input id="student-name" v-model="displayName" autocomplete="off" placeholder="Naam van de student" />
      <AppButton type="submit" :disabled="!displayName.trim()">Maak profiel</AppButton>
    </div>
  </form>
</template>

<style scoped>
.create-student-form {
  display: grid;
  gap: 10px;
  text-align: left;
}

label {
  color: #334155;
  font-weight: 700;
}

.row {
  display: flex;
  gap: 10px;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  flex: 1;
  font: inherit;
  min-width: 0;
  padding: 10px 12px;
}

@media (max-width: 620px) {
  .row {
    flex-direction: column;
  }
}
</style>
