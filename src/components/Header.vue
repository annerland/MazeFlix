<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SearchBar from './SearchBar.vue';
import { useRouter } from 'vue-router';
import Logo from '../assets/images/logo.png';

const router = useRouter();
const isScrolled = ref(false);
const searchBarRef = ref();

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
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out"
    :class="isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black via-black/50 to-transparent'"
  >
    <div class="container mx-auto px-6 py-4 h-18">
      <div class="flex justify-between items-center">
        <img :src="Logo" alt="MazeFlix" class="h-10 cursor-pointer" @click="redirectToCatalog" />
        <SearchBar ref="searchBarRef" />
      </div>
    </div>
  </header>
</template>
