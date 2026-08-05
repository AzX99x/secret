import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Sun,
  Moon,
  Search,
  BookOpen,
  Bookmark,
  Sparkles,
  Terminal,
  Palette,
  Menu,
  X,
} from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types';
import { AVAILABLE_LANGUAGES } from '../data/mockArticles';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentLang: string;
  onChangeLang: (code: string) => void;
  onOpenCSSInjector: () => void;
  savedArticlesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentLang,
  onChangeLang,
  onOpenCSSInjector,
  savedArticlesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const selectedLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === currentLang) || AVAILABLE_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b transition-colors duration-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('articles')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
            id="brand-logo-btn"
          >
            <img
              src="https://res.cloudinary.com/day98cz1i/image/upload/v1773116032/ChatGPT_Image_May_28_2025_04_49_49_PM_lyr08i.png"
              alt="HEZHINX Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-600 dark:from-white dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                HEZHINX
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, code..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border transition-all duration-200 outline-none bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('articles')}
            id="nav-articles-tab"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'articles'
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Articles</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            id="nav-bookmarks-tab"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${savedArticlesCount > 0 ? 'text-rose-500 fill-current' : ''}`} />
            <span>Favorites</span>
            {savedArticlesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                {savedArticlesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            id="nav-tools-tab"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tools'
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Dev Tools Studio</span>
          </button>

          <button
            onClick={onOpenCSSInjector}
            id="nav-css-injector-btn"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Palette className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span>Custom CSS</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">

          {/* Multilingual Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              id="language-selector-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Change UI Language"
            >
              <span className="text-base">{selectedLangObj.flag}</span>
              <span className="font-semibold">{selectedLangObj.nativeName}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 text-xs"
                id="language-dropdown-menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Select Language
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChangeLang(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentLang === lang.code ? 'font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/5' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark/Light Mode Switcher */}
          <button
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <div className="relative w-full mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & tools..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            onClick={() => {
              setActiveTab('articles');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span>Articles</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookmarks');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-rose-500" />
              <span>Favorites & Bookmarks</span>
            </div>
            {savedArticlesCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-bold">
                {savedArticlesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('tools');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>Dev Tools Studio</span>
          </button>

          <button
            onClick={() => {
              onOpenCSSInjector();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Custom CSS Injector</span>
          </button>

          <button
            onClick={() => {
              onToggleTheme();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-3"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

