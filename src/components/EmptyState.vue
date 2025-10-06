<script setup lang="ts">
type Props = {
  message: string;
};

defineProps<Props>();
</script>

<template>
  <section class="text-center py-8" role="status" aria-live="polite">
    <p class="text-gray-400">{{ message }}</p>
  </section>
</template>
