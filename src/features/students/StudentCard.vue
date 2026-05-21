<script setup lang="ts">
import type { StudentProfile } from "../../domain/students/student.types";
import AppButton from "../../shared/components/AppButton.vue";

defineProps<{
  student: StudentProfile;
}>();

defineEmits<{
  select: [studentId: string];
}>();
</script>

<template>
  <article class="student-card">
    <div class="avatar" :style="{ background: student.avatarColor }">
      {{ student.displayName.slice(0, 1).toUpperCase() }}
    </div>
    <div>
      <h3>{{ student.displayName }}</h3>
      <p>Laatst gespeeld: {{ new Date(student.lastUsedAt).toLocaleDateString() }}</p>
    </div>
    <AppButton @click="$emit('select', student.id)">Racen</AppButton>
  </article>
</template>

<style scoped>
.student-card {
  align-items: center;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  display: grid;
  gap: 14px;
  grid-template-columns: auto 1fr auto;
  padding: 14px;
}

.avatar {
  align-items: center;
  border-radius: 999px;
  color: #fff;
  display: grid;
  font-size: 1.4rem;
  font-weight: 800;
  height: 48px;
  place-items: center;
  width: 48px;
}

h3 {
  color: #0f172a;
  margin: 0;
}

p {
  color: #64748b;
  margin: 2px 0 0;
}

@media (max-width: 620px) {
  .student-card {
    grid-template-columns: auto 1fr;
  }

  .student-card button {
    grid-column: 1 / -1;
  }
}
</style>
