/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flame,
  Tv,
  Film,
  Layers,
  Check,
} from 'lucide-react';
import { SUPPORTED_CATEGORIES, SAMPLES } from '../constants/categories';

interface RawInputSectionProps {
  rawText: string;
  setRawText: (text: string) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onGenerate: () => void;
  isLoading: boolean;
  language: 'en' | 'bn' | 'dual';
}

export const RawInputSection: React.FC<RawInputSectionProps> = ({
  rawText,
  setRawText,
  selectedCategories,
  setSelectedCategories,
  onGenerate,
  isLoading,
  language,
}) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [activeSample, setActiveSample] = useState<string | null>(null);

  const characterCount = rawText.length;
  const lineCount = rawText ? rawText.split('\n').length : 0;

  const handleSelectSample = (key: keyof typeof SAMPLES, label: string) => {
    setRawText(SAMPLES[key]);
    setActiveSample(label);
  };

  const handleClear = () => {
    setRawText('');
    setActiveSample(null);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories([...SUPPORTED_CATEGORIES]);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>INSTANT RAW TEXT PARSER</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn'
              ? 'একটি বক্সে পুরো মুভি বা ওয়েব সিরিজের তথ্য পেস্ট করুন (বাংলা ও ইংরেজি উভয়ই সমর্থিত)'
              : language === 'dual'
              ? 'One-Box Smart Parser • এক বক্সে যেকোনো ফরম্যাটের মুভি ডেটা পেস্ট করুন'
              : 'Paste movie or web-series details in any format. Single or batch entries supported.'}
          </p>
        </div>

        {/* Quick action bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample Presets Dropdown / Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              {language === 'bn' ? 'নমুনা:' : 'Samples:'}
            </span>
            <button
              onClick={() => handleSelectSample('singleBollywood', 'Pathaan')}
              className={`px-2.5 py-1.2 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                activeSample === 'Pathaan'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Pathaan (Single)</span>
            </button>

            <button
              onClick={() => handleSelectSample('bengaliMovie', 'Toofan')}
              className={`px-2.5 py-1.2 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                activeSample === 'Toofan'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>তুফান (বাংলা)</span>
            </button>

            <button
              onClick={() => handleSelectSample('webSeries', 'Mirzapur')}
              className={`px-2.5 py-1.2 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                activeSample === 'Mirzapur'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-blue-400" />
              <span>Mirzapur S3</span>
            </button>

            <button
              onClick={() => handleSelectSample('batchMulti', '3 Movies')}
              className={`px-2.5 py-1.2 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                activeSample === '3 Movies'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
              title="Batch of 3 Movies in 1 input (Jawan, Animal, Leo)"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Batch (3 in 1)</span>
            </button>
          </div>

          {/* Clear button */}
          {rawText && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1 transition"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Raw Textarea */}
      <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/90 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/50 transition shadow-inner">
        <textarea
          rows={11}
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setActiveSample(null);
          }}
          placeholder="Paste complete movie or web-series information here. Include title, year, type, genre, language, poster URL, cast, storyline, screenshots, download links, quality, release date, IMDb rating, and other available information."
          className="w-full bg-transparent p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono-code resize-y leading-relaxed"
          disabled={isLoading}
        />

        {/* Footer info inside textarea container */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-4">
            <span>
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </span>
            <span>•</span>
            <span>{characterCount.toLocaleString()} characters</span>
            {characterCount > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-amber-400/90">
                  Ready for AI extraction
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 hidden sm:inline">
              EN + বাংলা Auto-detect
            </span>
          </div>
        </div>
      </div>

      {/* Category selector drawer toggle */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'bn'
                ? 'ক্যাটাগরি ফিল্টার / নির্দেশিকা (১৬টি বিভাগ)'
                : 'Category Guidelines & Pre-filter (16 Categories)'}
            </span>
            {selectedCategories.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40">
                {selectedCategories.length} selected
              </span>
            )}
            {showCategoryPicker ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            {language === 'bn'
              ? 'AI স্বয়ংক্রিয়ভাবে প্রাসঙ্গিক ক্যাটাগরি শনাক্ত করবে'
              : 'Gemini AI will intelligently detect categories if left unselected'}
          </span>
        </div>

        {/* Collapsible Category Badges */}
        {showCategoryPicker && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-slate-400 font-medium">
                {language === 'bn'
                  ? 'আপনার ওয়েবসাইটে সমর্থিত ১৬টি অফিসিয়াল ক্যাটাগরি:'
                  : 'Select categories to prefer or leave empty for 100% automated detection:'}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllCategories}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Select All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={clearCategories}
                  className="text-slate-400 hover:underline text-[11px]"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Generate Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2 w-full sm:w-auto">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>
            {language === 'bn'
              ? 'জেনারেট বাটনে ক্লিক করলেই মুহূর্তের মধ্যে movies.json প্রস্তুত হবে'
              : 'Click Generate to automatically extract and validate schema'}
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || !rawText.trim()}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg ${
            isLoading || !rawText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>
                {language === 'bn' ? 'AI বিশ্লেষণ করছে...' : 'Gemini AI Parsing...'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span className="text-slate-950">
                {language === 'bn'
                  ? 'JSON জেনারেট করুন'
                  : language === 'dual'
                  ? 'GENERATE JSON • জেনারেট করুন'
                  : 'GENERATE JSON'}
              </span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
