<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useShowsStore } from '../stores/shows';
import { type Show } from '../types/tvmaze';
import ShowDetail from '../components/ShowDetail.vue';
import Loading from '../components/Loading.vue';
import NotFound from '../components/NotFound.vue';
import SearchMode from '../components/SearchMode.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const showsStore = useShowsStore();

const show = ref<Show | null>(null);
const bannerImage = ref<string | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchShow = async () => {
  try {
    loading.value = true;
    error.value = null;

    const showId = parseInt(props.id);
    const showData = await showsStore.getShowById(showId);
    await showsStore.getShowBanner(showId);

    if (showData) {
      show.value = showData;
      bannerImage.value = showsStore.showBanner?.resolutions?.original?.url ?? null;
    } else {
      error.value = 'Show not found';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load show details';
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.id,
  () => {
    fetchShow();
  },
);

onMounted(() => {
  fetchShow();
});
</script>

<template>
  <div class="min-h-screen text-white">
    <main class="w-full">
      <Loading v-if="loading" message="Loading show details..." />
      <SearchMode v-else-if="showsStore.isInSearchMode" />
      <ShowDetail v-else-if="show" :show="show" :banner-image="bannerImage ?? ''" />
      <NotFound v-else-if="error" :error="error ?? 'Show not found'" />
    </main>
  </div>
</template>
