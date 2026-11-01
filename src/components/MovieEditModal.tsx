/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Film,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Star,
  Pin,
  Flame,
  Clock,
} from 'lucide-react';
import { MovieItem, MovieDownloadLink } from '../types/movie';
import { SUPPORTED_CATEGORIES } from '../constants/categories';
import { generateMovieId } from '../utils/normalizer';

interface MovieEditModalProps {
  movie: MovieItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: MovieItem) => void;
  language: 'en' | 'bn' | 'dual';
}

export const MovieEditModal: React.FC<MovieEditModalProps> = ({
  movie,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<MovieItem>({
    ...movie,
    categories: [...(movie.categories || [])],
    genre: [...(movie.genre || [])],
    cast: [...(movie.cast || [])],
    screenshots: [...(movie.screenshots || [])],
    downloadLinks: (movie.downloadLinks || []).map((l) => ({ ...l })),
  });

  const [genreInput, setGenreInput] = useState(formData.genre.join(', '));
  const [castInput, setCastInput] = useState(formData.cast.join(', '));
  const [screenshotsInput, setScreenshotsInput] = useState(formData.screenshots.join('\n'));

  // Sync Pin switches
  const handlePinChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      pinned: checked,
      isPinned: checked,
      pin: checked,
      is_pinned: checked,
    }));
  };

  // Sync Featured switches
  const handleFeaturedChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
      isFeatured: checked,
    }));
  };

  // Sync Recent switches
  const handleRecentChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      recent: checked,
      isRecent: checked,
    }));
  };

  const handleRegenerateId = () => {
    const newId = generateMovieId(formData.title, formData.releaseDate);
    setFormData((prev) => ({ ...prev, id: newId }));
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      const updatedCats = exists
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      const primary = updatedCats.length > 0 ? updatedCats[0] : '';
      return {
        ...prev,
        categories: updatedCats,
        category: primary,
      };
    });
  };

  // Download links handlers
  const handleAddDownloadLink = () => {
    const newLink: MovieDownloadLink = {
      quality: '720p',
      size: '1.2GB',
      url: '',
      label: '720p HD',
    };
    setFormData((prev) => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, newLink],
    }));
  };

  const handleUpdateDownloadLink = (
    index: number,
    field: keyof MovieDownloadLink,
    value: string
  ) => {
    setFormData((prev) => {
      const links = [...prev.downloadLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, downloadLinks: links };
    });
  };

  const handleRemoveDownloadLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedGenre = genreInput
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    const parsedCast = castInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const parsedScreenshots = screenshotsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedMovie: MovieItem = {
      ...formData,
      genre: parsedGenre,
      cast: parsedCast,
      screenshots: parsedScreenshots,
      category: formData.categories[0] || formData.category || '',
    };

    onSave(updatedMovie);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'মুভির তথ্য সম্পাদনা করুন' : 'Edit Movie Information'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'ফিল্ডগুলো পরিবর্তন করুন, স্কিমা সর্বদা বজায় থাকবে'
                  : 'Modifying item details while strictly enforcing schema compatibility'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Title & ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Movie Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                placeholder="e.g. Pathaan, তুফান"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Movie ID (Slug) <span className="text-amber-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Auto-Slug</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                placeholder="e.g. pathaan-2023"
              />
            </div>
          </div>

          {/* Synchronized Booleans & Views */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Synchronized Boolean Flags (স্কিমার নিয়ম অনুযায়ী একযোগে সিঙ্ক)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pin Switch */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => handlePinChange(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pinned Status</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Syncs: pinned, isPinned, pin, is_pinned
                  </span>
                </div>
              </label>

              {/* Featured Switch */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-orange-500/50 transition">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleFeaturedChange(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Featured Status</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Syncs: featured, isFeatured
                  </span>
                </div>
              </label>

              {/* Recent Switch */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-blue-500/50 transition">
                <input
                  type="checkbox"
                  checked={formData.recent}
                  onChange={(e) => handleRecentChange(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recent Status</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Syncs: recent, isRecent
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Categories Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Assigned Categories (১৬টি অনুমোদিত ক্যাটাগরি থেকে নির্বাচন করুন)
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              {SUPPORTED_CATEGORIES.map((cat) => {
                const isSelected = formData.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media Info: Poster & IMDb */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Poster Image URL
              </label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                IMDb Rating
              </label>
              <input
                type="text"
                value={formData.imdbRating}
                onChange={(e) => setFormData({ ...formData, imdbRating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                placeholder="e.g. 7.5/10"
              />
            </div>
          </div>

          {/* Secondary Details: Type, Language, Quality, Resolution, ReleaseDate, Views */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="Movie / Series"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="Hindi / Bangla"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Quality
              </label>
              <input
                type="text"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="WEB-DL / HDRip"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Resolution
              </label>
              <input
                type="text"
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="1080p, 720p"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Release Date
              </label>
              <input
                type="text"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="2023 / 12 Jan"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Views (String)
              </label>
              <input
                type="text"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                placeholder='"" or "1500"'
              />
            </div>
          </div>

          {/* Genre & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Genre (Comma-separated)
              </label>
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                placeholder="Action, Thriller, Crime"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Cast (Comma-separated)
              </label>
              <input
                type="text"
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                placeholder="Shah Rukh Khan, Deepika Padukone"
              />
            </div>
          </div>

          {/* Storyline */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Storyline / কাহিনী
            </label>
            <textarea
              rows={3}
              value={formData.storyline}
              onChange={(e) => setFormData({ ...formData, storyline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              placeholder="Movie synopsis or description..."
            />
          </div>

          {/* Screenshots URLs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Screenshots (One URL per line)
            </label>
            <textarea
              rows={2}
              value={screenshotsInput}
              onChange={(e) => setScreenshotsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              placeholder="https://i.postimg.cc/image1.jpg&#10;https://i.postimg.cc/image2.jpg"
            />
          </div>

          {/* Download Links Table */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Download Links ({formData.downloadLinks.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  Strict schema fields: quality, size, url, label
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddDownloadLink}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1 hover:bg-amber-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            {formData.downloadLinks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No download links added yet. Click &quot;Add Link&quot; to append a link.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.downloadLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Quality"
                        value={link.quality}
                        onChange={(e) =>
                          handleUpdateDownloadLink(idx, 'quality', e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Size"
                        value={link.size}
                        onChange={(e) =>
                          handleUpdateDownloadLink(idx, 'size', e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Label"
                        value={link.label}
                        onChange={(e) =>
                          handleUpdateDownloadLink(idx, 'label', e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) =>
                          handleUpdateDownloadLink(idx, 'url', e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveDownloadLink(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
