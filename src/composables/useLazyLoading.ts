import { ref, computed, onMounted, onUnmounted, readonly, watch } from 'vue';

export function useLazyLoading<T>(
  items: T[] | (() => T[]),
  initialCount: number = 4,
  loadMoreCount: number = 4,
  threshold: number = 100,
) {
  const visibleCount = ref(initialCount);
  const isLoading = ref(false);

  const itemsArray = computed(() => {
    return typeof items === 'function' ? items() : items;
  });

  const visibleItems = computed(() => {
    return itemsArray.value.slice(0, visibleCount.value);
  });

  const hasMoreItems = computed(() => {
    return visibleCount.value < itemsArray.value.length;
  });

  const progressPercentage = computed(() => {
    if (itemsArray.value.length === 0) return 0;
    return Math.min((visibleCount.value / itemsArray.value.length) * 100, 100);
  });

  const loadMore = () => {
    if (isLoading.value || !hasMoreItems.value) return;

    isLoading.value = true;

    setTimeout(() => {
      visibleCount.value += loadMoreCount;
      isLoading.value = false;
    }, 150);
  };

  const handleScroll = () => {
    if (isLoading.value || !hasMoreItems.value) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - threshold) {
      loadMore();
    }
  };

  const reset = () => {
    visibleCount.value = initialCount;
    isLoading.value = false;
  };

  watch(itemsArray, (newItems, oldItems) => {
    if (oldItems && Math.abs(newItems.length - oldItems.length) > 5) {
      reset();
    }
  });

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    visibleItems,
    hasMoreItems,
    isLoading,
    progressPercentage,
    loadMore,
    reset,
    visibleCount: readonly(visibleCount),
    totalCount: computed(() => itemsArray.value.length),
  };
}
