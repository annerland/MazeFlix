<script setup lang="ts">
type Props = {
  message: string;
};

defineProps<Props>();
</script>
<template>
  <div class="text-center py-8 h-200 flex flex-col items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    <p class="mt-4 text-gray-300">{{ message }}</p>
  </div>
</template>
