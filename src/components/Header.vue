<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SearchBar from './SearchBar.vue';
import { useRouter } from 'vue-router';
import Logo from '../assets/images/logo.png';
import { useMobileDetection } from '../composables/useMobileDetection';

const router = useRouter();
const isScrolled = ref<boolean>(false);
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null);
const { isMobile } = useMobileDetection();

const handleScroll = () => {
  const scrollTop = window.scrollY;
  isScrolled.value = scrollTop > 50;
};

const redirectToCatalog = () => {
  router.push('/');
  searchBarRef.value?.clearSearch();
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    class="fixed transition-all duration-300 ease-in-out top-0 left-0 right-0 z-50"
    :class="[
      isScrolled || isMobile
        ? 'bg-background'
        : 'bg-gradient-to-b from-background via-background/50 to-transparent',
    ]"
  >
    <div class="container mx-auto px-6 py-4 h-18">
      <div class="flex justify-between items-center">
        <img
          v-if="!isMobile"
          :src="Logo"
          alt="MazeFlix"
          class="h-10 cursor-pointer"
          @click="redirectToCatalog"
        />
        <div v-else>
          <span @click="redirectToCatalog" class="text-xl font-bold">For you</span>
        </div>
        <SearchBar ref="searchBarRef" />
      </div>
    </div>
  </header>
</template>
