/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Film,
  Star,
  Pin,
  Flame,
  Clock,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Download,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { MovieItem } from '../types/movie';

interface MovieCardProps {
  movie: MovieItem;
  index: number;
  onUpdate: (updated: MovieItem) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  language: 'en' | 'bn' | 'dual';
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  index,
  onUpdate,
  onEdit,
  onDelete,
  onDuplicate,
  language,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showStoryline, setShowStoryline] = useState(false);
  const [copiedLinkIdx, setCopiedLinkIdx] = useState<number | null>(null);

  // Toggle all 4 pin flags in sync
  const togglePin = () => {
    const newVal = !movie.pinned;
    onUpdate({
      ...movie,
      pinned: newVal,
      isPinned: newVal,
      pin: newVal,
      is_pinned: newVal,
    });
  };

  // Toggle both featured flags in sync
  const toggleFeatured = () => {
    const newVal = !movie.featured;
    onUpdate({
      ...movie,
      featured: newVal,
      isFeatured: newVal,
    });
  };

  // Toggle both recent flags in sync
  const toggleRecent = () => {
    const newVal = !movie.recent;
    onUpdate({
      ...movie,
      recent: newVal,
      isRecent: newVal,
    });
  };

  const handleCopyLink = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkIdx(idx);
    setTimeout(() => setCopiedLinkIdx(null), 1800);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition shadow-lg flex flex-col">
      {/* Top Bar with Number & Quick Actions */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center justify-center">
            #{index + 1}
          </span>
          <span className="font-mono text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[260px]">
            id: <span className="text-amber-300 font-semibold">{movie.id || 'missing-id'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs transition"
            title="Edit Movie Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 text-xs transition"
            title="Duplicate Entry"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 text-xs transition"
            title="Delete from batch"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col md:flex-row gap-5">
        {/* Left: Poster Column */}
        <div className="w-full md:w-36 flex-shrink-0 flex flex-col items-center">
          <div className="w-full aspect-[2/3] max-w-[160px] md:max-w-none rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group shadow-md">
            {movie.poster && !imageError ? (
              <img
                src={movie.poster}
                alt={movie.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center">
                <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                <span className="text-[10px] font-medium text-slate-500">
                  {movie.poster ? 'Image broken' : 'No Poster URL'}
                </span>
              </div>
            )}

            {/* Quality pill overlay */}
            {movie.resolution && (
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {movie.resolution}
              </span>
            )}
          </div>

          {/* Quick toggle flags underneath poster */}
          <div className="w-full grid grid-cols-3 gap-1 mt-3">
            {/* Pinned switch */}
            <button
              onClick={togglePin}
              className={`p-1.5 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-0.5 border ${
                movie.pinned
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Pinned (keeps pinned, isPinned, pin, is_pinned in sync)"
            >
              <Pin className="w-3 h-3" />
              <span>Pin</span>
            </button>

            {/* Featured switch */}
            <button
              onClick={toggleFeatured}
              className={`p-1.5 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-0.5 border ${
                movie.featured
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Featured (keeps featured, isFeatured in sync)"
            >
              <Flame className="w-3 h-3" />
              <span>Feat</span>
            </button>

            {/* Recent switch */}
            <button
              onClick={toggleRecent}
              className={`p-1.5 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-0.5 border ${
                movie.recent
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Recent (keeps recent, isRecent in sync)"
            >
              <Clock className="w-3 h-3" />
              <span>Recent</span>
            </button>
          </div>
        </div>

        {/* Right: Details Column */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {movie.title || <span className="text-rose-400 italic">Untitled Movie</span>}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-400">
                  {movie.releaseDate && (
                    <span className="font-semibold text-slate-300">{movie.releaseDate}</span>
                  )}
                  {movie.type && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {movie.type}
                      </span>
                    </>
                  )}
                  {movie.language && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300">{movie.language}</span>
                    </>
                  )}
                  {movie.quality && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">{movie.quality}</span>
                    </>
                  )}
                </div>
              </div>

              {/* IMDb Rating Badge */}
              {movie.imdbRating && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold self-start">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.imdbRating}</span>
                </div>
              )}
            </div>

            {/* Categories & Genre */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {movie.categories && movie.categories.length > 0 ? (
                movie.categories.map((cat, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold tracking-wide"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic">No categories assigned</span>
              )}

              {movie.genre &&
                movie.genre.map((g, gIdx) => (
                  <span
                    key={gIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]"
                  >
                    {g}
                  </span>
                ))}
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-3 text-xs">
                <span className="text-slate-500 font-medium mr-1.5">Cast:</span>
                <span className="text-slate-300">{movie.cast.join(', ')}</span>
              </div>
            )}

            {/* Storyline */}
            {movie.storyline && (
              <div className="mt-2.5 text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Storyline
                  </span>
                  <button
                    onClick={() => setShowStoryline(!showStoryline)}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>{showStoryline ? 'Show Less' : 'Read Full'}</span>
                    {showStoryline ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className={showStoryline ? '' : 'line-clamp-2'}>{movie.storyline}</p>
              </div>
            )}

            {/* Screenshots preview strip */}
            {movie.screenshots && movie.screenshots.length > 0 && (
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Screenshots ({movie.screenshots.length})
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {movie.screenshots.map((sUrl, sIdx) => (
                    <a
                      key={sIdx}
                      href={sUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500 transition group relative"
                    >
                      <img
                        src={sUrl}
                        alt={`Screenshot ${sIdx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <ExternalLink className="w-3 h-3 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Download Links Section */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Links ({movie.downloadLinks?.length || 0})</span>
              </span>
              {movie.downloadLinks?.length === 0 && (
                <span className="text-[11px] text-amber-400/80 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No download links provided</span>
                </span>
              )}
            </div>

            {movie.downloadLinks && movie.downloadLinks.length > 0 ? (
              <div className="space-y-1.5">
                {movie.downloadLinks.map((link, lIdx) => (
                  <div
                    key={lIdx}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase">
                        {link.quality || 'Link'}
                      </span>
                      {link.size && (
                        <span className="text-slate-400 text-[11px] font-medium font-mono">
                          {link.size}
                        </span>
                      )}
                      <span className="text-slate-300 font-medium truncate text-xs">
                        {link.label || link.url}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleCopyLink(link.url, lIdx)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                        title="Copy direct URL"
                      >
                        {copiedLinkIdx === lIdx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {link.url && (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                          title="Open URL in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
