<script setup lang="ts">
type Props = {
  message: string;
};

defineProps<Props>();
</script>
<template>
  <section
    class="text-center py-8 h-200 flex flex-col items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
      aria-hidden="true"
    ></div>
    <p class="mt-4 text-gray-300">{{ message }}</p>
  </section>
</template>
