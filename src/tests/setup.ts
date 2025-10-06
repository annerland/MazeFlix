import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const pinia = createPinia();
setActivePinia(pinia);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/show/:id', component: { template: '<div>Show Detail</div>' } },
  ],
});

config.global.plugins = [pinia, router];

config.global.stubs = {
  'router-link': true,
  'router-view': true,
};

if (typeof global !== 'undefined') {
  global.fetch = vi.fn();

  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
  };

  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
} else {
  Object.defineProperty(window, 'fetch', {
    value: vi.fn(),
    writable: true,
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'ResizeObserver', {
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
    writable: true,
    configurable: true,
  });
}

export { pinia, router };
