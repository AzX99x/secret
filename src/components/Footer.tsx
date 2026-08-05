import React, { useState } from 'react';
import { Sparkles, Terminal, Code2, ShieldCheck, FileText, X } from 'lucide-react';

interface FooterProps {
  onOpenCSSInjector: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCSSInjector,
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/day98cz1i/image/upload/v1773116032/ChatGPT_Image_May_28_2025_04_49_49_PM_lyr08i.png"
                alt="HEZHINX Logo"
                className="w-8 h-8 rounded-lg object-contain shadow-sm"
              />
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                HEZHINX
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Technical publications, instant multi-language translation, live CSS injection, and interactive developer tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Platform Features & Legal
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={onOpenCSSInjector} className="hover:text-cyan-500 transition-colors">
                  Live Custom CSS Injector
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="hover:text-cyan-500 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('terms')} className="hover:text-cyan-500 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Terms of Service</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Status & Copyright */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              System Status
            </h4>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Operational</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                Ready for Cloudflare Pages & GitHub deployment.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© 2026 Hezhinx. Built for technical publications & developer tools.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setModalType('privacy')} className="hover:underline">Privacy</button>
            <button onClick={() => setModalType('terms')} className="hover:underline">Terms</button>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {modalType === 'privacy' ? <ShieldCheck className="w-5 h-5 text-cyan-500" /> : <FileText className="w-5 h-5 text-cyan-500" />}
                <span>{modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed max-h-96 overflow-y-auto pr-2">
              {modalType === 'privacy' ? (
                <>
                  <p className="font-semibold text-slate-900 dark:text-white">1. Information Collection</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Hezhinx respects your privacy. We do not track, collect, or store personal user identification data on external servers. All custom themes, bookmarks, and preferences are stored locally on your device via standard client storage.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">2. External Translation Services</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Language translations are performed directly on the client side using instant dictionary mappings or public language endpoints without storing article content or personal identifiers.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">3. Third-Party Links & GitHub Integrations</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Articles imported via GitHub raw streams interact directly with standard public repositories.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    By accessing and using Hezhinx, you agree to comply with open-source technical publication standards and usage guidelines.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">2. Content Ownership</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    All published articles and code graphics remain the intellectual property of their respective author and repository maintainers.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">3. Modifications</p>
                  <p className="font-semibold text-slate-500 dark:text-slate-400">
                    You are free to edit, fork, and customize the menu structure, styling, or source code directly via GitHub.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

