import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { router } from '../setup';
import CatalogView from '../../views/CatalogView.vue';
import { useShowsStore, setTvmazeRepository } from '../../stores/shows';
import { type Show, type ImageResponse } from '../../types/tvmaze';
import type { ITvmazeRepository } from '../../repositories/tvmaze-repository';

const mockTvmazeRepository: ITvmazeRepository = {
  getAllShows: vi.fn(),
  searchShows: vi.fn(),
  getShowById: vi.fn(),
  getShowImages: vi.fn(),
};

describe('CatalogView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setTvmazeRepository(mockTvmazeRepository);
    vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve());
  });

  const createWrapper = () => {
    return mount(CatalogView, {
      global: {
        stubs: {
          Header: true,
          ShowBanner: true,
          Loading: true,
          EmptyState: true,
          GenreRow: true,
          ShowCard: true,
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should show loading state when loading', () => {
      const store = useShowsStore();
      store.loading = true;
      store.error = 'Loading shows...';
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
    });

    it('should show banner when not in search mode and has show data', () => {
      const store = useShowsStore();
      store.loading = false;
      store.show = { id: 1, name: 'Breaking Bad', genres: ['Drama'] } as Show;
      store.showBanner = {
        type: 'background',
        resolutions: { original: { url: 'test.jpg', width: 1920, height: 1080 } },
      } as ImageResponse;
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowBanner' }).exists()).toBe(true);
    });

    it('should not show banner in search mode', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = 'breaking';
      store.show = { id: 1, name: 'Breaking Bad', genres: ['Drama'] } as Show;
      store.showBanner = {
        type: 'background',
        resolutions: { original: { url: 'test.jpg', width: 1920, height: 1080 } },
      } as ImageResponse;
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowBanner' }).exists()).toBe(false);
    });
  });

  describe('Search Mode', () => {
    it('should show search results when in search mode', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = 'breaking';
      store.searchResults = [
        { id: 1, name: 'Breaking Bad', genres: ['Drama'] } as Show,
        { id: 2, name: 'Friends', genres: ['Comedy'] } as Show,
      ];
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('Search Results for "breaking"');
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(true);
    });

    it('should show empty state when no search results', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = 'nonexistent';
      store.searchResults = [];
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true);
    });
  });

  describe('Catalog Mode', () => {
    it('should show genre rows when not in search mode', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = '';
      store.allShows = [
        { id: 1, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9.5 } } as Show,
        { id: 2, name: 'Friends', genres: ['Comedy'], rating: { average: 8.9 } } as Show,
      ];
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(true);
    });

    it('should show empty state when no shows available', () => {
      const store = useShowsStore();
      store.loading = false;
      store.allShows = [];
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true);
    });
  });

  describe('Conditional Rendering', () => {
    it('should not show main content when loading', () => {
      const store = useShowsStore();
      store.loading = true;
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(false);
    });

    it('should show search results when in search mode', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = 'test';
      store.searchResults = [{ id: 1, name: 'Test Show', genres: ['Drama'] } as Show];
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(false);
    });

    it('should show genre rows when not in search mode', () => {
      const store = useShowsStore();
      store.loading = false;
      store.searchQuery = '';
      store.allShows = [{ id: 1, name: 'Test Show', genres: ['Drama'] } as Show];
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(false);
    });
  });
});
