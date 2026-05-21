<script setup lang="ts">
import { computed, ref } from "vue";
import type { RaceSession } from "../domain/race/race-session.types";
import type { StudentProfile } from "../domain/students/student.types";
import BuilderPage from "../features/builder/BuilderPage.vue";
import FinishPage from "../features/race/FinishPage.vue";
import RacePage from "../features/race/RacePage.vue";
import StudentSelectionPage from "../features/students/StudentSelectionPage.vue";
import { studentProfileStorage } from "../services/storage/student-profile.storage";
import { getInitialRoute, type AppRoute } from "./router";

const storedProfiles = studentProfileStorage.getAll();
const selectedStudentId = studentProfileStorage.getSelectedStudentId();
const initialStudent = storedProfiles.find((student) => student.id === selectedStudentId);
const route = ref<AppRoute>(getInitialRoute(Boolean(initialStudent)));
const selectedStudent = ref<StudentProfile | undefined>(initialStudent);
const finishedSession = ref<RaceSession | undefined>();
const returnRoute = ref<AppRoute>(route.value);
const canRace = computed(() => Boolean(selectedStudent.value));

function selectStudent(student: StudentProfile): void {
  selectedStudent.value = student;
  finishedSession.value = undefined;
  route.value = "race";
}

function showStudentSelection(): void {
  studentProfileStorage.clearSelectedStudent();
  selectedStudent.value = undefined;
  finishedSession.value = undefined;
  route.value = "students";
}

function finishRace(session: RaceSession): void {
  finishedSession.value = session;
  route.value = "finish";
}

function openBuilder(): void {
  returnRoute.value = route.value;
  route.value = "builder";
}

function closeBuilder(): void {
  route.value = returnRoute.value === "builder" ? "students" : returnRoute.value;
}

function restartRace(): void {
  finishedSession.value = undefined;
  route.value = canRace.value ? "race" : "students";
}
</script>

<template>
  <StudentSelectionPage
    v-if="route === 'students'"
    @selected="selectStudent"
    @open-builder="openBuilder"
  />
  <RacePage
    v-else-if="route === 'race' && selectedStudent"
    :key="selectedStudent.id"
    :student="selectedStudent"
    @finish="finishRace"
    @change-student="showStudentSelection"
    @open-builder="openBuilder"
  />
  <FinishPage
    v-else-if="route === 'finish' && finishedSession"
    :session="finishedSession"
    @restart="restartRace"
    @change-student="showStudentSelection"
  />
  <BuilderPage v-else-if="route === 'builder'" @back="closeBuilder" />
  <StudentSelectionPage v-else @selected="selectStudent" @open-builder="openBuilder" />
</template>
