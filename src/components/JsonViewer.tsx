/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Search,
  Minimize2,
  Maximize2,
  Edit2,
  Save,
  RotateCcw,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { MovieItem } from '../types/movie';
import { validateMoviesJson } from '../utils/validator';

interface JsonViewerProps {
  movies: MovieItem[];
  onUpdateMovies: (updated: MovieItem[]) => void;
  onDownload: () => void;
  isValid: boolean;
  language: 'en' | 'bn' | 'dual';
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  movies,
  onUpdateMovies,
  onDownload,
  isValid,
  language,
}) => {
  const [jsonString, setJsonString] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinified, setIsMinified] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setJsonString(JSON.stringify(movies, null, isMinified ? 0 : 2));
    }
  }, [movies, isMinified, isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMinify = () => {
    const nextState = !isMinified;
    setIsMinified(nextState);
    try {
      const parsed = JSON.parse(jsonString);
      setJsonString(JSON.stringify(parsed, null, nextState ? 0 : 2));
    } catch {
      // ignore
    }
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        setEditError('Root must be an array of movie objects [ ... ].');
        return;
      }
      onUpdateMovies(parsed);
      setIsEditing(false);
      setEditError(null);
    } catch (err: any) {
      setEditError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setJsonString(JSON.stringify(movies, null, isMinified ? 0 : 2));
    setIsEditing(false);
    setEditError(null);
  };

  const byteSize = new Blob([jsonString]).size;
  const formattedSize =
    byteSize < 1024
      ? `${byteSize} B`
      : `${(byteSize / 1024).toFixed(1)} KB`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Viewer Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-slate-200">
              movies.json
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
            {movies.length} {movies.length === 1 ? 'item' : 'items'} • {formattedSize}
          </span>
          {isValid ? (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Valid Schema</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Fix Issues</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box if not editing */}
          {!isEditing && (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search JSON..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-32 sm:w-40 font-mono"
              />
            </div>
          )}

          {/* Format / Minify */}
          <button
            onClick={toggleMinify}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            title={isMinified ? 'Beautify JSON (2 spaces)' : 'Minify JSON'}
          >
            {isMinified ? 'Format' : 'Minify'}
          </button>

          {/* Edit / Save toggles */}
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
              title="Edit raw JSON directly"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit</span>
            </button>
          )}

          {/* Copy JSON */}
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            disabled={!isValid}
            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow ${
              isValid
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
            title={
              isValid
                ? 'Download as movies.json'
                : 'Resolve schema errors before downloading'
            }
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download movies.json</span>
          </button>
        </div>
      </div>

      {/* Direct Edit Error Banner */}
      {editError && (
        <div className="p-2.5 bg-rose-500/10 border-b border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{editError}</span>
        </div>
      )}

      {/* Editor / Viewer Body */}
      <div className="p-4 bg-slate-950 font-mono-code text-xs text-slate-200 overflow-x-auto min-h-[380px] max-h-[600px] relative">
        {isEditing ? (
          <textarea
            value={jsonString}
            onChange={(e) => {
              setJsonString(e.target.value);
              setEditError(null);
            }}
            className="w-full h-[500px] bg-transparent text-amber-300 font-mono-code text-xs leading-relaxed focus:outline-none resize-y"
            spellCheck={false}
          />
        ) : (
          <pre className="whitespace-pre leading-relaxed select-text font-mono-code text-slate-300">
            {jsonString}
          </pre>
        )}
      </div>
    </div>
  );
};
