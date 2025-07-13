<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useShowsStore } from '../stores/shows';
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
  showsStore.setSelectedType(type);
  if (type === 'all') {
    selectedGenre.value = '_all';
    selectedRating.value = 0;
    showsStore.clearFilters();
  }
});
</script>

<template>
  <div class="mb-6 flex flex-col gap-4">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-semibold text-lg text-white mr-2">Type</span>
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
      >
        {{ option.label }}
      </button>

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
    </div>
  </div>
</template>
