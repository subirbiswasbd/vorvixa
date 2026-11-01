/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Layers,
  CheckCircle2,
  Shield,
  HelpCircle,
  ArrowDown,
} from 'lucide-react';
import { MovieItem, ValidationReportData } from './types/movie';
import { validateMoviesJson } from './utils/validator';
import { Header } from './components/Header';
import { RawInputSection } from './components/RawInputSection';
import { ResultsSection } from './components/ResultsSection';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [rawText, setRawText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [validation, setValidation] = useState<ValidationReportData>({
    isValid: true,
    errorCount: 0,
    warningCount: 0,
    totalMovies: 0,
    issues: [],
    passedChecks: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [warningNotice, setWarningNotice] = useState<string | undefined>();
  const [sourceEngine, setSourceEngine] = useState<string | undefined>();
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; model: string }>({
    configured: true,
    model: 'gemini-3.8-flash',
  });
  const [language, setLanguage] = useState<'en' | 'bn' | 'dual'>('dual');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Check backend Gemini API status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/gemini/status');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({
            configured: Boolean(data.configured),
            model: data.model || 'gemini-3.8-flash',
          });
        }
      } catch (err) {
        console.warn('Status check failed:', err);
      }
    }
    checkStatus();
  }, []);

  // Re-run validation whenever the movies array changes
  useEffect(() => {
    if (movies.length > 0) {
      const report = validateMoviesJson(movies);
      setValidation(report);
    }
  }, [movies]);

  // Main Generate Handler
  const handleGenerate = async () => {
    if (!rawText.trim()) return;

    setIsLoading(true);
    setError(null);
    setWarningNotice(undefined);
    setLoadingStep(
      language === 'bn'
        ? 'Gemini AI টেক্সট বিশ্লেষণ করছে...'
        : 'Gemini AI parsing unformatted text...'
    );

    // Dynamic loading status simulation for smooth UX
    const timer1 = setTimeout(() => {
      setLoadingStep(
        language === 'bn'
          ? 'মুভি ও সিরিজ শনাক্ত করা হচ্ছে...'
          : 'Detecting movie & web-series titles...'
      );
    }, 900);

    const timer2 = setTimeout(() => {
      setLoadingStep(
        language === 'bn'
          ? 'ডাউনলোড লিংক ও রেজোলিউশন এক্সট্রাক্ট হচ্ছে...'
          : 'Extracting download links, quality & resolutions...'
      );
    }, 1800);

    const timer3 = setTimeout(() => {
      setLoadingStep(
        language === 'bn'
          ? '১৬টি ক্যাটাগরি ও স্কিমা রূপান্তর করা হচ্ছে...'
          : 'Mapping 16 categories & enforcing synchronized schema...'
      );
    }, 2800);

    try {
      const response = await fetch('/api/parse-movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse movies. Please check input text.');
      }

      setMovies(data.movies || []);
      setWarningNotice(data.warningNotice);
      setSourceEngine(data.source);

      // Validate
      const report = validateMoviesJson(data.movies || []);
      setValidation(report);

      // Smooth scroll down to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      console.error('Error generating movies.json:', err);
      setError(err?.message || 'Failed to connect to the parsing server.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setMovies([]);
    setRawText('');
    setError(null);
    setWarningNotice(undefined);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        apiStatus={apiStatus}
        language={language}
        setLanguage={setLanguage}
        onOpenHelp={() => setIsHelpOpen(true)}
        moviesCount={movies.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Branding Section */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 pt-2 pb-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VORVIXA Web Ecosystem • movies.json Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            AI-Powered Movie & Series{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              movies.json
            </span>{' '}
            Generator
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            {language === 'bn'
              ? 'একটিমাত্র টেক্সটবক্সে যেকোনো অগোছালো মুভি ও সিরিজের তথ্য পেস্ট করুন। জেমিনি এআই স্বয়ংক্রিয়ভাবে ১০০% নির্ভুল ও ওয়েবসাইট-সামঞ্জস্যপূর্ণ JSON তৈরি করবে।'
              : language === 'dual'
              ? 'Paste raw movie or series information into one box. Gemini AI extracts all metadata, links, and posters into a perfectly structured movies.json file ready for your website.'
              : 'Paste raw movie or series details into ONE box. Gemini AI automatically extracts titles, cast, posters, qualities, and links into a validated movies.json file.'}
          </p>
        </div>

        {/* Global Error Banner if any */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <b className="font-bold">Generation Error:</b> {error}
                <span className="block text-[11px] text-rose-400/80 mt-1">
                  Ensure the text contains recognizable movie details or try one of the sample buttons below.
                </span>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded hover:bg-rose-500/20"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Single Text Box Interface */}
        <RawInputSection
          rawText={rawText}
          setRawText={setRawText}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          language={language}
        />

        {/* Loading Progress State Display */}
        {isLoading && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Processing with Gemini 3.8 Flash...
                  </h4>
                  <p className="text-xs text-amber-300 font-medium">{loadingStep}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                AI Pipeline Active
              </span>
            </div>

            {/* Simulated Animated Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 w-3/4 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}

        {/* Section 2: Results, Inspector & Actions */}
        <div ref={resultsRef}>
          {movies.length > 0 && (
            <ResultsSection
              movies={movies}
              setMovies={setMovies}
              validation={validation}
              onClear={handleClearAll}
              language={language}
              warningNotice={warningNotice}
              sourceEngine={sourceEngine}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-400">VORVIXA</span>
            <span>• Movie & Web-Series Database Companion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>25 Standard Schema Keys Enforced</span>
            <span>•</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Schema Rules & Help
            </button>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />
    </div>
  );
}
