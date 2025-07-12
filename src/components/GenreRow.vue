<script setup lang="ts">
import type { Show } from '../types/tvmaze';
import ShowCard from './ShowCard.vue';
import Carousel from './Carousel.vue';

interface Props {
  genre: string;
  shows: Show[];
}

defineProps<Props>();

const emit = defineEmits<{
  showClick: [show: Show];
}>();

const handleShowClick = (show: Show) => {
  emit('showClick', show);
};
</script>

<template>
  <section class="mb-8">
    <h2 class="text-2xl font-extrabold mb-4 text-white">{{ genre }}</h2>

    <Carousel :items="shows" :items-per-view="6" :gap="8">
      <div v-for="show in shows" :key="show.id">
        <ShowCard :show="show" @click="handleShowClick" />
      </div>
    </Carousel>
  </section>
</template>
