<script setup lang="ts">
import { useRouter } from 'vue-router';

type Props = {
  error: string;
};

defineProps<Props>();

const router = useRouter();
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen md:min-h-200 flex items-center justify-center px-4">
    <div class="text-center max-w-md mx-auto">
      <div class="mb-8">
        <div class="text-9xl font-bold text-gray-100 mb-4">404</div>
        <div class="text-6xl mb-2">🎬</div>
        <div class="text-4xl mb-4">🎭</div>
        <div class="text-2xl">🎪</div>
      </div>

      <h1 class="text-3xl font-bold text-white mb-4">Oops! Show's Over</h1>
      <p class="text-gray-300 text-lg mb-6">
        {{ error }}
      </p>

      <p class="text-gray-400 mb-8 text-sm">
        Looks like this show has left the stage! 🎭<br />
        Don't worry, there are plenty more amazing shows waiting for you.
      </p>

      <div class="space-y-4">
        <button
          @click="goBack"
          class="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded cursor-pointer"
        >
          🏠 Back to Catalog
        </button>
      </div>
    </div>
  </div>
</template>
