/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Upload,
  Layers,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { MovieItem } from '../types/movie';
import { normalizeMoviesBatch } from '../utils/normalizer';

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newMovies: MovieItem[];
  onMergeComplete: (merged: MovieItem[]) => void;
  language: 'en' | 'bn' | 'dual';
}

export const MergeModal: React.FC<MergeModalProps> = ({
  isOpen,
  onClose,
  newMovies,
  onMergeComplete,
  language,
}) => {
  if (!isOpen) return null;

  const [existingJsonText, setExistingJsonText] = useState('');
  const [parsedExisting, setParsedExisting] = useState<MovieItem[] | null>(null);
  const [duplicateIds, setDuplicateIds] = useState<string[]>([]);
  const [resolutionStrategy, setResolutionStrategy] = useState<
    'replace' | 'skip' | 'rename'
  >('rename');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setExistingJsonText(content);
      processExistingText(content);
    };
    reader.readAsText(file);
  };

  const processExistingText = (text: string) => {
    setErrorMsg(null);
    try {
      if (!text.trim()) {
        setParsedExisting(null);
        setDuplicateIds([]);
        return;
      }

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setErrorMsg('The existing JSON must be an array of movie objects [ ... ].');
        setParsedExisting(null);
        return;
      }

      const normalizedExisting = normalizeMoviesBatch(parsed);
      setParsedExisting(normalizedExisting);

      // Find collisions with newMovies
      const existingIdSet = new Set(normalizedExisting.map((m) => m.id));
      const collisions = newMovies
        .map((m) => m.id)
        .filter((id) => existingIdSet.has(id));

      setDuplicateIds(collisions);
    } catch (err: any) {
      setErrorMsg(`JSON Parse Error: ${err.message}`);
      setParsedExisting(null);
      setDuplicateIds([]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setExistingJsonText(val);
    processExistingText(val);
  };

  const handleExecuteMerge = () => {
    if (!parsedExisting) return;

    let finalMerged: MovieItem[] = [];

    if (duplicateIds.length === 0) {
      // No collisions, simply append
      finalMerged = [...parsedExisting, ...newMovies];
    } else {
      if (resolutionStrategy === 'replace') {
        // Remove existing items that have colliding IDs, then append new ones
        const collidingSet = new Set(duplicateIds);
        const filteredExisting = parsedExisting.filter(
          (m) => !collidingSet.has(m.id)
        );
        finalMerged = [...filteredExisting, ...newMovies];
      } else if (resolutionStrategy === 'skip') {
        // Keep existing, ignore new movies that have colliding IDs
        const collidingSet = new Set(duplicateIds);
        const filteredNew = newMovies.filter((m) => !collidingSet.has(m.id));
        finalMerged = [...parsedExisting, ...filteredNew];
      } else if (resolutionStrategy === 'rename') {
        // Rename colliding new IDs with suffix
        const existingIdSet = new Set(parsedExisting.map((m) => m.id));
        const renamedNew = newMovies.map((movie) => {
          if (existingIdSet.has(movie.id)) {
            let uniqueId = `${movie.id}-new`;
            let c = 2;
            while (existingIdSet.has(uniqueId)) {
              uniqueId = `${movie.id}-${c}`;
              c++;
            }
            existingIdSet.add(uniqueId);
            return { ...movie, id: uniqueId };
          }
          return movie;
        });
        finalMerged = [...parsedExisting, ...renamedNew];
      }
    }

    onMergeComplete(finalMerged);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn'
                  ? 'পূর্ববর্তী movies.json ফাইলের সাথে মার্জ করুন'
                  : 'Merge with Existing Website movies.json'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'আপনার বিদ্যমান ডাটা অক্ষত রেখে নতুন মুভি যোগ করুন'
                  : 'Preserve all existing website records while appending newly parsed movies'}
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl p-4 text-center bg-slate-950/50 transition">
            <input
              type="file"
              accept=".json"
              id="existing-json-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="existing-json-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <Upload className="w-7 h-7 text-amber-400" />
              <div className="text-xs">
                <span className="font-bold text-white hover:underline">
                  Click to upload existing movies.json
                </span>
                <span className="text-slate-500 block">or paste content below</span>
              </div>
            </label>
          </div>

          {/* Paste Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Paste existing movies.json content:
              </label>
              {parsedExisting && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{parsedExisting.length} existing records loaded</span>
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={existingJsonText}
              onChange={handleTextChange}
              placeholder="[ { &quot;id&quot;: &quot;...&quot;, &quot;title&quot;: &quot;...&quot; } ]"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Duplicate ID Collision Handling */}
          {parsedExisting && duplicateIds.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    Duplicate IDs Detected ({duplicateIds.length})
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    The following IDs exist in both your website file and new batch:{' '}
                    <span className="font-mono text-amber-400 font-bold">
                      {duplicateIds.slice(0, 4).join(', ')}
                      {duplicateIds.length > 4 ? ` and ${duplicateIds.length - 4} more` : ''}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-500/20">
                <span className="text-xs font-bold text-slate-200 block mb-2">
                  Choose resolution strategy:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionStrategy('rename')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition ${
                      resolutionStrategy === 'rename'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>Auto-Rename New ID</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      Keep both (e.g. id-new)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResolutionStrategy('replace')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition ${
                      resolutionStrategy === 'replace'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>Overwrite Existing</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      Replace with new entries
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResolutionStrategy('skip')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition ${
                      resolutionStrategy === 'skip'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>Keep Existing (Skip)</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      Do not touch old movies
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Merge Preview Summary */}
          {parsedExisting && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">
                Existing: <b className="text-white">{parsedExisting.length}</b> + New:{' '}
                <b className="text-amber-400">{newMovies.length}</b>
              </span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span>Final Output:</span>
                <span>
                  {resolutionStrategy === 'skip'
                    ? parsedExisting.length + newMovies.length - duplicateIds.length
                    : resolutionStrategy === 'replace'
                    ? parsedExisting.length + newMovies.length - duplicateIds.length
                    : parsedExisting.length + newMovies.length}{' '}
                  records
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteMerge}
            disabled={!parsedExisting || parsedExisting.length === 0}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              parsedExisting && parsedExisting.length > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-lg'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Execute Merge & Update</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
