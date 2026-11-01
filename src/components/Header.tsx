/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Film, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Code, Layers } from 'lucide-react';

interface HeaderProps {
  apiStatus: { configured: boolean; model: string };
  language: 'en' | 'bn' | 'dual';
  setLanguage: (lang: 'en' | 'bn' | 'dual') => void;
  onOpenHelp: () => void;
  moviesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  language,
  setLanguage,
  onOpenHelp,
  moviesCount,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black tracking-wider text-xl">
              <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  VORVIXA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  AI Generator
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {language === 'bn'
                  ? 'মুভি ও ওয়েব-সিরিজ JSON বিল্ডার'
                  : language === 'dual'
                  ? 'movies.json Generator • মুভি ও সিরিজ ডেটা পার্সার'
                  : 'movies.json Generator for Web'}
              </p>
            </div>
          </div>

          {/* Mobile Help Button */}
          <button
            onClick={onOpenHelp}
            className="sm:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400"
            title="Help & Schema Docs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Options */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Gemini AI Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  apiStatus.configured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  apiStatus.configured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gemini 3.8 Flash</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                apiStatus.configured
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {apiStatus.configured ? 'Online' : 'Fallback Ready'}
            </span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'bn'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('dual')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'dual'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dual English & Bengali Labels"
            >
              Dual
            </button>
          </div>

          {/* Help Button Desktop */}
          <button
            onClick={onOpenHelp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'নির্দেশিকা' : 'Help & Rules'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
