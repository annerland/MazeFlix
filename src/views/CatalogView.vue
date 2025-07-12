<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShowsStore } from '../stores/shows';
import { type Show } from '../types/tvmaze';
import GenreRow from '../components/GenreRow.vue';
import ShowCard from '../components/ShowCard.vue';
import Loading from '../components/Loading.vue';
import EmptyState from '../components/EmptyState.vue';
import ShowBanner from '../components/ShowBanner.vue';

const router = useRouter();
const showsStore = useShowsStore();

onMounted(async () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  await showsStore.getShowBanner(randomId);
  await showsStore.getShowById(randomId);
  await showsStore.loadShowsCatalog();
});

const handleShowClick = (show: Show) => {
  router.push(`/show/${show.id}`);
};
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
      <div v-else-if="showsStore.isInSearchMode" class="mt-32">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Search Results for "{{ showsStore.searchQuery }}"</h2>
          <p class="text-gray-400 mb-6">
            Found {{ showsStore.filteredSearchResults.length }} shows
          </p>
        </div>

        <div v-if="showsStore.filteredSearchResults.length > 0" class="flex flex-wrap gap-4">
          <ShowCard
            v-for="show in showsStore.filteredSearchResults"
            :key="show.id"
            :show="show"
            @click="handleShowClick"
          />
        </div>
        <EmptyState v-else message="No shows found matching your search." />
      </div>

      <div v-else>
        <div v-if="showsStore.showsByGenre.length > 0">
          <GenreRow
            v-for="genreSection in showsStore.showsByGenre"
            :key="genreSection.genre"
            :genre="genreSection.genre"
            :shows="genreSection.shows"
            @show-click="handleShowClick"
          />
        </div>

        <EmptyState v-else message="No shows available." />
      </div>
    </main>
  </div>
</template>
