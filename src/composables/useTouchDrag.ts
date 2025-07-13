import { ref } from 'vue';
import type { Ref } from 'vue';

interface UseTouchDragOptions {
  isMobile: Ref<boolean>;
  currentIndex: Ref<number>;
  canGoPrevious: Ref<boolean>;
  canGoNext: Ref<boolean>;
  goPrevious: () => void;
  goNext: () => void;
  translateX: Ref<string>;
  transitionDuration: Ref<string>;
  containerRef: Ref<HTMLDivElement | undefined>;
  itemWidth: number;
  gap: number;
}

export function useTouchDrag({
  isMobile,
  currentIndex,
  canGoPrevious,
  canGoNext,
  goPrevious,
  goNext,
  translateX,
  transitionDuration,
  containerRef,
  itemWidth,
  gap,
}: UseTouchDragOptions) {
  const isDragging = ref(false);
  const startX = ref(0);
  const currentX = ref(0);
  const dragDistance = ref(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile.value) return;

    isDragging.value = true;
    startX.value = e.touches[0].clientX;
    currentX.value = startX.value;
    dragDistance.value = 0;

    if (containerRef.value) {
      containerRef.value.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile.value || !isDragging.value) return;

    currentX.value = e.touches[0].clientX;
    dragDistance.value = currentX.value - startX.value;

    if (containerRef.value) {
      const totalItemWidth = itemWidth + gap;
      const baseTranslation = currentIndex.value * totalItemWidth;
      const dragTranslation = baseTranslation - dragDistance.value;
      containerRef.value.style.transform = `translateX(-${Math.max(0, dragTranslation)}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile.value || !isDragging.value) return;

    isDragging.value = false;

    if (containerRef.value) {
      containerRef.value.style.transition = transitionDuration.value;
    }

    const threshold = 30;

    if (Math.abs(dragDistance.value) > threshold) {
      if (dragDistance.value > 0 && canGoPrevious.value) {
        goPrevious();
      } else if (dragDistance.value < 0 && canGoNext.value) {
        goNext();
      } else {
        containerRef.value!.style.transform = `translateX(${translateX.value})`;
      }
    } else {
      containerRef.value!.style.transform = `translateX(${translateX.value})`;
    }
  };

  return {
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
