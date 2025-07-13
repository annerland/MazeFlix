import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore, setTvmazeRepository, ShowType } from '../../stores/shows';
import { type Show, ImageType } from '../../types/tvmaze';
import type { ITvmazeRepository } from '../../repositories/tvmaze-repository';

const mockTvmazeRepository: ITvmazeRepository = {
  getAllShows: vi.fn(),
  searchShows: vi.fn(),
  getShowById: vi.fn(),
  getShowImages: vi.fn(),
};

describe('useShowsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    setTvmazeRepository(mockTvmazeRepository);
  });

  describe('State', () => {
    it('should initialize with default state', () => {
      const store = useShowsStore();

      expect(store.allShows).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.searchQuery).toBe('');
      expect(store.searchResults).toEqual([]);
      expect(store.isSearching).toBe(false);
      expect(store.show).toBeNull();
      expect(store.showBanner).toBeNull();
      expect(store.selectedGenres).toEqual([]);
      expect(store.minRating).toBe(0);
      expect(store.selectedType).toBe(ShowType.All);
    });
  });

  describe('Getters', () => {
    describe('availableGenres', () => {
      it('should return empty array when no shows', () => {
        const store = useShowsStore();
        expect(store.availableGenres).toEqual([]);
      });

      it('should return unique sorted genres', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama', 'Crime'] } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy', 'Drama'] } as Show,
          { id: 3, name: 'Show 3', genres: ['Action'] } as Show,
        ];

        expect(store.availableGenres).toEqual(['Action', 'Comedy', 'Crime', 'Drama']);
      });
    });

    describe('showsByGenre', () => {
      it('should return empty array when no shows', () => {
        const store = useShowsStore();
        expect(store.showsByGenre).toEqual([]);
      });

      it('should group shows by genre and sort by rating', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.5 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Drama'], rating: { average: 9.0 } } as Show,
          { id: 3, name: 'Show 3', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
        ];

        const result = store.showsByGenre;

        expect(result).toHaveLength(2);
        expect(result[0].genre).toBe('Comedy');
        expect(result[0].shows).toHaveLength(1);
        expect(result[1].genre).toBe('Drama');
        expect(result[1].shows).toHaveLength(2);
        expect(result[1].shows[0].rating.average).toBe(9.0);
      });

      it('should handle shows with multiple genres', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama', 'Crime'] } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'] } as Show,
        ];

        const result = store.showsByGenre;

        expect(result).toHaveLength(3);
        expect(result.find((r) => r.genre === 'Drama')?.shows).toHaveLength(1);
        expect(result.find((r) => r.genre === 'Crime')?.shows).toHaveLength(1);
        expect(result.find((r) => r.genre === 'Comedy')?.shows).toHaveLength(1);
      });
    });

    describe('filteredShows', () => {
      it('should return all shows when no filters are applied', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
        ];

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Show 1');
        expect(result[1].name).toBe('Show 2');
      });

      it('should filter by selected genres', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
          { id: 3, name: 'Show 3', genres: ['Drama', 'Crime'], rating: { average: 9.0 } } as Show,
        ];
        store.selectedGenres = ['Drama'];

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Show 1');
        expect(result[1].name).toBe('Show 3');
      });

      it('should filter by minimum rating', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
          { id: 3, name: 'Show 3', genres: ['Action'], rating: { average: 9.0 } } as Show,
        ];
        store.minRating = 8.0;

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Show 1');
        expect(result[1].name).toBe('Show 3');
      });

      it('should filter by show type (Movie)', () => {
        const store = useShowsStore();
        store.allShows = [
          {
            id: 1,
            name: 'Movie 1',
            genres: ['Drama'],
            rating: { average: 8.0 },
            runtime: 120,
          } as Show,
          {
            id: 2,
            name: 'TV Show 1',
            genres: ['Comedy'],
            rating: { average: 7.5 },
            runtime: 30,
          } as Show,
          {
            id: 3,
            name: 'Movie 2',
            genres: ['Action'],
            rating: { average: 9.0 },
            runtime: 90,
          } as Show,
        ];
        store.selectedType = ShowType.Movie;

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Movie 1');
        expect(result[1].name).toBe('Movie 2');
      });

      it('should filter by show type (TV)', () => {
        const store = useShowsStore();
        store.allShows = [
          {
            id: 1,
            name: 'Movie 1',
            genres: ['Drama'],
            rating: { average: 8.0 },
            runtime: 120,
          } as Show,
          {
            id: 2,
            name: 'TV Show 1',
            genres: ['Comedy'],
            rating: { average: 7.5 },
            runtime: 30,
          } as Show,
          {
            id: 3,
            name: 'TV Show 2',
            genres: ['Action'],
            rating: { average: 9.0 },
            runtime: 45,
          } as Show,
        ];
        store.selectedType = ShowType.TV;

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('TV Show 1');
        expect(result[1].name).toBe('TV Show 2');
      });

      it('should combine multiple filters', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
          { id: 3, name: 'Show 3', genres: ['Drama'], rating: { average: 9.0 } } as Show,
        ];
        store.selectedGenres = ['Drama'];
        store.minRating = 8.5;

        const result = store.filteredShows;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Show 3');
      });

      it('should handle shows with no rating', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: null } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
        ];
        store.minRating = 8.0;

        const result = store.filteredShows;

        expect(result).toHaveLength(0);
      });

      it('should remove duplicates', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'], rating: { average: 7.5 } } as Show,
        ];

        const result = store.filteredShows;

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
      });

      it('should handle shows with no runtime for type filtering', () => {
        const store = useShowsStore();
        store.allShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'], rating: { average: 8.0 } } as Show,
          {
            id: 2,
            name: 'Show 2',
            genres: ['Comedy'],
            rating: { average: 7.5 },
            runtime: 30,
          } as Show,
          {
            id: 3,
            name: 'Show 3',
            genres: ['Action'],
            rating: { average: 9.0 },
            runtime: 120,
          } as Show,
        ];
        store.selectedType = ShowType.Movie;

        const result = store.filteredShows;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Show 3');
      });

      it('should handle shows with null runtime for type filtering', () => {
        const store = useShowsStore();
        store.allShows = [
          {
            id: 1,
            name: 'Show 1',
            genres: ['Drama'],
            rating: { average: 8.0 },
            runtime: null,
          } as Show,
          {
            id: 2,
            name: 'Show 2',
            genres: ['Comedy'],
            rating: { average: 7.5 },
            runtime: 30,
          } as Show,
          {
            id: 3,
            name: 'Show 3',
            genres: ['Action'],
            rating: { average: 9.0 },
            runtime: 120,
          } as Show,
        ];
        store.selectedType = ShowType.TV;

        const result = store.filteredShows;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Show 2');
      });

      it('should handle edge case runtime values', () => {
        const store = useShowsStore();
        store.allShows = [
          {
            id: 1,
            name: 'Show 1',
            genres: ['Drama'],
            rating: { average: 8.0 },
            runtime: 60,
          } as Show,
          {
            id: 2,
            name: 'Show 2',
            genres: ['Comedy'],
            rating: { average: 7.5 },
            runtime: 61,
          } as Show,
          {
            id: 3,
            name: 'Show 3',
            genres: ['Action'],
            rating: { average: 9.0 },
            runtime: 59,
          } as Show,
        ];
        store.selectedType = ShowType.Movie;

        const result = store.filteredShows;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Show 2');
      });
    });

    describe('hasActiveFilters', () => {
      it('should return false when no filters are applied', () => {
        const store = useShowsStore();
        expect(store.hasActiveFilters).toBe(false);
      });

      it('should return true when genres are selected', () => {
        const store = useShowsStore();
        store.selectedGenres = ['Drama'];
        expect(store.hasActiveFilters).toBe(true);
      });

      it('should return true when min rating is set', () => {
        const store = useShowsStore();
        store.minRating = 8.0;
        expect(store.hasActiveFilters).toBe(true);
      });

      it('should return true when show type is not All', () => {
        const store = useShowsStore();
        store.selectedType = ShowType.Movie;
        expect(store.hasActiveFilters).toBe(true);
      });

      it('should return true when multiple filters are applied', () => {
        const store = useShowsStore();
        store.selectedGenres = ['Drama'];
        store.minRating = 8.0;
        store.selectedType = ShowType.TV;
        expect(store.hasActiveFilters).toBe(true);
      });
    });

    describe('filteredSearchResults', () => {
      it('should return empty array when no search query', () => {
        const store = useShowsStore();
        expect(store.filteredSearchResults).toEqual([]);
      });

      it('should filter results by name', () => {
        const store = useShowsStore();
        store.searchQuery = 'breaking';
        store.searchResults = [
          { id: 1, name: 'Breaking Bad', genres: ['Drama'] } as Show,
          { id: 2, name: 'Friends', genres: ['Comedy'] } as Show,
        ];

        const result = store.filteredSearchResults;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Breaking Bad');
      });

      it('should filter results by genre', () => {
        const store = useShowsStore();
        store.searchQuery = 'drama';
        store.searchResults = [
          { id: 1, name: 'Breaking Bad', genres: ['Drama', 'Crime'] } as Show,
          { id: 2, name: 'Friends', genres: ['Comedy'] } as Show,
        ];

        const result = store.filteredSearchResults;

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Breaking Bad');
      });
    });

    describe('isInSearchMode', () => {
      it('should return false for empty query', () => {
        const store = useShowsStore();
        store.searchQuery = '';
        expect(store.isInSearchMode).toBe(false);
      });

      it('should return false for whitespace only', () => {
        const store = useShowsStore();
        store.searchQuery = '   ';
        expect(store.isInSearchMode).toBe(false);
      });

      it('should return true for valid query', () => {
        const store = useShowsStore();
        store.searchQuery = 'breaking';
        expect(store.isInSearchMode).toBe(true);
      });
    });
  });

  describe('Actions', () => {
    describe('setSelectedGenres', () => {
      it('should set selected genres', () => {
        const store = useShowsStore();
        const genres = ['Drama', 'Comedy'];

        store.setSelectedGenres(genres);

        expect(store.selectedGenres).toEqual(genres);
      });

      it('should replace existing genres', () => {
        const store = useShowsStore();
        store.selectedGenres = ['Action'];

        store.setSelectedGenres(['Drama', 'Comedy']);

        expect(store.selectedGenres).toEqual(['Drama', 'Comedy']);
      });
    });

    describe('setMinRating', () => {
      it('should set minimum rating', () => {
        const store = useShowsStore();
        const rating = 8.5;

        store.setMinRating(rating);

        expect(store.minRating).toBe(rating);
      });

      it('should handle zero rating', () => {
        const store = useShowsStore();
        store.minRating = 8.5;

        store.setMinRating(0);

        expect(store.minRating).toBe(0);
      });
    });

    describe('setSelectedType', () => {
      it('should set show type to All', () => {
        const store = useShowsStore();
        store.selectedType = ShowType.Movie;

        store.setSelectedType(ShowType.All);

        expect(store.selectedType).toBe(ShowType.All);
      });

      it('should set show type to Movie', () => {
        const store = useShowsStore();

        store.setSelectedType(ShowType.Movie);

        expect(store.selectedType).toBe(ShowType.Movie);
      });

      it('should set show type to TV', () => {
        const store = useShowsStore();

        store.setSelectedType(ShowType.TV);

        expect(store.selectedType).toBe(ShowType.TV);
      });
    });

    describe('clearFilters', () => {
      it('should clear all filters', () => {
        const store = useShowsStore();
        store.selectedGenres = ['Drama', 'Comedy'];
        store.minRating = 8.0;
        store.selectedType = ShowType.Movie;

        store.clearFilters();

        expect(store.selectedGenres).toEqual([]);
        expect(store.minRating).toBe(0);
        expect(store.selectedType).toBe(ShowType.All);
      });

      it('should clear filters when already empty', () => {
        const store = useShowsStore();
        store.clearFilters();

        expect(store.selectedGenres).toEqual([]);
        expect(store.minRating).toBe(0);
        expect(store.selectedType).toBe(ShowType.All);
      });
    });

    describe('loadShowsCatalog', () => {
      it('should load shows successfully', async () => {
        const mockShows = [
          { id: 1, name: 'Show 1', genres: ['Drama'] } as Show,
          { id: 2, name: 'Show 2', genres: ['Comedy'] } as Show,
        ];

        (mockTvmazeRepository.getAllShows as Mock).mockResolvedValue(mockShows);

        const store = useShowsStore();
        await store.loadShowsCatalog();

        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.allShows).toEqual([
          ...mockShows,
          ...mockShows,
          ...mockShows,
          ...mockShows,
          ...mockShows,
        ]);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledTimes(5);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledWith(0);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledWith(1);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledWith(2);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledWith(3);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledWith(4);
      });

      it('should handle errors', async () => {
        const errorMessage = 'Failed to load shows';
        (mockTvmazeRepository.getAllShows as Mock).mockRejectedValue(new Error(errorMessage));

        const store = useShowsStore();
        await store.loadShowsCatalog();

        expect(store.loading).toBe(false);
        expect(store.error).toBe(errorMessage);
        expect(store.allShows).toEqual([]);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledTimes(1);
      });

      it('should load multiple pages', async () => {
        const mockShows1 = [{ id: 1, name: 'Show 1', genres: ['Drama'] } as Show];
        const mockShows2 = [{ id: 2, name: 'Show 2', genres: ['Comedy'] } as Show];

        (mockTvmazeRepository.getAllShows as Mock)
          .mockResolvedValueOnce(mockShows1)
          .mockResolvedValueOnce(mockShows2);

        const store = useShowsStore();
        await store.loadShowsCatalog([0, 1]);

        expect(store.allShows).toEqual([...mockShows1, ...mockShows2]);
        expect(mockTvmazeRepository.getAllShows).toHaveBeenCalledTimes(2);
      });
    });

    describe('searchShows', () => {
      it('should search shows successfully', async () => {
        const mockSearchResults = [{ show: { id: 1, name: 'Breaking Bad', genres: ['Drama'] } }];

        (mockTvmazeRepository.searchShows as Mock).mockResolvedValue(mockSearchResults);

        const store = useShowsStore();
        await store.searchShows('breaking');

        expect(store.isSearching).toBe(false);
        expect(store.error).toBeNull();
        expect(store.searchQuery).toBe('breaking');
        expect(store.searchResults).toEqual([mockSearchResults[0].show]);
      });

      it('should clear search for empty query', async () => {
        const store = useShowsStore();
        store.searchQuery = 'previous';
        store.searchResults = [{ id: 1, name: 'Show', genres: ['Drama'] } as Show];

        await store.searchShows('');

        expect(store.searchQuery).toBe('');
        expect(store.searchResults).toEqual([]);
        expect(store.error).toBeNull();
      });

      it('should handle search errors', async () => {
        const errorMessage = 'Search failed';
        (mockTvmazeRepository.searchShows as Mock).mockRejectedValue(new Error(errorMessage));

        const store = useShowsStore();
        await store.searchShows('test');

        expect(store.isSearching).toBe(false);
        expect(store.error).toBe(errorMessage);
      });
    });

    describe('getShowById', () => {
      it('should get show successfully', async () => {
        const mockShow = { id: 1, name: 'Breaking Bad', genres: ['Drama'] } as Show;

        (mockTvmazeRepository.getShowById as Mock).mockResolvedValue(mockShow);

        const store = useShowsStore();
        const result = await store.getShowById(1);

        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.show).toEqual(mockShow);
        expect(result).toEqual(mockShow);
      });

      it('should handle errors', async () => {
        const errorMessage = 'Show not found';
        (mockTvmazeRepository.getShowById as Mock).mockRejectedValue(new Error(errorMessage));

        const store = useShowsStore();
        const result = await store.getShowById(999);

        expect(store.loading).toBe(false);
        expect(store.error).toBe(errorMessage);
        expect(result).toBeNull();
      });
    });

    describe('getShowBanner', () => {
      it('should get banner successfully', async () => {
        const mockImages = [
          { type: ImageType.BACKGROUND, resolutions: { original: { url: 'test.jpg' } } },
        ];

        (mockTvmazeRepository.getShowImages as Mock).mockResolvedValue(mockImages);

        const store = useShowsStore();
        const result = await store.getShowBanner(1);

        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.showBanner).toEqual(mockImages[0]);
        expect(result).toEqual(mockImages);
      });

      it('should handle no banner found', async () => {
        (mockTvmazeRepository.getShowImages as Mock).mockResolvedValue([]);

        const store = useShowsStore();
        const result = await store.getShowBanner(1);

        expect(store.showBanner).toBeNull();
        expect(result).toEqual([]);
      });
    });

    describe('clearSearch', () => {
      it('should clear search state', () => {
        const store = useShowsStore();
        store.searchQuery = 'test';
        store.searchResults = [{ id: 1, name: 'Show', genres: ['Drama'] } as Show];
        store.error = 'Some error';

        store.clearSearch();

        expect(store.searchQuery).toBe('');
        expect(store.searchResults).toEqual([]);
        expect(store.error).toBeNull();
      });
    });

    describe('clearData', () => {
      it('should clear all data', () => {
        const store = useShowsStore();
        store.allShows = [{ id: 1, name: 'Show', genres: ['Drama'] } as Show];
        store.searchResults = [{ id: 2, name: 'Show 2', genres: ['Comedy'] } as Show];
        store.searchQuery = 'test';
        store.error = 'Some error';

        store.clearData();

        expect(store.allShows).toEqual([]);
        expect(store.searchResults).toEqual([]);
        expect(store.searchQuery).toBe('');
        expect(store.error).toBeNull();
      });
    });
  });
});
