<script setup lang="ts">
import { computed, ref } from "vue";
import type { StudentProfile } from "../../domain/students/student.types";
import { studentProfileStorage } from "../../services/storage/student-profile.storage";
import AppButton from "../../shared/components/AppButton.vue";
import AppCard from "../../shared/components/AppCard.vue";
import CreateStudentForm from "./CreateStudentForm.vue";
import StudentCard from "./StudentCard.vue";

const emit = defineEmits<{
  selected: [student: StudentProfile];
  openBuilder: [];
}>();

const profiles = ref<StudentProfile[]>(studentProfileStorage.getAll());
const hasProfiles = computed(() => profiles.value.length > 0);

function createStudent(displayName: string): void {
  const student = studentProfileStorage.create(displayName);
  profiles.value = studentProfileStorage.getAll();
  emit("selected", student);
}

function selectStudent(studentId: string): void {
  studentProfileStorage.setSelectedStudentId(studentId);
  const student = studentProfileStorage.getAll().find((profile) => profile.id === studentId);
  if (student) {
    profiles.value = studentProfileStorage.getAll();
    emit("selected", student);
  }
}
</script>

<template>
  <main class="student-selection">
    <header class="hero">
      <p class="eyebrow">Rallye des Mots</p>
      <h1>Kies je bestuurder</h1>
      <p>Iedere student krijgt eigen punten, reeksen, badges en geschiedenis op deze computer.</p>
    </header>

    <AppCard class="panel">
      <div v-if="hasProfiles" class="student-list">
        <StudentCard
          v-for="profile in profiles"
          :key="profile.id"
          :student="profile"
          @select="selectStudent"
        />
      </div>
      <p v-else class="empty">Maak eerst een studentprofiel om te starten.</p>

      <CreateStudentForm @create="createStudent" />
    </AppCard>

    <AppButton variant="ghost" @click="$emit('openBuilder')">Open interne builder</AppButton>
  </main>
</template>

<style scoped>
.student-selection {
  display: grid;
  gap: 22px;
  margin: 0 auto;
  max-width: 860px;
  padding: 36px 20px;
}

.hero {
  display: grid;
  gap: 8px;
  text-align: left;
}

.eyebrow {
  color: #f97316;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1;
  margin: 0;
}

.panel {
  display: grid;
  gap: 24px;
}

.student-list {
  display: grid;
  gap: 12px;
}

.empty {
  background: #f8fafc;
  border-radius: 8px;
  color: #475569;
  padding: 18px;
}
</style>
