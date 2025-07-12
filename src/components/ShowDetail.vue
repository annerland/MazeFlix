<script setup lang="ts">
import type { Show } from '../types/tvmaze';
import ShowBanner from './ShowBanner.vue';

interface Props {
  show: Show;
  bannerImage: string;
}

defineProps<Props>();

const stripHtml = (html: string | null): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};
</script>

<template>
  <div class="relative w-full">
    <ShowBanner :image="bannerImage" :show="show" />

    <div class="relative px-6 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div v-if="show.summary" class="mb-6 md:max-w-2xl">
          <h3 class="text-lg font-semibold text-white mb-3">Summary</h3>
          <p class="text-gray-300 leading-relaxed">
            {{ stripHtml(show.summary) }}
          </p>
        </div>

        <div class="text-sm text-gray-200 space-y-2">
          <div v-if="show.language">
            <span class="font-bold text-white">Language:</span>
            <span class="ml-2 text-gray-400">{{ show.language }}</span>
          </div>
          <div v-if="show.type">
            <span class="font-bold text-white">Type:</span>
            <span class="ml-2 text-gray-400">{{ show.type }}</span>
          </div>
          <div v-if="show.premiered">
            <span class="font-bold text-white">Premiered:</span>
            <span class="ml-2 text-gray-400">{{ show.premiered }}</span>
          </div>
          <div v-if="show.ended">
            <span class="font-bold text-white">Ended:</span>
            <span class="ml-2 text-gray-400">{{ show.ended }}</span>
          </div>
          <div v-if="show.officialSite">
            <span class="font-bold text-white">Official Site:</span>
            <a
              :href="show.officialSite"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-2 text-primary hover:underline"
            >
              Visit Official Site
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
