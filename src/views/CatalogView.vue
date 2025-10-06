<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useShowsStore } from '../stores/shows';
import { type Show } from '../types/tvmaze';
import { useLazyLoading } from '../composables/useLazyLoading';
import GenreRow from '../components/GenreRow.vue';
import Loading from '../components/Loading.vue';
import EmptyState from '../components/EmptyState.vue';
import ShowBanner from '../components/ShowBanner.vue';
import SearchMode from '../components/SearchMode.vue';
import ShowFilter from '../components/ShowFilter.vue';
import FilteredResults from '../components/FilteredResults.vue';

const router = useRouter();
const showsStore = useShowsStore();

const {
  visibleItems: visibleGenres,
  hasMoreItems: hasMoreGenres,
  isLoading: isLoadingMore,
  progressPercentage,
  reset: resetLazyLoading,
} = useLazyLoading(() => showsStore.showsByGenre, 4, 4, 200);

onMounted(async () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  await showsStore.getShowBanner(randomId);
  await showsStore.getShowById(randomId);
  await showsStore.loadShowsCatalog();

  if (showsStore.showBanner?.resolutions?.original?.url) {
    const preloadLink = document.getElementById('lcp-preload') as HTMLLinkElement;
    if (preloadLink) {
      preloadLink.href = showsStore.showBanner.resolutions.original.url;
    }
  }
});

const handleShowClick = (show: Show) => {
  router.push(`/show/${show.id}`);
};

watch(
  () => [showsStore.isInSearchMode, showsStore.hasActiveFilters],
  ([isSearchMode, hasFilters]) => {
    if (!isSearchMode && !hasFilters) {
      resetLazyLoading();
    }
  },
);

watch(
  () => showsStore.showBanner?.resolutions?.original?.url,
  (newBannerUrl) => {
    if (newBannerUrl) {
      const preloadLink = document.getElementById('lcp-preload') as HTMLLinkElement;
      if (preloadLink) {
        preloadLink.href = newBannerUrl;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="w-full h-full">
    <ShowBanner
      v-if="
        !showsStore.loading &&
        showsStore.showBanner &&
        showsStore.show &&
        !showsStore.isInSearchMode
      "
      :image="showsStore.showBanner.resolutions.original.url"
      :show="showsStore.show"
      @show-click="handleShowClick"
      show-summary
    />

    <main>
      <Loading v-if="showsStore.loading" :message="showsStore.error ?? 'Loading shows...'" />
      <SearchMode v-if="showsStore.isInSearchMode" />
      <ShowFilter v-if="!showsStore.isInSearchMode" />
      <FilteredResults v-if="showsStore.hasActiveFilters && !showsStore.isInSearchMode" />

      <section v-else-if="!showsStore.isInSearchMode">
        <section v-if="showsStore.showsByGenre.length > 0">
          <GenreRow
            v-for="genreSection in visibleGenres"
            :key="genreSection.genre"
            :genre="genreSection.genre"
            :shows="genreSection.shows"
            @show-click="handleShowClick"
          />

          <section v-if="isLoadingMore" class="flex justify-center mt-8 mb-8" aria-live="polite">
            <div class="flex items-center space-x-2 text-white">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span>Loading more shows...</span>
            </div>
          </section>

          <aside v-if="hasMoreGenres" class="flex justify-center mt-4 mb-8">
            <div class="text-sm text-gray-400">
              Showing {{ Math.round(progressPercentage) }}% of genres
            </div>
          </aside>
        </section>
        <EmptyState v-else message="No shows available." />
      </section>
    </main>
  </div>
</template>
