<script setup lang="ts">
import AppButton from "../../shared/components/AppButton.vue";
import ParticipePasseBuilder from "./ParticipePasseBuilder.vue";

defineEmits<{
  back: [];
}>();
</script>

<template>
  <main class="builder-page">
    <header>
      <div>
        <p class="eyebrow">Interne builder</p>
        <h1>Exercise data tools</h1>
        <p>Deze pagina slaat niets op. Gebruik de JSON om TypeScript brondata aan te vullen.</p>
      </div>
      <AppButton variant="ghost" @click="$emit('back')">Terug</AppButton>
    </header>

    <ParticipePasseBuilder />
  </main>
</template>

<style scoped>
.builder-page {
  display: grid;
  gap: 20px;
  padding: 28px 20px 40px;
}

header {
  align-items: start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  text-align: left;
}

.eyebrow {
  color: #0f766e;
  font-weight: 900;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  margin: 0 0 8px;
}

@media (max-width: 620px) {
  header {
    display: grid;
  }
}
</style>
