/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { SUPPORTED_CATEGORIES } from '../constants/categories';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn' | 'dual';
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'ব্যবহারবিধি ও স্কিমা নিয়মাবলী' : 'VORVIXA Workflow & Schema Guide'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'সহজে movies.json তৈরি ও ওয়েবসাইটে ব্যবহারের নির্দেশিকা'
                  : 'How to parse text, validate schema, and upload movies.json'}
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-300 leading-relaxed">
          {/* Step-by-Step Workflow */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple 7-Step Workflow (৭টি সহজ ধাপ)</span>
            </h4>
            <ol className="space-y-2 list-decimal list-inside text-slate-300 font-medium">
              <li>
                <b>Paste into ONE text box:</b> Copy movie or web-series details from Telegram,
                blog, or notes and paste directly. No separate forms needed.
              </li>
              <li>
                <b>Click GENERATE JSON:</b> Gemini AI automatically detects single or multiple
                entries, language, cast, links, resolutions, and storylines.
              </li>
              <li>
                <b>Automated Verification:</b> The built-in validator instantly checks all 25 schema
                keys, boolean synchronizations, and download link objects.
              </li>
              <li>
                <b>Inspect & Edit:</b> Use the visual cards or edit modal to tweak any fields if
                needed.
              </li>
              <li>
                <b>Optional Merge:</b> Have an existing <code className="text-amber-400">movies.json</code>?
                Merge them effortlessly with duplicate ID detection.
              </li>
              <li>
                <b>Copy or Download:</b> Click &quot;Download movies.json&quot; or copy the raw JSON with one click.
              </li>
              <li>
                <b>Manual Upload:</b> Upload <code className="text-amber-400">movies.json</code> to your
                GitHub repo or web server hosting.
              </li>
            </ol>
          </div>

          {/* 16 Supported Categories */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>16 Official Website Categories (অনুমোদিত ১৬টি ক্যাটাগরি)</span>
            </h4>
            <p className="text-slate-400">
              Gemini AI only selects from these 16 verified categories, keeping your website database clean:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUPPORTED_CATEGORIES.map((cat, idx) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold"
                >
                  {idx + 1}. {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Schema Strictness Rules */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Output Schema Rules</span>
            </h4>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <b>Pin Synchronization:</b> <code className="text-amber-300">pinned</code>,{' '}
                  <code className="text-amber-300">isPinned</code>,{' '}
                  <code className="text-amber-300">pin</code>, and{' '}
                  <code className="text-amber-300">is_pinned</code> always hold identical booleans.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <b>Featured & Recent:</b> <code className="text-amber-300">featured === isFeatured</code> and{' '}
                  <code className="text-amber-300">recent === isRecent</code>.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <b>Download Links:</b> Each item strictly contains{' '}
                  <code className="text-amber-300">{`{ "quality": "", "size": "", "url": "", "label": "" }`}</code>.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <b>No Hallucinations:</b> Never fabricates download links, ratings, cast, or URLs.
                  Missing info is always empty string or array.
                </span>
              </div>
            </div>
          </div>

          {/* Manual Upload Notice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <b>Important:</b> This tool generates and validates the compliant{' '}
              <code className="text-white font-mono">movies.json</code> file. Website uploading
              remains a manual action performed by you on your server or GitHub repository.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
          >
            Got It (বুঝেছি)
          </button>
        </div>
      </div>
    </div>
  );
};
