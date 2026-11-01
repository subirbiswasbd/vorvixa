/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MovieDownloadLink {
  quality: string;
  size: string;
  url: string;
  label: string;
}

export interface MovieItem {
  id: string;
  title: string;
  pinned: boolean;
  isPinned: boolean;
  pin: boolean;
  is_pinned: boolean;
  featured: boolean;
  isFeatured: boolean;
  recent: boolean;
  isRecent: boolean;
  views: string;
  category: string;
  categories: string[];
  poster: string;
  genre: string[];
  type: string;
  language: string;
  quality: string;
  resolution: string;
  releaseDate: string;
  imdbRating: string;
  storyline: string;
  cast: string[];
  screenshots: string[];
  downloadLinks: MovieDownloadLink[];
}

export type SupportedCategory =
  | 'HINDI MOVIE'
  | 'SOUTH MOVIE'
  | '18+ ADULTS'
  | 'TV SERIES'
  | 'SERIES'
  | 'HORROR MOVIE'
  | 'MOVIE'
  | 'BANGLA'
  | 'BANGLA DUBBED'
  | 'DUAL AUDIO'
  | 'MULTI AUDIO'
  | 'WEB SERIES'
  | 'WWE'
  | 'ANIMATION'
  | 'DRAMA'
  | 'ALL MOVIES';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  movieIndex?: number;
  movieId?: string;
  movieTitle?: string;
  field?: string;
  message: string;
  bengaliMessage: string;
}

export interface ValidationReportData {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  totalMovies: number;
  issues: ValidationIssue[];
  passedChecks: string[];
}
