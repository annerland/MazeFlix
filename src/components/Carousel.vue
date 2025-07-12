<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ArrowLeft from '../assets/icons/ArrowLeft.vue';
import ArrowRight from '../assets/icons/ArrowRight.vue';

interface Props<T = unknown> {
  items: T[];
  itemsPerView?: number;
  gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerView: 6,
  gap: 16,
});

const currentIndex = ref(0);
const containerRef = ref<HTMLDivElement>();
const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.screen.availWidth < 768;
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
});

const responsiveItemsPerView = computed(() => {
  return isMobile.value ? 2.5 : props.itemsPerView;
});

const totalPages = computed(() => {
  return Math.ceil(props.items.length / responsiveItemsPerView.value);
});

const canGoPrevious = computed(() => currentIndex.value > 0);

const canGoNext = computed(() => currentIndex.value < totalPages.value - 1);

const goPrevious = () => {
  if (canGoPrevious.value) {
    currentIndex.value--;
  }
};

const goNext = () => {
  if (canGoNext.value) {
    currentIndex.value++;
  }
};

const translateX = computed(() => {
  const itemWidth = isMobile.value ? 128 : 208;
  const totalItemWidth = itemWidth + props.gap;
  const itemsToMove = isMobile.value ? 1 : responsiveItemsPerView.value;
  const translation = currentIndex.value * itemsToMove * totalItemWidth;
  return `-${translation}px`;
});

const transitionDuration = computed(() => {
  return isMobile.value ? '700ms' : '500ms';
});
</script>

<template>
  <div class="relative overflow-hidden">
    <div v-if="totalPages > 1 && !isMobile" class="flex justify-end mb-4 gap-[1px]">
      <button
        v-for="page in totalPages"
        :key="page"
        class="w-3 h-[2px] rounded transition-all duration-300"
        :class="page - 1 === currentIndex ? 'bg-gray-500' : 'bg-gray-800'"
      />
    </div>

    <div
      ref="containerRef"
      class="flex gap-4 transition-transform ease-in-out"
      :style="{
        transform: `translateX(${translateX})`,
        gap: `${gap}px`,
        transitionDuration: transitionDuration,
      }"
    >
      <slot />
    </div>

    <button
      v-if="canGoPrevious"
      @click="goPrevious"
      class="absolute cursor-pointer -translate-y-5 flex items-center justify-center transition-all duration-300 ease-in-out z-10"
      :class="
        isMobile
          ? 'left-[-2px] bottom-12 w-8 h-8 bg-black/70 rounded-full'
          : 'left-2 -translate-x-4 w-12 h-[95%] bg-gradient-to-r from-black to-transparent top-9'
      "
    >
      <ArrowLeft
        class="text-white transition-all duration-300 ease-in-out hover:scale-120"
        :class="isMobile ? 'w-4 h-4' : 'w-12 h-12'"
      />
    </button>

    <button
      v-if="canGoNext"
      @click="goNext"
      class="absolute cursor-pointer -translate-y-5 flex items-center justify-center transition-all duration-300 ease-in-out z-10"
      :class="
        isMobile
          ? 'right-[-2px] w-8 h-8 bg-black/90 bottom-12 rounded-full'
          : 'right-2 translate-x-4 top-9 w-12 h-[95%] bg-gradient-to-l from-black to-transparent'
      "
    >
      <ArrowRight
        class="text-white transition-all duration-300 ease-in-out hover:scale-120"
        :class="isMobile ? 'w-4 h-4' : 'w-12 h-12'"
      />
    </button>
  </div>
</template>
