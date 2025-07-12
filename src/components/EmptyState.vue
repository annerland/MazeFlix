<script setup lang="ts">
type Props = {
  message: string;
};

defineProps<Props>();
</script>

<template>
  <div class="text-center py-8">
    <p class="text-gray-400">{{ message }}</p>
  </div>
</template>
