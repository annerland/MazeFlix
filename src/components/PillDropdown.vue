<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Option {
  value: string | number;
  label: string;
}

defineProps<{
  label: string;
  options: Option[];
  modelValue: string | number;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

function selectOption(option: Option) {
  emit('update:modelValue', option.value);
  isOpen.value = false;
}
</script>

<template>
  <div class="relative cursor-pointer" ref="dropdownRef">
    <button
      class="px-4 py-1 rounded-full cursor-pointer font-semibold border border-gray-700 hover:bg-gray-800 focus:outline-none transition-all duration-200 flex items-center gap-2 shadow"
      :class="isOpen ? 'bg-white text-gray-900' : 'text-white'"
      @click="isOpen = !isOpen"
      type="button"
    >
      <span>{{ label }}</span>
      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-if="isOpen"
      class="absolute left-0 mt-2 overflow-y-auto w-40 h-90 bg-background border-gray-700 rounded-lg shadow-lg z-50 py-2"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="block w-full text-left cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all duration-150"
        :class="[
          option.value === modelValue
            ? 'bg-white text-black'
            : 'bg-brimary text-white hover:bg-gray-800',
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
