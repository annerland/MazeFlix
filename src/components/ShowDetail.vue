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
  <article class="relative w-full">
    <ShowBanner :image="bannerImage" :show="show" />

    <section class="relative px-6 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section v-if="show.summary" class="mb-6 md:max-w-2xl">
          <h2 class="text-lg font-semibold text-white mb-3">Summary</h2>
          <p class="text-gray-300 leading-relaxed">
            {{ stripHtml(show.summary) }}
          </p>
        </section>

        <section class="text-sm text-gray-200 space-y-2">
          <h2 class="text-lg font-semibold text-white mb-3">Details</h2>
          <dl class="space-y-2">
            <div v-if="show.language">
              <dt class="font-bold text-white inline">Language:</dt>
              <dd class="ml-2 text-gray-400 inline">{{ show.language }}</dd>
            </div>
            <div v-if="show.type">
              <dt class="font-bold text-white inline">Type:</dt>
              <dd class="ml-2 text-gray-400 inline">{{ show.type }}</dd>
            </div>
            <div v-if="show.premiered">
              <dt class="font-bold text-white inline">Premiered:</dt>
              <dd class="ml-2 text-gray-400 inline">{{ show.premiered }}</dd>
            </div>
            <div v-if="show.ended">
              <dt class="font-bold text-white inline">Ended:</dt>
              <dd class="ml-2 text-gray-400 inline">{{ show.ended }}</dd>
            </div>
            <div v-if="show.officialSite">
              <dt class="font-bold text-white inline">Official Site:</dt>
              <dd class="ml-2 inline">
                <a
                  :href="show.officialSite"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  Visit Official Site
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  </article>
</template>
