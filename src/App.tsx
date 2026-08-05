import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { DevToolsStudio } from './components/DevToolsStudio';
import { CustomCSSInjector } from './components/CustomCSSInjector';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Footer } from './components/Footer';
import { INITIAL_ARTICLES } from './data/mockArticles';
import { Article, ArticleCategory, ActiveTab, ThemeMode, Comment } from './types';
import { Sparkles, BookOpen, Bookmark } from 'lucide-react';
import { translateTextInstant } from './utils/translationHelper';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Articles & Filtering State with LocalStorage Persistence
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const savedBookmarks: string[] = JSON.parse(localStorage.getItem('nexus_bookmarked_ids') || '[]');
      const savedLikes: Record<string, number> = JSON.parse(localStorage.getItem('nexus_liked_article_likes') || '{}');
      const savedComments: Record<string, Comment[]> = JSON.parse(localStorage.getItem('nexus_article_comments') || '{}');

      return INITIAL_ARTICLES.map((art) => ({
        ...art,
        isBookmarked: savedBookmarks.includes(art.id),
        likes: savedLikes[art.id] !== undefined ? savedLikes[art.id] : art.likes,
        comments: savedComments[art.id] !== undefined ? savedComments[art.id] : (art.comments || [])
      }));
    } catch (err) {
      return INITIAL_ARTICLES;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('articles');

  // Multilingual Language State
  const [currentLang, setCurrentLang] = useState('en');

  // Custom CSS Injection State
  const [customCSS, setCustomCSS] = useState('');

  // Modals & Article Reader State
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<Article | null>(null);
  const [isCSSInjectorOpen, setIsCSSInjectorOpen] = useState(false);
  const savedScrollPositionRef = React.useRef<number>(0);

  const handleSelectArticle = (art: Article) => {
    savedScrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
    setSelectedArticleDetail(art);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCloseArticle = () => {
    setSelectedArticleDetail(null);
    const targetY = savedScrollPositionRef.current;
    setTimeout(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }, 20);
  };

  // Auto-scan /public folder for uploaded HTML articles on mount
  useEffect(() => {
    fetch('/api/public-articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newScanned = data.articles.filter((a: Article) => !existingIds.has(a.id));
            if (newScanned.length > 0) {
              return [...newScanned, ...prev];
            }
            return prev;
          });
        }
      })
      .catch((err) => console.log('Public articles scan check:', err));
  }, []);

  // Sync to LocalStorage on articles state changes
  useEffect(() => {
    try {
      const bookmarkedIds = articles.filter((a) => a.isBookmarked).map((a) => a.id);
      localStorage.setItem('nexus_bookmarked_ids', JSON.stringify(bookmarkedIds));

      const likesMap: Record<string, number> = {};
      const commentsMap: Record<string, Comment[]> = {};
      articles.forEach((a) => {
        likesMap[a.id] = a.likes;
        commentsMap[a.id] = a.comments || [];
      });
      localStorage.setItem('nexus_liked_article_likes', JSON.stringify(likesMap));
      localStorage.setItem('nexus_article_comments', JSON.stringify(commentsMap));
    } catch (err) {
      console.error('Failed to sync to localStorage:', err);
    }
  }, [articles]);

  // Apply Theme Class to Document Root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Apply Custom CSS to DOM Head dynamically
  useEffect(() => {
    let styleEl = document.getElementById('nexus-custom-css-injection');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'nexus-custom-css-injection';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS;
  }, [customCSS]);

  // Filter Articles (Optimized with useMemo)
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.subtitle.toLowerCase().includes(query) ||
        art.tags.some((t) => t.toLowerCase().includes(query)) ||
        art.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Bookmark Toggle with LocalStorage Sync
  const handleToggleBookmark = useCallback((articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleId ? { ...art, isBookmarked: !art.isBookmarked } : art
      )
    );
    setSelectedArticleDetail((prev) =>
      prev && prev.id === articleId ? { ...prev, isBookmarked: !prev.isBookmarked } : prev
    );
  }, []);

  // Like Toggle with LocalStorage Sync
  const handleLikeArticle = useCallback((articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleId ? { ...art, likes: art.likes + 1 } : art
      )
    );
    setSelectedArticleDetail((prev) =>
      prev && prev.id === articleId ? { ...prev, likes: prev.likes + 1 } : prev
    );
  }, []);

  // Add Comment with LocalStorage Sync
  const handleAddComment = useCallback((articleId: string, newComment: Comment) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const updatedComments = [newComment, ...(art.comments || [])];
          return { ...art, comments: updatedComments };
        }
        return art;
      })
    );
    setSelectedArticleDetail((prev) =>
      prev && prev.id === articleId ? { ...prev, comments: [newComment, ...(prev.comments || [])] } : prev
    );
  }, []);

  // Share Link
  const handleShareArticle = useCallback((article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Article link for "${article.title}" copied to clipboard!`);
    }
  }, []);

  const handleSelectTab = useCallback((tab: ActiveTab) => {
    setSelectedArticleDetail(null);
    setActiveTab(tab);
  }, []);

  const handleImportArticle = useCallback((newArt: Article) => {
    setArticles((prev) => [newArt, ...prev]);
    setSelectedArticleDetail(newArt);
    setActiveTab('articles');
  }, []);


  const savedCount = articles.filter((a) => a.isBookmarked).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col">
      
      {/* Header Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        onOpenCSSInjector={() => setIsCSSInjectorOpen(true)}
        savedArticlesCount={savedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Embedded Reader View */}
        {selectedArticleDetail ? (
          <ArticleDetailModal
            article={selectedArticleDetail}
            onClose={handleCloseArticle}
            onToggleBookmark={(id) => handleToggleBookmark(id)}
            onLike={(id) => handleLikeArticle(id)}
            onAddComment={handleAddComment}
            currentLang={currentLang}
            allArticles={articles}
            onSelectArticle={(art) => handleSelectArticle(art)}
          />
        ) : (
          <>
            {/* ARTICLES TAB */}
            {activeTab === 'articles' && (
              <div className="space-y-12 pb-16">
                
                {/* Hero Banner & Category Pills */}
                <HeroSection
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  totalArticles={articles.length}
                  currentLang={currentLang}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                {/* Articles Grid Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-8">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-cyan-500" />
                        <span>{translateTextInstant("Featured Technical Articles", currentLang)}</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                        Deep dives into modern frontend, edge architecture, motion design, and developer tools.
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 font-semibold hidden sm:block">
                      Showing {filteredArticles.length} of {articles.length} publications
                    </div>
                  </div>

                  {/* Cards Grid - 2 Articles per row layout */}
                  {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-8">
                      {filteredArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          currentLang={currentLang}
                          onSelect={(art) => handleSelectArticle(art)}
                          onToggleBookmark={handleToggleBookmark}
                          onLike={handleLikeArticle}
                          onShare={handleShareArticle}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        No articles found for "{searchQuery}"
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try adjusting your search query or selecting a different category filter.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* DEV TOOLS STUDIO TAB */}
            {activeTab === 'tools' && <DevToolsStudio onImportArticle={handleImportArticle} />}

            {/* FAVORITES & BOOKMARKS TAB */}
            {activeTab === 'bookmarks' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[60vh]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                      <Bookmark className="w-6 h-6 text-rose-500 fill-current" />
                      <span>{translateTextInstant("My Favorites & Saved Publications", currentLang)}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Quick access to all your bookmarked technical articles and developer tools documentation.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold self-start sm:self-auto">
                    <span>{savedCount} Articles Saved</span>
                  </div>
                </div>

                {/* Bookmarked Articles Grid - 2 per row */}
                {articles.filter((a) => a.isBookmarked).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {articles
                      .filter((a) => a.isBookmarked)
                      .map((article) => (
                        <ArticleCard
                          key={`bookmark-${article.id}`}
                          article={article}
                          currentLang={currentLang}
                          onSelect={(art) => handleSelectArticle(art)}
                          onToggleBookmark={handleToggleBookmark}
                          onLike={handleLikeArticle}
                          onShare={handleShareArticle}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 max-w-md mx-auto my-8 shadow-xl">
                    <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
                      <Bookmark className="w-8 h-8 stroke-[2]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      No Saved Favorites Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Click the bookmark icon on any technical article card or publication to save it to your personal reading list.
                    </p>
                    <button
                      onClick={() => setActiveTab('articles')}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20"
                    >
                      Browse Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenCSSInjector={() => setIsCSSInjectorOpen(true)}
      />

      {/* Custom CSS Injector Modal */}
      <CustomCSSInjector
        isOpen={isCSSInjectorOpen}
        onClose={() => setIsCSSInjectorOpen(false)}
        activeCss={customCSS}
        onApplyCss={setCustomCSS}
      />

      {/* Rotating Circular Arrow Scroll-To-Top Floating Button */}
      <ScrollToTopButton />

    </div>
  );
}

