import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { router } from '../setup';
import ShowDetailView from '../../views/ShowDetailView.vue';
import { useShowsStore, setTvmazeRepository } from '../../stores/shows';
import { type Show, type ImageResponse, ImageType } from '../../types/tvmaze';
import type { ITvmazeRepository } from '../../repositories/tvmaze-repository';

const mockTvmazeRepository: ITvmazeRepository = {
  getAllShows: vi.fn(),
  searchShows: vi.fn(),
  getShowById: vi.fn(),
  getShowImages: vi.fn(),
};

describe('ShowDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setTvmazeRepository(mockTvmazeRepository);
    vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve());
  });

  const createWrapper = (props = { id: '1' }) => {
    return mount(ShowDetailView, {
      props,
      global: {
        stubs: {
          Header: true,
          ShowDetail: true,
          Loading: true,
          NotFound: true,
        },
      },
    });
  };

  const mockShow: Show = {
    id: 1,
    url: 'https://api.tvmaze.com/shows/1',
    name: 'Breaking Bad',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Crime'],
    status: 'Ended',
    runtime: 45,
    averageRuntime: 45,
    premiered: '2008-01-20',
    ended: '2013-09-29',
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    rating: { average: 9.5 },
    image: { medium: 'test-medium.jpg', original: 'test-original.jpg' },
    summary:
      "<p>A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future as he battles terminal lung cancer.</p>",
    updated: 1640995200,
  };

  const mockBannerImage: ImageResponse = {
    id: 1,
    type: ImageType.BACKGROUND,
    main: false,
    resolutions: {
      original: { url: 'test-banner.jpg', width: 1920, height: 1080 },
      medium: { url: 'test-banner-medium.jpg', width: 960, height: 540 },
    },
  };

  describe('Component Rendering', () => {
    it('should show loading state initially', () => {
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
    });

    it('should show show detail when data is loaded', async () => {
      const store = useShowsStore();

      vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      vi.spyOn(store, 'getShowBanner').mockResolvedValue([mockBannerImage]);

      const wrapper = createWrapper();
      await flushPromises();

      expect(wrapper.findComponent({ name: 'ShowDetail' }).exists()).toBe(true);
    });

    it('should show not found when show does not exist', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockResolvedValue(null);
      vi.spyOn(store, 'getShowBanner').mockResolvedValue([]);

      const wrapper = createWrapper({ id: '999' });
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
    });
  });

  describe('Data Loading', () => {
    it('should load show data on mount', async () => {
      const store = useShowsStore();
      const getShowByIdSpy = vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      const getShowBannerSpy = vi
        .spyOn(store, 'getShowBanner')
        .mockResolvedValue([mockBannerImage]);

      createWrapper({ id: '123' });
      await flushPromises();

      expect(getShowByIdSpy).toHaveBeenCalledWith(123);
      expect(getShowBannerSpy).toHaveBeenCalledWith(123);
    });

    it('should handle invalid show ID', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockResolvedValue(null);
      vi.spyOn(store, 'getShowBanner').mockResolvedValue([]);

      const wrapper = createWrapper({ id: 'luke-i-am-your-father' });
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
    });

    it('should handle network errors gracefully', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockRejectedValue(new Error('Network error'));

      const wrapper = createWrapper({ id: '1' });
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should show error when show loading fails', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockRejectedValue(new Error('Failed to load show'));

      const wrapper = createWrapper({ id: '1' });
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
    });

    it('should show error when banner loading fails', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      vi.spyOn(store, 'getShowBanner').mockRejectedValue(new Error('Failed to load banner'));

      const wrapper = createWrapper({ id: '1' });
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should use provided show ID from props', () => {
      const wrapper = createWrapper({ id: '456' });
      expect(wrapper.props('id')).toBe('456');
    });

    it('should handle different show IDs', async () => {
      const store = useShowsStore();
      const getShowByIdSpy = vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);

      createWrapper({ id: '789' });
      await flushPromises();

      expect(getShowByIdSpy).toHaveBeenCalledWith(789);
    });
  });

  describe('Conditional Rendering', () => {
    it('should not show main content when loading', () => {
      const wrapper = createWrapper();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ShowDetail' }).exists()).toBe(false);
      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(false);
    });

    it('should show show detail when data is available', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      vi.spyOn(store, 'getShowBanner').mockResolvedValue([mockBannerImage]);

      const wrapper = createWrapper();
      await flushPromises();

      expect(wrapper.findComponent({ name: 'ShowDetail' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(false);
    });

    it('should show not found when show is null', async () => {
      const store = useShowsStore();
      vi.spyOn(store, 'getShowById').mockResolvedValue(null);
      vi.spyOn(store, 'getShowBanner').mockResolvedValue([]);

      const wrapper = createWrapper();
      await flushPromises();

      expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ShowDetail' }).exists()).toBe(false);
    });
  });

  describe('Async Operations', () => {
    it('should handle concurrent show and banner loading', async () => {
      const store = useShowsStore();
      const getShowByIdSpy = vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      const getShowBannerSpy = vi
        .spyOn(store, 'getShowBanner')
        .mockResolvedValue([mockBannerImage]);

      createWrapper({ id: '1' });
      await flushPromises();

      expect(getShowByIdSpy).toHaveBeenCalled();
      expect(getShowBannerSpy).toHaveBeenCalled();
    });

    it('should handle show loading before banner loading', async () => {
      const store = useShowsStore();
      const getShowByIdSpy = vi.spyOn(store, 'getShowById').mockResolvedValue(mockShow);
      const getShowBannerSpy = vi.spyOn(store, 'getShowBanner').mockResolvedValue([]);

      createWrapper({ id: '1' });
      await flushPromises();

      expect(getShowByIdSpy).toHaveBeenCalled();
      expect(getShowBannerSpy).toHaveBeenCalled();
    });
  });
});
