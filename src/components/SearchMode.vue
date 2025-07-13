<script setup lang="ts">
import { useShowsStore } from '../stores/shows';
import { useLazyLoading } from '../composables/useLazyLoading';
import ShowCard from './ShowCard.vue';
import EmptyState from './EmptyState.vue';
import { useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import type { Show } from '../types/tvmaze';

const router = useRouter();
const showsStore = useShowsStore();

const handleShowClick = (show: Show) => {
  router.push(`/show/${show.id}`);
  showsStore.clearSearch();
};

const searchResults = computed(() => showsStore.filteredSearchResults);

const {
  visibleItems: visibleSearchResults,
  hasMoreItems: hasMoreSearchResults,
  isLoading: isLoadingMoreSearch,
  progressPercentage: searchProgress,
  reset: resetSearchLazyLoading,
} = useLazyLoading(() => searchResults.value, 12, 12, 200);

watch(
  () => showsStore.searchQuery,
  () => {
    resetSearchLazyLoading();
  },
);

watch(
  () => showsStore.isInSearchMode,
  (isSearchMode) => {
    if (!isSearchMode) {
      resetSearchLazyLoading();
    }
  },
);
</script>

<template>
  <div class="mt-32">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Search Results for "{{ showsStore.searchQuery }}"</h2>
      <p class="text-gray-400 mb-6">Found {{ searchResults.length }} shows</p>
    </div>

    <div v-if="visibleSearchResults.length > 0" class="flex flex-wrap gap-2">
      <ShowCard
        v-for="show in visibleSearchResults"
        :key="show.id"
        :show="show"
        @click="handleShowClick"
      />
    </div>

    <div v-if="isLoadingMoreSearch" class="flex justify-center mt-8 mb-8">
      <div class="flex items-center space-x-2 text-white">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        <span>Loading more shows...</span>
      </div>
    </div>

    <div v-if="hasMoreSearchResults" class="flex justify-center mt-4 mb-8">
      <div class="text-sm text-gray-400">
        Showing {{ Math.round(searchProgress) }}% of search results
      </div>
    </div>

    <EmptyState
      v-else-if="searchResults.length === 0"
      message="No shows found matching your search."
    />
  </div>
</template>
