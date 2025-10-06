<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useShowsStore, ShowType } from '../stores/shows';
import PillDropdown from './PillDropdown.vue';

const showsStore = useShowsStore();

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV shows' },
];
const selectedType = ref('all');

const availableGenres = computed(() =>
  showsStore.availableGenres.map((g) => ({ value: g, label: g })),
);
const selectedGenre = ref('_all');

const ratingOptions = [
  { value: 0, label: 'Any rating' },
  { value: 1, label: '1+ Stars' },
  { value: 2, label: '2+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 5, label: '5+ Stars' },
  { value: 6, label: '6+ Stars' },
  { value: 7, label: '7+ Stars' },
  { value: 8, label: '8+ Stars' },
  { value: 9, label: '9+ Stars' },
];
const selectedRating = ref(0);

watch(selectedGenre, (genre) => {
  showsStore.setSelectedGenres(genre && genre !== '_all' ? [genre] : []);
});
watch(selectedRating, (rating) => {
  showsStore.setMinRating(rating);
});
watch(selectedType, (type) => {
  showsStore.setSelectedType(type as ShowType);
  if (type === 'all') {
    selectedGenre.value = '_all';
    selectedRating.value = 0;
    showsStore.clearFilters();
  }
});
</script>

<template>
  <form class="mb-6 flex flex-col gap-4">
    <fieldset class="flex items-center gap-2 flex-wrap">
      <legend class="font-semibold text-lg text-white mr-2">Type</legend>
      <div class="flex gap-2 flex-wrap" role="radiogroup" aria-label="Show type selection">
        <button
          v-for="option in typeOptions"
          :key="option.value"
          @click="selectedType = option.value"
          class="px-4 py-1 rounded-full cursor-pointer font-semibold focus:outline-none transition-all duration-200"
          :class="[
            selectedType === option.value
              ? 'bg-white text-black shadow'
              : 'bg-transparent text-white hover:bg-gray-800',
            'border border-gray-700',
          ]"
          type="button"
          :aria-pressed="selectedType === option.value"
          :aria-label="`Select ${option.label}`"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <PillDropdown
          label="Category"
          :options="[{ value: '_all', label: 'All' }, ...availableGenres]"
          v-model="selectedGenre"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <PillDropdown label="Rating" :options="ratingOptions" v-model="selectedRating" />
      </div>
    </fieldset>
  </form>
</template>
