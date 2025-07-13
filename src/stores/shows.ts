import { defineStore } from 'pinia';
import { TvmazeRepository, type ITvmazeRepository } from '../repositories/tvmaze-repository';
import { type Show, type ImageResponse, ImageType } from '../types/tvmaze';

let tvmazeRepository: ITvmazeRepository = new TvmazeRepository();

export const setTvmazeRepository = (repository: ITvmazeRepository) => {
  tvmazeRepository = repository;
};

export enum ShowType {
  All = 'all',
  Movie = 'movie',
  TV = 'tv',
}

interface ShowsState {
  allShows: Show[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Show[];
  isSearching: boolean;
  show: Show | null;
  showBanner: ImageResponse | null;
  selectedGenres: string[];
  minRating: number;
  selectedType: ShowType;
}

interface GenreSection {
  genre: string;
  shows: Show[];
}

export const useShowsStore = defineStore('shows', {
  state: (): ShowsState => ({
    allShows: [],
    loading: false,
    error: null,
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    show: null,
    showBanner: null,
    selectedGenres: [],
    minRating: 0,
    selectedType: ShowType.All,
  }),

  getters: {
    availableGenres: (state): string[] => {
      const genres = new Set(state.allShows.flatMap((show) => show.genres));
      return Array.from(genres).sort();
    },

    showsByGenre: (state): GenreSection[] => {
      if (state.allShows.length === 0) return [];

      const genreMap = new Map<string, Set<Show>>();

      for (const show of state.allShows) {
        for (const genre of show.genres) {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, new Set());
          }
          genreMap.get(genre)!.add(show);
        }
      }

      const result: GenreSection[] = [];

      for (const [genre, showSet] of genreMap) {
        const shows = Array.from(showSet).sort(
          (a, b) => (b.rating.average || 0) - (a.rating.average || 0),
        );

        result.push({ genre, shows });
      }

      return result.sort((a, b) => a.genre.localeCompare(b.genre));
    },

    filteredSearchResults: (state): Show[] => {
      const trimmedQuery = state.searchQuery.trim();
      if (!trimmedQuery) return [];

      const query = trimmedQuery.toLowerCase();
      const results: Show[] = [];

      for (const show of state.searchResults) {
        if (show.name.toLowerCase().includes(query)) {
          results.push(show);
          continue;
        }

        for (const genre of show.genres) {
          if (genre.toLowerCase().includes(query)) {
            results.push(show);
            break;
          }
        }
      }

      return results;
    },

    isInSearchMode: (state): boolean => {
      return state.searchQuery.trim().length > 0;
    },

    filteredShows(): Show[] {
      const seen = new Set<number>();

      return this.allShows.filter((show) => {
        if (!isTypeMatch(show, this.selectedType)) return false;
        if (
          this.selectedGenres.length > 0 &&
          !this.selectedGenres.some((genre) => show.genres.includes(genre))
        ) {
          return false;
        }

        const showRating = show.rating.average || 0;
        if (showRating < this.minRating) return false;
        if (seen.has(show.id)) return false;
        seen.add(show.id);
        return true;
      });
    },

    hasActiveFilters: (state): boolean => {
      return (
        state.selectedGenres.length > 0 ||
        state.minRating > 0 ||
        state.selectedType !== ShowType.All
      );
    },
  },

  actions: {
    async loadShowsCatalog(pages: number[] = [0, 1, 2, 3, 4]) {
      try {
        this.loading = true;
        this.error = null;

        const allShows: Show[] = [];

        for (const page of pages) {
          const shows = await tvmazeRepository.getAllShows(page);
          if (Array.isArray(shows)) {
            allShows.push(...shows);
          }
        }

        this.allShows = allShows;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load shows catalog';
      } finally {
        this.loading = false;
      }
    },

    async searchShows(query: string) {
      if (!query.trim()) {
        this.clearSearch();
        return;
      }

      try {
        this.isSearching = true;
        this.error = null;
        this.searchQuery = query;

        const searchResults = await tvmazeRepository.searchShows(query);
        this.searchResults = searchResults.map((result) => result.show);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to search shows';
      } finally {
        this.isSearching = false;
      }
    },

    clearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
      this.error = null;
    },

    async getShowById(id: number): Promise<Show | null> {
      try {
        this.loading = true;
        this.error = null;
        const show = await tvmazeRepository.getShowById(id);
        this.show = show;

        return show;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load show details';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async getShowBanner(id: number) {
      try {
        this.loading = true;
        this.error = null;
        const images = await tvmazeRepository.getShowImages(id);
        this.showBanner = images.find((image) => image.type === ImageType.BACKGROUND) ?? null;

        return images;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load show banner';
        return null;
      } finally {
        this.loading = false;
      }
    },

    clearData() {
      this.allShows = [];
      this.searchResults = [];
      this.searchQuery = '';
      this.error = null;
    },

    setSelectedGenres(genres: string[]) {
      this.selectedGenres = genres;
    },

    setMinRating(rating: number) {
      this.minRating = rating;
    },

    setSelectedType(type: ShowType) {
      this.selectedType = type;
    },

    clearFilters() {
      this.selectedGenres = [];
      this.minRating = 0;
      this.selectedType = ShowType.All;
    },
  },
});

function isTypeMatch(show: Show, type: ShowType): boolean {
  if (type === ShowType.All) return true;
  if (type === ShowType.Movie) return !!show.runtime && show.runtime > 60;
  if (type === ShowType.TV) return !!show.runtime && show.runtime <= 60;
  return true;
}
