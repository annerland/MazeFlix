<template>
  <div
    class="w-full h-full bg-gradient-to-br from-purple-800 to-purple-900 flex flex-col items-center justify-center p-4 text-center"
  >
    <div class="mb-3 animate-bounce">
      <span class="text-4xl" role="img" aria-label="Camera">📸</span>
    </div>

    <h3 class="text-sm font-bold text-white mb-2">Camera Shy! 🎭</h3>

    <p class="text-xs text-gray-100 leading-relaxed">
      This show went on vacation without its photo passport!
      <span class="block mt-1">Maybe it's exploring the world? 🌍</span>
    </p>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -4px, 0);
  }
  70% {
    transform: translate3d(0, -2px, 0);
  }
  90% {
    transform: translate3d(0, -1px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
