import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import axios, { type AxiosInstance } from 'axios';
import { HttpClient } from '../../services/http-client';

vi.mock('axios');
const mockedAxios = axios as unknown as { create: typeof axios.create };

describe('HttpClient', () => {
  let client: HttpClient;
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    axiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as AxiosInstance;
    mockedAxios.create = vi.fn(() => axiosInstance);
    client = new HttpClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls get with correct params and returns data', async () => {
    (axiosInstance.get as Mock).mockResolvedValueOnce({ data: 'foo' });
    const result = await client.get('/test');
    expect(axiosInstance.get as Mock).toHaveBeenCalledWith('/test', undefined);
    expect(result).toBe('foo');
  });

  it('calls post with correct params and returns data', async () => {
    (axiosInstance.post as Mock).mockResolvedValueOnce({ data: 'bar' });
    const result = await client.post('/test', { a: 1 });
    expect(axiosInstance.post as Mock).toHaveBeenCalledWith('/test', { a: 1 }, undefined);
    expect(result).toBe('bar');
  });

  it('calls put with correct params and returns data', async () => {
    (axiosInstance.put as Mock).mockResolvedValueOnce({ data: 'baz' });
    const result = await client.put('/test', { b: 2 });
    expect(axiosInstance.put as Mock).toHaveBeenCalledWith('/test', { b: 2 }, undefined);
    expect(result).toBe('baz');
  });

  it('calls delete with correct params and returns data', async () => {
    (axiosInstance.delete as Mock).mockResolvedValueOnce({ data: 'gone' });
    const result = await client.delete('/test');
    expect(axiosInstance.delete as Mock).toHaveBeenCalledWith('/test', undefined);
    expect(result).toBe('gone');
  });
});
