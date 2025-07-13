<script setup lang="ts">
import { ref, watch } from 'vue';
import { useShowsStore } from '../stores/shows';
import { debounce } from '../utils/debounce';
import Search from '../assets/icons/Search.vue';
import Close from '../assets/icons/Close.vue';

const showsStore = useShowsStore();
const searchQuery = ref('');
const isSearching = ref(false);
const isExpanded = ref(false);
const searchInput = ref<HTMLInputElement>();

const debouncedSearch = debounce(async (query: string) => {
  if (query.trim()) {
    isSearching.value = true;
    await showsStore.searchShows(query);
    isSearching.value = false;
  } else {
    showsStore.clearSearch();
  }
}, 500);

const handleSearch = (query: string) => {
  debouncedSearch(query);
};

watch(searchQuery, (newQuery) => {
  handleSearch(newQuery);
});

const expandSearch = async () => {
  isExpanded.value = true;
  searchInput.value?.focus();
};

const collapseSearch = () => {
  if (!searchQuery.value) {
    isExpanded.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  showsStore.clearSearch();
  isExpanded.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (searchQuery.value) {
      clearSearch();
    } else {
      isExpanded.value = false;
    }
  }
};

defineExpose({ clearSearch });
</script>

<template>
  <div class="relative">
    <div
      class="relative flex items-center transition-all duration-300 ease-in-out"
      :class="isExpanded ? 'w-60 md:w-80' : 'w-10'"
    >
      <button
        v-if="!isExpanded"
        @click="expandSearch"
        class="flex items-center justify-center cursor-pointer w-10 h-10 hover:scale-120 transition-all duration-200 text-gray-300 hover:text-white"
        title="Search"
      >
        <Search class="w-6 h-6" />
      </button>

      <div v-show="isExpanded" class="relative flex-1 flex items-center">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Search TV shows..."
          @blur="collapseSearch"
          @keydown="handleKeydown"
          class="w-full text-white pl-10 pr-12 py-2 rounded bg-black border border-gray-700 transition-all duration-300 ease-in-out focus:border-primary focus:outline-none"
        />

        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search class="w-5 h-5 text-gray-400" />
        </div>

        <div class="absolute right-3 top-6 transform -translate-y-3">
          <div v-if="isSearching" class="animate-spin rounded h-4 w-4 border-b-2 border-primary" />
          <button
            v-else-if="searchQuery"
            @click="clearSearch"
            class="text-gray-400 hover:text-white transition-colors duration-200"
            title="Clear search"
          >
            <Close class="w-5 h-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
