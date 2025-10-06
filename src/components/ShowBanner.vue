<script setup lang="ts">
import { type Show } from '../types/tvmaze';
import { ref } from 'vue';
import EmptyStateImage from './EmptyStateImage.vue';

type Props = {
  image: string;
  show: Show;
  showSummary?: boolean;
};

const props = defineProps<Props>();

const isHovered = ref(false);

const emit = defineEmits<{
  showClick: [show: Show];
}>();

const handleClick = () => {
  if (props.showSummary) {
    emit('showClick', props.show);
  }
};
</script>

<template>
  <section
    class="relative w-full min-h-96 md:min-h-200 overflow-hidden mb-8 transition-all duration-500 ease-in-out mt-16 md:mt-0"
    :class="{ 'cursor-pointer': showSummary }"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="banner"
    :aria-label="`Banner for ${show.name}`"
  >
    <div class="absolute inset-0">
      <img
        v-if="show.image"
        :src="image"
        :alt="`${show.name} banner`"
        class="w-full h-full object-cover"
        fetchpriority="high"
        loading="eager"
        decoding="async"
      />
      <EmptyStateImage v-else />

      <div
        class="absolute inset-0 bg-gradient-to-t from-background/100 via-background/30 to-transparent"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-background/100 via-background/10 to-transparent"
      />
      <div
        class="absolute inset-0 bg-gradient-to-l from-background/100 via-background/10 to-transparent"
      />
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
      <div class="max-w-4xl">
        <h1
          class="text-4xl font-bold mb-4 transition-all duration-500"
          :class="{ 'mb-2': isHovered && showSummary && show.summary }"
        >
          {{ show.name }}
        </h1>

        <div
          class="flex items-center gap-4 mb-4 text-sm transition-all duration-500"
          :class="{ 'mb-2': isHovered && showSummary && show.summary }"
        >
          <span
            v-if="show.rating.average"
            class="flex items-center gap-1"
            aria-label="Rating: {{ show.rating.average.toFixed(1) }} stars"
          >
            <span class="text-yellow-500" aria-hidden="true">★</span>
            <span>{{ show.rating.average.toFixed(1) }}</span>
          </span>

          <span v-if="show.premiered">
            {{ new Date(show.premiered).getFullYear() }}
          </span>

          <span v-if="show.runtime">{{ show.runtime }} min</span>

          <span class="px-2 py-1 bg-green-700 text-xs rounded">
            {{ show.status }}
          </span>
        </div>

        <div
          class="flex flex-wrap gap-2 mb-4 transition-all duration-500"
          :class="{ 'mb-2': isHovered && showSummary && show.summary }"
          role="list"
          aria-label="Genres"
        >
          <span
            v-for="genre in show.genres"
            :key="genre"
            class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-xs"
            role="listitem"
          >
            {{ genre }}
          </span>
        </div>

        <div
          v-if="show.summary && showSummary"
          class="overflow-hidden transition-all duration-500 ease-in-out"
          :class="{
            'max-h-0 opacity-0': !isHovered,
            'max-h-32 opacity-100': isHovered,
          }"
        >
          <p
            class="text-sm text-gray-200 max-w-2xl leading-relaxed"
            v-html="show.summary.replace(/<[^>]*>/g, '')"
          ></p>
        </div>
      </div>
    </div>
  </section>
</template>
