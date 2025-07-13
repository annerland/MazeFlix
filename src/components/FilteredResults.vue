<script setup lang="ts">
import { computed, watch } from 'vue';
import { useShowsStore } from '../stores/shows';
import { useLazyLoading } from '../composables/useLazyLoading';
import ShowCard from './ShowCard.vue';
import EmptyState from './EmptyState.vue';
import { type Show } from '../types/tvmaze';
import { useRouter } from 'vue-router';

const showsStore = useShowsStore();
const router = useRouter();

const handleShowClick = (show: Show) => {
  router.push(`/show/${show.id}`);
};

const filteredShows = computed(() => showsStore.filteredShows);
const totalFilteredShows = computed(() => filteredShows.value.length);

const {
  visibleItems: visibleFilteredShows,
  hasMoreItems: hasMoreFilteredShows,
  isLoading: isLoadingMoreFiltered,
  progressPercentage: filteredProgress,
  reset: resetFilteredLazyLoading,
} = useLazyLoading(() => filteredShows.value, 12, 12, 200);

watch(
  () => [showsStore.selectedGenres, showsStore.minRating, showsStore.selectedType],
  () => {
    resetFilteredLazyLoading();
  },
);

watch(
  () => showsStore.hasActiveFilters,
  (hasFilters) => {
    if (!hasFilters) {
      resetFilteredLazyLoading();
    }
  },
);
</script>

<template>
  <div class="mt-10">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Filtered Results</h2>
      <p class="text-gray-400 mb-6">Found {{ totalFilteredShows }} shows</p>
    </div>

    <div v-if="visibleFilteredShows.length > 0" class="flex flex-wrap gap-2">
      <ShowCard
        v-for="show in visibleFilteredShows"
        :key="show.id"
        :show="show"
        @click="handleShowClick"
      />
    </div>

    <div v-if="isLoadingMoreFiltered" class="flex justify-center mt-8 mb-8">
      <div class="flex items-center space-x-2 text-white">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        <span>Loading more shows...</span>
      </div>
    </div>

    <div v-if="hasMoreFilteredShows" class="flex justify-center mt-4 mb-8">
      <div class="text-sm text-gray-400">
        Showing {{ Math.round(filteredProgress) }}% of filtered results
      </div>
    </div>

    <EmptyState v-else-if="filteredShows.length === 0" message="No shows match your filters." />
  </div>
</template>
