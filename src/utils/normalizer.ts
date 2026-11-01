/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MovieDownloadLink, MovieItem } from '../types/movie';
import { SUPPORTED_CATEGORIES } from '../constants/categories';

/**
 * Creates a URL-friendly slug from title and year or releaseDate
 */
export function generateMovieId(title: string, yearOrDate?: string): string {
  const cleanTitle = (title || 'untitled')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  let year = '';
  if (yearOrDate) {
    const match = yearOrDate.match(/\b(19\d\d|20\d\d)\b/);
    if (match) {
      year = match[1];
    }
  }

  const base = year ? `${cleanTitle}-${year}` : cleanTitle;
  return base.replace(/-+/g, '-').replace(/^-|-$/g, '') || 'movie';
}

/**
 * Normalizes a single raw object into a strictly compliant MovieItem
 */
export function normalizeMovieItem(raw: any, existingIds = new Set<string>()): MovieItem {
  if (!raw || typeof raw !== 'object') {
    raw = {};
  }

  // Pin synchronization (all 4 must match)
  const pinVal = Boolean(raw.pinned ?? raw.isPinned ?? raw.pin ?? raw.is_pinned ?? false);

  // Featured synchronization (both must match)
  const featuredVal = Boolean(raw.featured ?? raw.isFeatured ?? false);

  // Recent synchronization (both must match)
  const recentVal = Boolean(raw.recent ?? raw.isRecent ?? false);

  // Categories normalization
  let categories: string[] = [];
  if (Array.isArray(raw.categories)) {
    categories = raw.categories
      .map((c: any) => String(c || '').trim().toUpperCase())
      .filter((c: string) => (SUPPORTED_CATEGORIES as string[]).includes(c));
  }
  // If raw.category was provided and not in categories, add if valid
  const rawCat = String(raw.category || '').trim().toUpperCase();
  if (rawCat && (SUPPORTED_CATEGORIES as string[]).includes(rawCat) && !categories.includes(rawCat)) {
    categories.unshift(rawCat);
  }

  const primaryCategory = categories.length > 0 ? categories[0] : (rawCat || '');

  // Arrays
  const genre = Array.isArray(raw.genre)
    ? raw.genre.map((g: any) => String(g || '').trim()).filter(Boolean)
    : [];

  const cast = Array.isArray(raw.cast)
    ? raw.cast.map((c: any) => String(c || '').trim()).filter(Boolean)
    : [];

  const screenshots = Array.isArray(raw.screenshots)
    ? raw.screenshots.map((s: any) => String(s || '').trim()).filter(Boolean)
    : [];

  // Download links (strictly quality, size, url, label)
  const downloadLinks: MovieDownloadLink[] = Array.isArray(raw.downloadLinks)
    ? raw.downloadLinks.map((link: any) => ({
        quality: String(link?.quality || '').trim(),
        size: String(link?.size || '').trim(),
        url: String(link?.url || '').trim(),
        label: String(link?.label || link?.quality || '').trim(),
      }))
    : [];

  // Title & ID
  const title = String(raw.title || '').trim();
  const releaseDate = String(raw.releaseDate || '').trim();

  let id = String(raw.id || '').trim().toLowerCase();
  if (!id) {
    id = generateMovieId(title, releaseDate);
  } else {
    id = id.replace(/[^\w-]/g, '-').replace(/-+/g, '-');
  }

  // Ensure ID uniqueness in the current set
  let uniqueId = id;
  let counter = 2;
  while (existingIds.has(uniqueId)) {
    uniqueId = `${id}-${counter}`;
    counter++;
  }
  existingIds.add(uniqueId);

  // Views must be string
  const views = raw.views !== undefined && raw.views !== null ? String(raw.views).trim() : '';

  return {
    id: uniqueId,
    title,
    pinned: pinVal,
    isPinned: pinVal,
    pin: pinVal,
    is_pinned: pinVal,
    featured: featuredVal,
    isFeatured: featuredVal,
    recent: recentVal,
    isRecent: recentVal,
    views,
    category: primaryCategory,
    categories,
    poster: String(raw.poster || '').trim(),
    genre,
    type: String(raw.type || '').trim(),
    language: String(raw.language || '').trim(),
    quality: String(raw.quality || '').trim(),
    resolution: String(raw.resolution || '').trim(),
    releaseDate,
    imdbRating: String(raw.imdbRating || '').trim(),
    storyline: String(raw.storyline || '').trim(),
    cast,
    screenshots,
    downloadLinks,
  };
}

/**
 * Normalizes an array of movie objects
 */
export function normalizeMoviesBatch(rawList: any[]): MovieItem[] {
  if (!Array.isArray(rawList)) {
    if (rawList && typeof rawList === 'object') {
      rawList = [rawList];
    } else {
      return [];
    }
  }

  const existingIds = new Set<string>();
  return rawList.map((item) => normalizeMovieItem(item, existingIds));
}
