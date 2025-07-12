import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { TvmazeRepository } from '../../repositories/tvmaze-repository';
import { HttpClient } from '../../services/http-client';

vi.mock('../../services/http-client');

describe('TvmazeRepository', () => {
  let repo: TvmazeRepository;
  let httpClientMock: Mocked<HttpClient>;

  beforeEach(() => {
    (HttpClient as unknown as { mockClear: () => void }).mockClear();
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<HttpClient>;
    (
      HttpClient as unknown as { mockImplementation: (fn: () => HttpClient) => void }
    ).mockImplementation(() => httpClientMock);
    repo = new TvmazeRepository();
  });

  it('calls getAllShows with correct URL', async () => {
    httpClientMock.get.mockResolvedValueOnce([]);
    await repo.getAllShows(2);
    expect(httpClientMock.get).toHaveBeenCalledWith('/shows?page=2');
  });

  it('calls getShowById with correct URL', async () => {
    httpClientMock.get.mockResolvedValueOnce({});
    await repo.getShowById(42);
    expect(httpClientMock.get).toHaveBeenCalledWith('/shows/42');
  });

  it('calls searchShows with correct URL', async () => {
    httpClientMock.get.mockResolvedValueOnce([]);
    await repo.searchShows('foo bar');
    expect(httpClientMock.get).toHaveBeenCalledWith('/search/shows?q=foo%20bar');
  });

  it('calls getShowImages with correct URL', async () => {
    httpClientMock.get.mockResolvedValueOnce([]);
    await repo.getShowImages(99);
    expect(httpClientMock.get).toHaveBeenCalledWith('/shows/99/images');
  });

  it('throws and logs on getAllShows error', async () => {
    httpClientMock.get.mockRejectedValueOnce(new Error('fail'));
    await expect(repo.getAllShows()).rejects.toThrow('Failed to fetch shows');
  });

  it('throws and logs on getShowById error', async () => {
    httpClientMock.get.mockRejectedValueOnce(new Error('fail'));
    await expect(repo.getShowById(1)).rejects.toThrow('Failed to fetch show with ID 1');
  });

  it('throws and logs on searchShows error', async () => {
    httpClientMock.get.mockRejectedValueOnce(new Error('fail'));
    await expect(repo.searchShows('x')).rejects.toThrow('Failed to search shows with query "x"');
  });

  it('throws and logs on getShowImages error', async () => {
    httpClientMock.get.mockRejectedValueOnce(new Error('fail'));
    await expect(repo.getShowImages(1)).rejects.toThrow('Failed to fetch show image for show 1');
  });
});
