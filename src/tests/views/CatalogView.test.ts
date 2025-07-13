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

const createMockShows = (count: number = 8) => {
  const shows: Show[] = [];
  const genres = [
    'Drama',
    'Comedy',
    'Action',
    'Thriller',
    'Romance',
    'Sci-Fi',
    'Horror',
    'Documentary',
  ];

  for (let i = 1; i <= count; i++) {
    shows.push({
      id: i,
      name: `Show ${i}`,
      genres: [genres[i - 1]],
      rating: { average: 9.5 - i * 0.2 },
    } as Show);
  }

  return shows;
};

const createMockShow = (
  id: number = 1,
  name: string = 'Test Show',
  genres: string[] = ['Drama'],
): Show =>
  ({
    id,
    name,
    genres,
    rating: { average: 8.5 },
  }) as Show;

const createMockBanner = (): ImageResponse =>
  ({
    type: 'background',
    resolutions: { original: { url: 'test.jpg', width: 1920, height: 1080 } },
  }) as ImageResponse;

const setupStore = (
  options: {
    loading?: boolean;
    searchQuery?: string;
    searchResults?: Show[];
    allShows?: Show[];
    show?: Show;
    showBanner?: ImageResponse;
    selectedGenres?: string[];
    error?: string;
  } = {},
) => {
  const store = useShowsStore();

  store.loading = options.loading ?? false;
  store.searchQuery = options.searchQuery ?? '';
  store.searchResults = options.searchResults ?? [];
  store.allShows = options.allShows ?? [];
  store.show = options.show ?? null;
  store.showBanner = options.showBanner ?? null;
  store.selectedGenres = options.selectedGenres ?? [];
  store.error = options.error ?? null;

  return store;
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
      setupStore({ loading: true, error: 'Loading shows...' });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
    });

    it('should show banner when not in search mode and has show data', () => {
      setupStore({
        show: createMockShow(),
        showBanner: createMockBanner(),
      });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowBanner' }).exists()).toBe(true);
    });

    it('should not show banner in search mode', () => {
      setupStore({
        searchQuery: 'breaking',
        show: createMockShow(),
        showBanner: createMockBanner(),
      });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowBanner' }).exists()).toBe(false);
    });
  });

  describe('Search Mode', () => {
    it('should show search results when in search mode', () => {
      setupStore({
        searchQuery: 'breaking',
        searchResults: [
          createMockShow(1, 'Breaking Bad'),
          createMockShow(2, 'Friends', ['Comedy']),
        ],
      });
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('Search Results for "breaking"');
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(true);
    });

    it('should show empty state when no search results', () => {
      setupStore({
        searchQuery: 'nonexistent',
        searchResults: [],
      });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true);
    });
  });

  describe('Catalog Mode - Lazy Loading', () => {
    it('should show initial 4 genres when not in search mode', () => {
      setupStore({ allShows: createMockShows(8) });
      const wrapper = createWrapper();

      const genreRows = wrapper.findAllComponents({ name: 'GenreRow' });
      expect(genreRows).toHaveLength(4);
    });

    it('should show loading indicator when loading more genres', async () => {
      setupStore({ allShows: createMockShows(8) });
      const wrapper = createWrapper();

      const genreRows = wrapper.findAllComponents({ name: 'GenreRow' });
      expect(genreRows).toHaveLength(4);

      expect(wrapper.text()).toContain('Showing');
      expect(wrapper.text()).toContain('% of genres');
    });

    it('should show progress percentage correctly', () => {
      setupStore({ allShows: createMockShows(8) });
      const wrapper = createWrapper();

      expect(wrapper.text()).toContain('50% of genres');
    });

    it('should not show progress indicator when all genres are visible', () => {
      setupStore({ allShows: createMockShows(3) });
      const wrapper = createWrapper();

      const genreRows = wrapper.findAllComponents({ name: 'GenreRow' });
      expect(genreRows).toHaveLength(3);

      expect(wrapper.text()).not.toContain('Showing');
      expect(wrapper.text()).not.toContain('% of genres');
    });

    it('should show empty state when no shows available', () => {
      setupStore({ allShows: [] });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true);
    });
  });

  describe('Lazy Loading Reset Behavior', () => {
    it('should reset lazy loading when switching from search mode to catalog', async () => {
      const store = setupStore({ allShows: createMockShows(8) });
      const wrapper = createWrapper();

      store.searchQuery = 'test';
      await wrapper.vm.$nextTick();

      store.searchQuery = '';
      await wrapper.vm.$nextTick();

      const genreRows = wrapper.findAllComponents({ name: 'GenreRow' });
      expect(genreRows).toHaveLength(4);
    });

    it('should reset lazy loading when switching from filtered results to catalog', async () => {
      const store = setupStore({ allShows: createMockShows(8) });
      const wrapper = createWrapper();

      store.selectedGenres = ['Drama'];
      await wrapper.vm.$nextTick();

      store.selectedGenres = [];
      await wrapper.vm.$nextTick();

      const genreRows = wrapper.findAllComponents({ name: 'GenreRow' });
      expect(genreRows).toHaveLength(4);
    });
  });

  describe('Conditional Rendering', () => {
    it('should not show main content when loading', () => {
      setupStore({ loading: true });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(false);
    });

    it('should show search results when in search mode', () => {
      setupStore({
        searchQuery: 'test',
        searchResults: [createMockShow(1, 'Test Show')],
      });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(false);
    });

    it('should show genre rows when not in search mode', () => {
      setupStore({ allShows: [createMockShow()] });
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'GenreRow' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ShowCard' }).exists()).toBe(false);
    });
  });
});
