/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { normalizeMoviesBatch } from './src/utils/normalizer.ts';
import { validateMoviesJson } from './src/utils/validator.ts';
import { SUPPORTED_CATEGORIES } from './src/constants/categories.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to check Gemini API Key
function getGeminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return undefined;
  }
  return key.trim();
}

// Gemini Client initialization
function getGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health / Status Endpoint
app.get('/api/gemini/status', (_req, res) => {
  const apiKey = getGeminiApiKey();
  res.json({
    configured: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    supportedCategoriesCount: SUPPORTED_CATEGORIES.length,
    timestamp: new Date().toISOString(),
  });
});

// Heuristic fallback parser in case API key is missing during offline testing
function heuristicParse(text: string) {
  const entries = text.split(/(?:={3,}|-{3,}|\n\s*\n\s*(?:Movie|Title|মুভি|নাম):)/i).filter((t) => t.trim().length > 10);
  const rawList = entries.map((entry) => {
    const lines = entry.split('\n').map((l) => l.trim()).filter(Boolean);
    let title = '';
    let releaseDate = '';
    let storyline = '';
    let poster = '';
    let imdbRating = '';
    let language = '';
    let quality = '';
    let resolution = '';
    let type = 'Movie';
    const categories: string[] = [];
    const genre: string[] = [];
    const cast: string[] = [];
    const screenshots: string[] = [];
    const downloadLinks: any[] = [];

    // Simple line matching
    for (const line of lines) {
      if (/^(?:Title|Movie|মুভির নাম|নাম)\s*[:：]/i.test(line)) {
        title = line.replace(/^(?:Title|Movie|মুভির নাম|নাম)\s*[:：]\s*/i, '').trim();
      } else if (!title && /(?:19\d\d|20\d\d)/.test(line) && line.length < 100) {
        title = line.split(/(?:1080p|720p|480p|WEB-DL|BluRay|HDRip)/i)[0].trim();
      }

      if (/^(?:Year|Release Date|সাল|তারিখ)\s*[:：]/i.test(line)) {
        releaseDate = line.replace(/^(?:Year|Release Date|সাল|তারিখ)\s*[:：]\s*/i, '').trim();
      } else if (!releaseDate) {
        const ym = line.match(/\b(19\d\d|20\d\d)\b/);
        if (ym) releaseDate = ym[1];
      }

      if (/^(?:Storyline|Story|কাহিনী|বিবরণ)\s*[:：]/i.test(line)) {
        storyline = line.replace(/^(?:Storyline|Story|কাহিনী|বিবরণ)\s*[:：]\s*/i, '').trim();
      }

      if (/^(?:Poster|পোস্টার)\s*[:：]?/i.test(line) || (/https?:\/\/[^\s]+(?:\.jpg|\.png|\.webp|media-amazon|postimg)/i.test(line) && !poster)) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/i);
        if (urlMatch) poster = urlMatch[0];
      }

      if (/^(?:IMDb|Rating|রেটিং)\s*[:：]/i.test(line)) {
        imdbRating = line.replace(/^(?:IMDb|Rating|রেটিং)\s*[:：]\s*/i, '').trim();
      }

      if (/^(?:Language|ভাষা)\s*[:：]/i.test(line)) {
        language = line.replace(/^(?:Language|ভাষা)\s*[:：]\s*/i, '').trim();
      }

      if (/^(?:Quality|কোয়ালিটি)\s*[:：]/i.test(line)) {
        quality = line.replace(/^(?:Quality|কোয়ালিটি)\s*[:：]\s*/i, '').trim();
      }

      if (/^(?:Resolution|রেজোলিউশন)\s*[:：]/i.test(line)) {
        resolution = line.replace(/^(?:Resolution|রেজোলিউশন)\s*[:：]\s*/i, '').trim();
      }

      if (/^(?:Type|ধরন)\s*[:：]/i.test(line)) {
        type = line.replace(/^(?:Type|ধরন)\s*[:：]\s*/i, '').trim();
      } else if (/series|সিজন|season|episode/i.test(entry)) {
        type = 'Web Series';
      }

      if (/^(?:Genre|জনরা)\s*[:：]/i.test(line)) {
        const gStr = line.replace(/^(?:Genre|জনরা)\s*[:：]\s*/i, '');
        gStr.split(/[,/|]/).forEach((g) => {
          if (g.trim()) genre.push(g.trim());
        });
      }

      if (/^(?:Cast|অভিনয়ে|Starring)\s*[:：]/i.test(line)) {
        const cStr = line.replace(/^(?:Cast|অভিনয়ে|Starring)\s*[:：]\s*/i, '');
        cStr.split(/[,/|]/).forEach((c) => {
          if (c.trim()) cast.push(c.trim());
        });
      }

      // Screenshots
      if (/(?:screenshot|স্ক্রিনশট)/i.test(line) || (line.includes('postimg.cc') || line.includes('ibb.co'))) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/i);
        if (urlMatch && urlMatch[0] !== poster) {
          screenshots.push(urlMatch[0]);
        }
      }

      // Links
      if (/(?:hubcloud|pixeldrain|drive\.google|mega\.nz|download|http)/i.test(line) && line.includes('http')) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/i);
        if (urlMatch && urlMatch[0] !== poster && !screenshots.includes(urlMatch[0])) {
          let q = 'HD';
          if (/480p/i.test(line)) q = '480p';
          else if (/720p/i.test(line)) q = '720p';
          else if (/1080p/i.test(line)) q = '1080p';
          else if (/4k|2160p/i.test(line)) q = '4K';

          let size = '';
          const szMatch = line.match(/\[?(\d+(?:\.\d+)?\s*(?:MB|GB))\]?/i);
          if (szMatch) size = szMatch[1];

          downloadLinks.push({
            quality: q,
            size,
            url: urlMatch[0],
            label: `${q} ${size}`.trim() || q,
          });
        }
      }
    }

    // Category detection
    if (/hindi/i.test(entry)) categories.push('HINDI MOVIE');
    if (/south|tamil|telugu|kannada|malayalam/i.test(entry)) categories.push('SOUTH MOVIE');
    if (/bangla|বাংলা/i.test(entry)) categories.push('BANGLA');
    if (/series|season|episode/i.test(entry)) {
      categories.push('WEB SERIES');
      categories.push('SERIES');
    }
    if (/dual audio/i.test(entry)) categories.push('DUAL AUDIO');
    if (/multi audio/i.test(entry)) categories.push('MULTI AUDIO');
    if (/18\+|adult/i.test(entry)) categories.push('18+ ADULTS');
    if (/horror/i.test(entry)) categories.push('HORROR MOVIE');
    if (/animation|anime/i.test(entry)) categories.push('ANIMATION');
    if (!categories.includes('ALL MOVIES')) categories.push('ALL MOVIES');

    return {
      title: title || 'Parsed Movie Entry',
      releaseDate,
      storyline,
      poster,
      imdbRating,
      language,
      quality,
      resolution,
      type,
      categories,
      genre,
      cast,
      screenshots,
      downloadLinks,
    };
  });

  return rawList.length > 0 ? rawList : [{ title: 'Movie Item', categories: ['ALL MOVIES'] }];
}

