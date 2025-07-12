export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string;
  ended: string | null;
  officialSite: string | null;
  rating: {
    average: number | null;
  };
  image: Image | null;
  summary: string | null;
  updated: number;
}

export interface Image {
  medium: string;
  original: string;
}

export interface Link {
  href: string;
}

export interface SearchResult {
  score: number;
  show: Show;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export enum ImageType {
  POSTER = 'poster',
  BANNER = 'banner',
  BACKGROUND = 'background',
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageResolution {
  url: string;
  width: number;
  height: number;
}

export interface ImageResolutions {
  original: ImageResolution;
  medium: ImageResolution;
}

export interface ImageResponse {
  id: number;
  type: ImageType;
  main: boolean;
  resolutions: ImageResolutions;
}
