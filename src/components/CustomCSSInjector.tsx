import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Play, Check, Copy, Code2, Sparkles, RefreshCw } from 'lucide-react';
import { CustomCSSSnippet } from '../types';

interface CustomCSSInjectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeCss: string;
  onApplyCss: (css: string) => void;
}

const PRESET_CSS_TEMPLATES: CustomCSSSnippet[] = [
  {
    id: 'preset-1',
    name: 'Neon Cyan Glow & Smooth Scroll',
    active: false,
    css: `/* Neon Cyan Glow & Smooth Scroll Override */
html {
  scroll-behavior: smooth;
}

article:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.25) !important;
  border-color: rgba(6, 182, 212, 0.6) !important;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #06b6d4;
  border-radius: 4px;
}`
  },
  {
    id: 'preset-2',
    name: 'Google Translate Widget Styling',
    active: false,
    css: `/* Google Translate & Multilingual UI Styling */
.goog-te-banner-frame {
  display: none !important;
}
body {
  top: 0px !important;
}
.translated-text-highlight {
  background: rgba(6, 182, 212, 0.15) !important;
  border-bottom: 2px solid #06b6d4 !important;
  padding: 0 2px;
}`
  },
  {
    id: 'preset-3',
    name: 'Ultra High-Contrast Dark Canvas',
    active: false,
    css: `/* High-Contrast Cyber Dark Theme */
body {
  background-color: #030712 !important;
}
header {
  background-color: rgba(3, 7, 18, 0.9) !important;
}
.card, article {
  background-color: #0b0f19 !important;
}`
  }
];

export const CustomCSSInjector: React.FC<CustomCSSInjectorProps> = ({
  isOpen,
  onClose,
  activeCss,
  onApplyCss,
}) => {
  const [cssCode, setCssCode] = useState<string>(activeCss || PRESET_CSS_TEMPLATES[0].css);
  const [copied, setCopied] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(false);

  useEffect(() => {
    if (activeCss) setCssCode(activeCss);
  }, [activeCss]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyCss(cssCode);
    setAppliedStatus(true);
    setTimeout(() => setAppliedStatus(false), 2000);
  };

  const handleClear = () => {
    setCssCode('');
    onApplyCss('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Custom CSS Injector & Theme Studio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inject custom CSS directly into the DOM head for live styling overrides.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Presets:
            </span>
            {PRESET_CSS_TEMPLATES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setCssCode(preset.css)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500 transition-colors shrink-0"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Code Editor Body */}
          <div className="p-6 flex-1 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                CSS Injection Editor
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-cyan-500 hover:text-cyan-400 font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              placeholder="/* Type custom CSS rules here... */"
              className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-950 text-cyan-300 outline-none focus:border-cyan-500 resize-none shadow-inner"
            />
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              Clear Injection
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                id="apply-custom-css-btn"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md transition-all"
              >
                {appliedStatus ? <Check className="w-4 h-4 text-emerald-300" /> : <Play className="w-4 h-4" />}
                <span>{appliedStatus ? 'Injected Live!' : 'Inject Custom CSS'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
