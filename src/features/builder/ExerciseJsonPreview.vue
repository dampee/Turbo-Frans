<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "../../shared/components/AppButton.vue";

const props = defineProps<{
  title: string;
  value: unknown;
}>();

const copied = ref(false);
const output = computed(() => JSON.stringify(props.value, null, 2));

async function copy(): Promise<void> {
  copied.value = false;
  if (!navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(output.value);
  copied.value = true;
}
</script>

<template>
  <section class="json-preview">
    <div class="preview-header">
      <h3>{{ title }}</h3>
      <AppButton variant="ghost" @click="copy">{{ copied ? "Gekopieerd" : "Kopieer" }}</AppButton>
    </div>
    <pre><code>{{ output }}</code></pre>
  </section>
</template>

<style scoped>
.json-preview {
  display: grid;
  gap: 10px;
}

.preview-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

h3 {
  color: #0f172a;
  margin: 0;
}

pre {
  background: #0f172a;
  border-radius: 8px;
  color: #e2e8f0;
  margin: 0;
  max-height: 420px;
  overflow: auto;
  padding: 16px;
  text-align: left;
}

code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  white-space: pre;
}
</style>