// Core Gemini Parse Endpoint
app.post('/api/parse-movies', async (req, res) => {
  try {
    const { rawText, selectedCategories } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Input text is empty. Please paste movie or series information into the text box.',
      });
    }

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      // Graceful fallback with clear guidance
      console.warn('GEMINI_API_KEY not set. Using built-in heuristic parser fallback.');
      const fallbackList = heuristicParse(rawText);
      const normalized = normalizeMoviesBatch(fallbackList);
      const validation = validateMoviesJson(normalized);

      return res.json({
        success: true,
        source: 'heuristic-fallback',
        warningNotice: 'Parsed using local engine because GEMINI_API_KEY is not configured in environment secrets.',
        count: normalized.length,
        movies: normalized,
        validation,
      });
    }

    const ai = getGeminiClient(apiKey);

    const systemInstruction = `You are an elite, strict movie and web-series information extractor for VORVIXA.
Your task is to take raw, unformatted, mixed-language text (English, Bengali/বাংলা, or Banglish) and extract complete movie or web-series records.

ALLOWED CATEGORIES (Pick only from this exact list of 16 categories):
${SUPPORTED_CATEGORIES.map((c) => `- "${c}"`).join('\n')}

STRICT EXTRACTION RULES:
1. Detect multiple movies/series if present in the text. Return a JSON array containing one object per movie/series.
2. Never invent or hallucinate information. If any field is not explicitly present or inferable from the raw text, use an empty string "" or empty array [].
3. Never invent fake download links, fake cast names, fake ratings, or fake URLs.
4. Categorization:
   - "categories": array of valid categories chosen strictly from the allowed list above. Include "ALL MOVIES" by default if applicable.
   - "category": primary category string (e.g. "HINDI MOVIE", "BANGLA DUBBED", "WEB SERIES").
5. URL Classification:
   - "poster": single main poster image URL (e.g. IMDb/TMDB image, main promotional banner, imgbb/postimg poster).
   - "screenshots": array of image URLs showing movie preview scenes or screenshots.
   - "downloadLinks": array of download items. Each item MUST have EXACTLY:
     {"quality": "string", "size": "string", "url": "string", "label": "string"}
   - Do NOT confuse poster URL with screenshots or download links.
6. IDs: Generate a clean, URL-friendly slug id (e.g., "pathaan-2023", "toofan-2024", "mirzapur-s03-2024").
7. Legacy Flag Rules:
   - "pinned", "isPinned", "pin", "is_pinned": must all be false by default unless specifically asked.
   - "featured", "isFeatured": must both be false by default.
   - "recent", "isRecent": must both be false by default.
   - "views": string (default "").
8. Output MUST be a strictly valid JSON array of objects.`;

    const userPrompt = `Parse the following raw movie/series text into a JSON array of movie objects according to the VORVIXA schema.
${selectedCategories && selectedCategories.length ? `User preferred categories if relevant: ${selectedCategories.join(', ')}` : ''}

RAW INPUT:
"""
${rawText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';

    let parsedJson: any;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (parseError: any) {
      console.error('Failed to parse Gemini output as JSON:', responseText);
      // Attempt to extract JSON array via regex
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        parsedJson = JSON.parse(match[0]);
      } else {
        throw new Error('Gemini returned non-JSON text. Please try again.');
      }
    }

    // Normalize through strict engine
    const normalizedMovies = normalizeMoviesBatch(parsedJson);

    // Validate schema
    const validation = validateMoviesJson(normalizedMovies);

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      count: normalizedMovies.length,
      movies: normalizedMovies,
      validation,
    });
  } catch (error: any) {
    console.error('Error during /api/parse-movies:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'An unexpected error occurred while parsing movies with Gemini AI.',
    });
  }
});

// Setup Vite in Dev or Static files in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VORVIXA Server] Running on http://localhost:${PORT} in ${isProd ? 'production' : 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('[VORVIXA Server] Failed to start:', err);
  process.exit(1);
});
