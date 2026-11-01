/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ValidationReportData } from '../types/movie';

interface ValidationReportProps {
  report: ValidationReportData;
  onSelectMovie?: (index: number) => void;
  language: 'en' | 'bn' | 'dual';
}

export const ValidationReport: React.FC<ValidationReportProps> = ({
  report,
  onSelectMovie,
  language,
}) => {
  const { isValid, errorCount, warningCount, totalMovies, issues, passedChecks } = report;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 sm:p-6 space-y-6">
      {/* Top Status Card */}
      <div
        className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isValid
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-rose-500/10 border-rose-500/30'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isValid ? (
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {isValid
                ? language === 'bn'
                  ? 'স্কিমা সম্পূর্ণ বৈধ ও ওয়েবসাইটে ব্যবহারের জন্য প্রস্তুত!'
                  : 'Schema is 100% Valid & Ready for Website Upload!'
                : language === 'bn'
                ? 'কিছু স্কিমা ত্রুটি পাওয়া গেছে, যা সমাধান করা প্রয়োজন'
                : 'Schema Validation Errors Detected'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isValid
                ? language === 'bn'
                  ? `মোট ${totalMovies}টি মুভি অবজেক্টের সকল ২৫টি ফিল্ড, সিনক্রোনাইজড বুলিয়ান এবং ডাউনলোড লিংক সফলভাবে যাচাই করা হয়েছে।`
                  : `All ${totalMovies} movie objects passed key integrity, boolean synchronizations, and download link constraints.`
                : language === 'bn'
                ? `অনুগ্রহ করে নিচের ${errorCount}টি ত্রুটি সংশোধন করুন ডাউনলোড করার পূর্বে।`
                : `Please correct the ${errorCount} schema errors below before generating or downloading.`}
            </p>
          </div>
        </div>

        {/* Count Pill */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-black ${
              isValid
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {errorCount} Errors • {warningCount} Warnings
          </span>
        </div>
      </div>

      {/* Grid of Issues and Passed Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Errors & Warnings List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Issues & Suggestions ({issues.length})</span>
          </h4>

          {issues.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No errors or warnings found. Pristine schema quality!</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${
                    issue.type === 'error'
                      ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                      : issue.type === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                      : 'bg-blue-950/20 border-blue-800/50 text-blue-200'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {issue.type === 'error' ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium leading-relaxed">
                      {language === 'bn' ? issue.bengaliMessage : issue.message}
                    </p>
                    {language === 'dual' && (
                      <p className="text-[11px] opacity-80 mt-1 font-bengali">
                        {issue.bengaliMessage}
                      </p>
                    )}
                    {issue.field && (
                      <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-300">
                        Field: {issue.field}
                      </span>
                    )}
                  </div>

                  {issue.movieIndex !== undefined && onSelectMovie && (
                    <button
                      onClick={() => onSelectMovie(issue.movieIndex!)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 flex-shrink-0 self-center"
                    >
                      <span>Fix</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Passing Schema Verification Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passed Schema Rules ({passedChecks.length})</span>
          </h4>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 max-h-[420px] overflow-y-auto">
            {passedChecks.map((check, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-[10px]">
                  ✓
                </div>
                <span className="font-medium">{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
