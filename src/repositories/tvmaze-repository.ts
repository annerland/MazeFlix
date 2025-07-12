import { HttpClient } from '../services/http-client';
import type { Show, SearchResult, ImageResponse } from '../types/tvmaze';

export interface ITvmazeRepository {
  getAllShows(page?: number): Promise<Show[]>;
  getShowById(id: number): Promise<Show>;
  searchShows(query: string): Promise<SearchResult[]>;
  getShowImages(id: number): Promise<ImageResponse[]>;
}

export class TvmazeRepository implements ITvmazeRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAllShows(page: number = 0): Promise<Show[]> {
    try {
      return await this.httpClient.get<Show[]>(`/shows?page=${page}`);
    } catch {
      throw new Error('Failed to fetch shows');
    }
  }

  async getShowById(id: number): Promise<Show> {
    try {
      return await this.httpClient.get<Show>(`/shows/${id}`);
    } catch {
      throw new Error(`Failed to fetch show with ID ${id}`);
    }
  }

  async searchShows(query: string): Promise<SearchResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      return await this.httpClient.get<SearchResult[]>(`/search/shows?q=${encodedQuery}`);
    } catch {
      throw new Error(`Failed to search shows with query "${query}"`);
    }
  }

  async getShowImages(id: number): Promise<ImageResponse[]> {
    try {
      return await this.httpClient.get<ImageResponse[]>(`/shows/${id}/images`);
    } catch {
      throw new Error(`Failed to fetch show image for show ${id}`);
    }
  }
}
