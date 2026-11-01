/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutGrid,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Download,
  Layers,
  Plus,
  Trash2,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { MovieItem, ValidationReportData } from '../types/movie';
import { MovieCard } from './MovieCard';
import { JsonViewer } from './JsonViewer';
import { ValidationReport } from './ValidationReport';
import { MovieEditModal } from './MovieEditModal';
import { MergeModal } from './MergeModal';
import { DEFAULT_MOVIE } from '../constants/categories';

interface ResultsSectionProps {
  movies: MovieItem[];
  setMovies: React.Dispatch<React.SetStateAction<MovieItem[]>>;
  validation: ValidationReportData;
  onClear: () => void;
  language: 'en' | 'bn' | 'dual';
  warningNotice?: string;
  sourceEngine?: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  movies,
  setMovies,
  validation,
  onClear,
  language,
  warningNotice,
  sourceEngine,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'json' | 'validator'>('cards');
  const [editingMovieIndex, setEditingMovieIndex] = useState<number | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Update a single movie item
  const handleUpdateMovie = (index: number, updated: MovieItem) => {
    setMovies((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  // Delete a movie
  const handleDeleteMovie = (index: number) => {
    setMovies((prev) => prev.filter((_, i) => i !== index));
  };

  // Duplicate a movie
  const handleDuplicateMovie = (index: number) => {
    setMovies((prev) => {
      const target = prev[index];
      const duplicated: MovieItem = {
        ...target,
        id: `${target.id}-copy`,
        title: `${target.title} (Copy)`,
      };
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicated);
      return copy;
    });
  };

  // Add new blank movie
  const handleAddBlankMovie = () => {
    const newMovie: MovieItem = {
      ...DEFAULT_MOVIE,
      id: `new-movie-${Date.now()}`,
      title: 'New Movie Title',
    };
    setMovies((prev) => [newMovie, ...prev]);
    setEditingMovieIndex(0);
  };

  // Copy all JSON to clipboard
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(movies, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download movies.json file
  const handleDownloadFile = () => {
    const jsonStr = JSON.stringify(movies, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'movies.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-8 space-y-4">
      {/* Notice Banner if offline fallback was used */}
      {warningNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{warningNotice}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
            {sourceEngine || 'Heuristic'}
          </span>
        </div>
      )}

      {/* Main Results Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        {/* Left: Summary Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="h-8 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}
              </span>
            </span>
          </div>

          {/* Validation Status Pill */}
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              validation.isValid
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            {validation.isValid ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'bn' ? 'স্কিমা ১০০% সঠিক' : 'Schema 100% Valid'}
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {validation.errorCount} {validation.errorCount === 1 ? 'Error' : 'Errors'}
                </span>
              </>
            )}
          </button>

          {/* Tab Switchers */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'cards'
                  ? 'bg-slate-800 text-amber-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কার্ড ভিউ' : 'Visual Cards'}</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-slate-800 text-amber-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'JSON ভিউ' : 'Raw JSON'}</span>
            </button>

            <button
              onClick={() => setActiveTab('validator')}
              className={`px-3 py-1.2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'validator'
                  ? 'bg-slate-800 text-amber-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ভ্যালিডেশন' : 'Validation Report'}</span>
            </button>
          </div>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Merge with existing button */}
          <button
            onClick={() => setIsMergeModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            title="Merge with existing website movies.json"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'মার্জ করুন' : 'Merge with Existing'}
            </span>
            <span className="sm:hidden">Merge</span>
          </button>

          {/* Add blank movie */}
          <button
            onClick={handleAddBlankMovie}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            title="Add another movie entry manually"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>

          {/* Copy JSON Button */}
          <button
            onClick={handleCopyJson}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              copiedAll
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কপি JSON' : 'Copy JSON'}</span>
              </>
            )}
          </button>

          {/* Download movies.json Button */}
          <button
            onClick={handleDownloadFile}
            disabled={!validation.isValid}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition flex items-center gap-2 shadow-lg ${
              validation.isValid
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
            }`}
            title={
              validation.isValid
                ? 'Download UTF-8 encoded movies.json'
                : 'Fix validation errors before downloading'
            }
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>
              {language === 'bn'
                ? 'movies.json ডাউনলোড'
                : language === 'dual'
                ? 'Download movies.json • ডাউনলোড'
                : 'Download movies.json'}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Visual Cards View */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          {movies.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500">
              <p>No movie records found. Paste raw text and click Generate JSON.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id || index}
                  movie={movie}
                  index={index}
                  onUpdate={(updated) => handleUpdateMovie(index, updated)}
                  onEdit={() => setEditingMovieIndex(index)}
                  onDelete={() => handleDeleteMovie(index)}
                  onDuplicate={() => handleDuplicateMovie(index)}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Raw JSON View */}
      {activeTab === 'json' && (
        <JsonViewer
          movies={movies}
          onUpdateMovies={setMovies}
          onDownload={handleDownloadFile}
          isValid={validation.isValid}
          language={language}
        />
      )}

      {/* Tab 3: Validation Report View */}
      {activeTab === 'validator' && (
        <ValidationReport
          report={validation}
          onSelectMovie={(idx) => {
            setActiveTab('cards');
            setEditingMovieIndex(idx);
          }}
          language={language}
        />
      )}

      {/* Movie Edit Modal Drawer */}
      {editingMovieIndex !== null && movies[editingMovieIndex] && (
        <MovieEditModal
          movie={movies[editingMovieIndex]}
          isOpen={editingMovieIndex !== null}
          onClose={() => setEditingMovieIndex(null)}
          onSave={(updated) => handleUpdateMovie(editingMovieIndex, updated)}
          language={language}
        />
      )}

      {/* Merge with Existing movies.json Modal */}
      <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        newMovies={movies}
        onMergeComplete={(merged) => {
          setMovies(merged);
        }}
        language={language}
      />
    </section>
  );
};
