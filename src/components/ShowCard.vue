<script setup lang="ts">
import type { Show } from '../types/tvmaze';
import EmptyStateImage from './EmptyStateImage.vue';

interface Props {
  show: Show;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [show: Show];
}>();

const handleClick = () => {
  emit('click', props.show);
};

const formatRating = (rating: number | null): string => {
  return rating?.toFixed(1) ?? 'N/A';
};
</script>

<template>
  <div
    class="relative h-auto md:h-72 w-32 md:w-52 rounded overflow-hidden shadow-lg hover:shadow-xl hover:shadow-inner transition-all duration-300 cursor-pointer group"
    @click="handleClick"
  >
    <img
      v-if="show.image?.medium"
      :src="show.image?.medium"
      :alt="show.name"
      class="object-cover"
    />

    <EmptyStateImage v-else />

    <div
      v-if="show.rating?.average"
      class="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 text-white text-sm font-semibold z-10"
    >
      <span class="text-yellow-500">★</span>
      <span>{{ formatRating(show.rating.average) }}</span>
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />

    <div
      class="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <div class="flex flex-wrap gap-1 mb-2">
        <span
          v-for="genre in show.genres.slice(0, 3)"
          :key="genre"
          class="px-2 bg-primary text-xs rounded text-white font-semibold"
        >
          {{ genre }}
        </span>
      </div>
    </div>
  </div>
</template>
