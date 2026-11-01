/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MovieItem, ValidationIssue, ValidationReportData } from '../types/movie';

export const REQUIRED_MOVIE_KEYS: (keyof MovieItem)[] = [
  'id',
  'title',
  'pinned',
  'isPinned',
  'pin',
  'is_pinned',
  'featured',
  'isFeatured',
  'recent',
  'isRecent',
  'views',
  'category',
  'categories',
  'poster',
  'genre',
  'type',
  'language',
  'quality',
  'resolution',
  'releaseDate',
  'imdbRating',
  'storyline',
  'cast',
  'screenshots',
  'downloadLinks',
];

export const REQUIRED_DOWNLOAD_LINK_KEYS = ['quality', 'size', 'url', 'label'];

/**
 * Validates a JSON string or parsed MovieItem array against the exact VORVIXA schema
 */
export function validateMoviesJson(input: string | any[]): ValidationReportData {
  const issues: ValidationIssue[] = [];
  const passedChecks: string[] = [];

  let data: any;

  // 1. JSON syntax check if string
  if (typeof input === 'string') {
    if (!input.trim()) {
      return {
        isValid: false,
        errorCount: 1,
        warningCount: 0,
        totalMovies: 0,
        issues: [
          {
            type: 'error',
            message: 'JSON input is empty.',
            bengaliMessage: 'JSON ইনপুট খালি রয়েছে।',
          },
        ],
        passedChecks: [],
      };
    }

    try {
      data = JSON.parse(input);
      passedChecks.push('Valid JSON syntax (সঠিক JSON সিনট্যাক্স)');
    } catch (err: any) {
      return {
        isValid: false,
        errorCount: 1,
        warningCount: 0,
        totalMovies: 0,
        issues: [
          {
            type: 'error',
            message: `JSON syntax error: ${err.message}`,
            bengaliMessage: `JSON সিনট্যাক্স ত্রুটি: ${err.message}`,
          },
        ],
        passedChecks: [],
      };
    }
  } else {
    data = input;
    passedChecks.push('Valid JSON structure in memory');
  }

  // 2. Root is an Array
  if (!Array.isArray(data)) {
    issues.push({
      type: 'error',
      message: 'The root value must be a JSON Array [ ... ]. Received: ' + typeof data,
      bengaliMessage: 'রুট মান অবশ্যই একটি JSON অ্যারে [ ... ] হতে হবে।',
    });
    return {
      isValid: false,
      errorCount: 1,
      warningCount: 0,
      totalMovies: 0,
      issues,
      passedChecks,
    };
  }
  passedChecks.push('Root structure is a JSON Array (রুট একটি JSON অ্যারে)');

  const totalMovies = data.length;
  if (totalMovies === 0) {
    issues.push({
      type: 'warning',
      message: 'The movie array is currently empty.',
      bengaliMessage: 'মুভি অ্যারেটি বর্তমানে খালি রয়েছে।',
    });
  }

  const seenIds = new Map<string, number>();

  // 3. Inspect each movie object
  data.forEach((movie: any, idx: number) => {
    const moviePrefix = `Movie #${idx + 1} (${movie?.title || movie?.id || 'Untitled'})`;
    const mId = movie?.id;
    const mTitle = movie?.title;

    if (!movie || typeof movie !== 'object' || Array.isArray(movie)) {
      issues.push({
        type: 'error',
        movieIndex: idx,
        message: `${moviePrefix}: Item must be a valid JSON Object.`,
        bengaliMessage: `${moviePrefix}: আইটেমটি অবশ্যই একটি বৈধ JSON অবজেক্ট হতে হবে।`,
      });
      return;
    }

    // Required keys presence check
    const missingKeys = REQUIRED_MOVIE_KEYS.filter((k) => !(k in movie));
    if (missingKeys.length > 0) {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        movieTitle: mTitle,
        field: missingKeys.join(', '),
        message: `${moviePrefix}: Missing required schema keys: [${missingKeys.join(', ')}].`,
        bengaliMessage: `${moviePrefix}: স্কিমার প্রয়োজনীয় ফিল্ড অনুপস্থিত: [${missingKeys.join(', ')}]।`,
      });
    }

    // Check extra keys (Strict schema enforcement: do not add trailer, cast image, etc.)
    const extraKeys = Object.keys(movie).filter(
      (k) => !REQUIRED_MOVIE_KEYS.includes(k as keyof MovieItem)
    );
    if (extraKeys.length > 0) {
      issues.push({
        type: 'warning',
        movieIndex: idx,
        movieId: mId,
        movieTitle: mTitle,
        field: extraKeys.join(', '),
        message: `${moviePrefix}: Contains extra non-standard keys: [${extraKeys.join(', ')}]. Schema strictly requires only 25 standard keys.`,
        bengaliMessage: `${moviePrefix}: স্কিমায় বহির্ভূত অতিরিক্ত কি রয়েছে: [${extraKeys.join(', ')}]।`,
      });
    }

    // ID Checks
    if (!movie.id || typeof movie.id !== 'string') {
      issues.push({
        type: 'error',
        movieIndex: idx,
        field: 'id',
        message: `${moviePrefix}: ID is missing or not a string.`,
        bengaliMessage: `${moviePrefix}: মুভি আইডি অনুপস্থিত অথবা স্ট্রিং নয়।`,
      });
    } else {
      if (seenIds.has(movie.id)) {
        issues.push({
          type: 'error',
          movieIndex: idx,
          movieId: movie.id,
          field: 'id',
          message: `${moviePrefix}: Duplicate ID '${movie.id}' detected! Already used in Movie #${seenIds.get(movie.id)! + 1}.`,
          bengaliMessage: `${moviePrefix}: ডুপ্লিকেট আইডি '${movie.id}' পাওয়া গেছে!`,
        });
      } else {
        seenIds.set(movie.id, idx);
      }
    }

    // Title Check
    if (!movie.title || typeof movie.title !== 'string') {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'title',
        message: `${moviePrefix}: Title is missing or not a string.`,
        bengaliMessage: `${moviePrefix}: টাইটেল অনুপস্থিত অথবা স্ট্রিং নয়।`,
      });
    }

    // Synchronized pin booleans check: pinned, isPinned, pin, is_pinned
    const pinProps = [movie.pinned, movie.isPinned, movie.pin, movie.is_pinned];
    const allPinBooleans = pinProps.every((p) => typeof p === 'boolean');
    if (!allPinBooleans) {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'pinned/isPinned/pin/is_pinned',
        message: `${moviePrefix}: All pin fields (pinned, isPinned, pin, is_pinned) must be booleans.`,
        bengaliMessage: `${moviePrefix}: সব পিন ফিল্ড অবশ্যই বুলিয়ান (true/false) হতে হবে।`,
      });
    } else {
      const allMatch = pinProps.every((p) => p === pinProps[0]);
      if (!allMatch) {
        issues.push({
          type: 'error',
          movieIndex: idx,
          movieId: mId,
          field: 'pinned/isPinned/pin/is_pinned',
          message: `${moviePrefix}: Pin fields are out of sync! (pinned: ${movie.pinned}, isPinned: ${movie.isPinned}, pin: ${movie.pin}, is_pinned: ${movie.is_pinned}). All must be identical.`,
          bengaliMessage: `${moviePrefix}: পিন ফিল্ডগুলো সিঙ্ক নেই! সবগুলোর মান এক হতে হবে।`,
        });
      }
    }

    // Synchronized featured check: featured, isFeatured
    if (typeof movie.featured !== 'boolean' || typeof movie.isFeatured !== 'boolean') {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'featured/isFeatured',
        message: `${moviePrefix}: featured and isFeatured must be booleans.`,
        bengaliMessage: `${moviePrefix}: featured এবং isFeatured অবশ্যই বুলিয়ান হতে হবে।`,
      });
    } else if (movie.featured !== movie.isFeatured) {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'featured/isFeatured',
        message: `${moviePrefix}: featured (${movie.featured}) and isFeatured (${movie.isFeatured}) must match.`,
        bengaliMessage: `${moviePrefix}: featured এবং isFeatured ফিল্ডের মান এক হতে হবে।`,
      });
    }

    // Synchronized recent check: recent, isRecent
    if (typeof movie.recent !== 'boolean' || typeof movie.isRecent !== 'boolean') {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'recent/isRecent',
        message: `${moviePrefix}: recent and isRecent must be booleans.`,
        bengaliMessage: `${moviePrefix}: recent এবং isRecent অবশ্যই বুলিয়ান হতে হবে।`,
      });
    } else if (movie.recent !== movie.isRecent) {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'recent/isRecent',
        message: `${moviePrefix}: recent (${movie.recent}) and isRecent (${movie.isRecent}) must match.`,
        bengaliMessage: `${moviePrefix}: recent এবং isRecent ফিল্ডের মান এক হতে হবে।`,
      });
    }

    // Views must be a string
    if (typeof movie.views !== 'string') {
      issues.push({
        type: 'error',
        movieIndex: idx,
        movieId: mId,
        field: 'views',
        message: `${moviePrefix}: 'views' must be a string (e.g. "" or "0"). Received: ${typeof movie.views}`,
        bengaliMessage: `${moviePrefix}: 'views' অবশ্যই স্ট্রিং হতে হবে।`,
      });
    }

    // Array type checks
    ['categories', 'genre', 'cast', 'screenshots', 'downloadLinks'].forEach((arrField) => {
      if (!Array.isArray(movie[arrField])) {
        issues.push({
          type: 'error',
          movieIndex: idx,
          movieId: mId,
          field: arrField,
          message: `${moviePrefix}: '${arrField}' must be an array. Received: ${typeof movie[arrField]}`,
          bengaliMessage: `${moviePrefix}: '${arrField}' অবশ্যই একটি অ্যারে হতে হবে।`,
        });
      }
    });

    // Poster check & URL validation
    if (!movie.poster) {
      issues.push({
        type: 'warning',
        movieIndex: idx,
        movieId: mId,
        field: 'poster',
        message: `${moviePrefix}: Poster URL is missing.`,
        bengaliMessage: `${moviePrefix}: পোস্টার লিংক খালি রয়েছে।`,
      });
    } else if (typeof movie.poster === 'string' && !movie.poster.startsWith('http')) {
      issues.push({
        type: 'warning',
        movieIndex: idx,
        movieId: mId,
        field: 'poster',
        message: `${moviePrefix}: Poster URL '${movie.poster}' does not start with http:// or https://.`,
        bengaliMessage: `${moviePrefix}: পোস্টার লিংকটি http/https দিয়ে শুরু হয়নি।`,
      });
    }

    // DownloadLinks check
    if (Array.isArray(movie.downloadLinks)) {
      if (movie.downloadLinks.length === 0) {
        issues.push({
          type: 'warning',
          movieIndex: idx,
          movieId: mId,
          field: 'downloadLinks',
          message: `${moviePrefix}: Has 0 download links.`,
          bengaliMessage: `${moviePrefix}: কোন ডাউনলোড লিংক যুক্ত করা হয়নি।`,
        });
      }

      movie.downloadLinks.forEach((link: any, linkIdx: number) => {
        const linkPrefix = `${moviePrefix} > Link #${linkIdx + 1}`;
        if (!link || typeof link !== 'object' || Array.isArray(link)) {
          issues.push({
            type: 'error',
            movieIndex: idx,
            movieId: mId,
            field: `downloadLinks[${linkIdx}]`,
            message: `${linkPrefix}: Must be an object with quality, size, url, label.`,
            bengaliMessage: `${linkPrefix}: অবশ্যই একটি অবজেক্ট হতে হবে।`,
          });
          return;
        }

        REQUIRED_DOWNLOAD_LINK_KEYS.forEach((key) => {
          if (!(key in link) || typeof link[key] !== 'string') {
            issues.push({
              type: 'error',
              movieIndex: idx,
              movieId: mId,
              field: `downloadLinks[${linkIdx}].${key}`,
              message: `${linkPrefix}: Missing or non-string key '${key}'.`,
              bengaliMessage: `${linkPrefix}: '${key}' ফিল্ড অনুপস্থিত বা স্ট্রিং নয়।`,
            });
          }
        });

        // Suspicious URL check
        if (link.url && !link.url.startsWith('http') && !link.url.startsWith('magnet:')) {
          issues.push({
            type: 'warning',
            movieIndex: idx,
            movieId: mId,
            field: `downloadLinks[${linkIdx}].url`,
            message: `${linkPrefix}: URL '${link.url}' does not start with http or magnet:`,
            bengaliMessage: `${linkPrefix}: লিংকটি সাধারণ ওয়েব ইউআরএল বা ম্যাগনেট নয়।`,
          });
        }
      });
    }
  });

  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  if (errorCount === 0) {
    passedChecks.push('All required keys present in every movie (সকল ফিল্ড বিদ্যমান)');
    passedChecks.push('Pin boolean fields synchronized (পিন ফিল্ডসমূহ সিঙ্কড)');
    passedChecks.push('Featured & Recent fields synchronized (ফিচার্ড ও রিসেন্ট সিঙ্কড)');
    passedChecks.push('Views is valid string (ভিউ স্ট্রিং হিসেবে যাচাইকৃত)');
    passedChecks.push('Array fields correctly typed (অ্যারে টাইপ সঠিক)');
    passedChecks.push('No duplicate movie IDs (কোন ডুপ্লিকেট আইডি নেই)');
    passedChecks.push('Download links schema fully compliant (ডাউনলোড লিংক স্কিমা সঠিক)');
  }

  return {
    isValid: errorCount === 0,
    errorCount,
    warningCount,
    totalMovies,
    issues,
    passedChecks,
  };
}
