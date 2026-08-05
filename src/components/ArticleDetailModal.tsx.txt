import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Globe,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  Copy,
  Check,
  Clock,
  Eye,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Article, Comment } from '../types';
import { AVAILABLE_LANGUAGES } from '../data/mockArticles';
import { translateTextInstant, translateTextFree } from '../utils/translationHelper';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onToggleBookmark: (articleId: string) => void;
  onLike: (articleId: string) => void;
  onAddComment?: (articleId: string, commentObj: Comment) => void;
  currentLang: string;
  allArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onToggleBookmark,
  onLike,
  onAddComment,
  currentLang,
  allArticles = [],
  onSelectArticle,
}) => {
  if (!article) return null;

  // Audio Speech Reader State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // AI Summarizer State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState<{
    summary: string;
    keyTakeaways: string[];
    readabilityScore?: string;
  } | null>(null);

  // Translation State
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<string>(currentLang);

  // Comment State
  const [comments, setComments] = useState<Comment[]>(article.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');

  // Copy Code Toast & Share Modal State
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Table of Contents Toggle State
  const [isTocOpen, setIsTocOpen] = useState(true);

  // HTML Article View Mode (Reading view vs Live iFrame view)
  const [htmlRenderMode, setHtmlRenderMode] = useState<'reading' | 'iframe'>('reading');

  // Hide Top Bar on Scroll Down / Show on Scroll Up
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Sync translation when article or currentLang changes
  useEffect(() => {
    if (article && currentLang) {
      handleTranslateArticle(currentLang);
    }
  }, [article?.id, currentLang]);

  // Ensure scroll to top when article is opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article?.id]);

  // Handle Scroll Progress & Hide/Show Sticky Navigation Bar
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;

      if (totalScroll > 0) {
        setScrollProgress((currentY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }

      // Hide-on-scroll-down logic
      if (currentY > 100) {
        if (currentY > lastScrollY.current + 5) {
          setIsHeaderVisible(false);
        } else if (currentY < lastScrollY.current - 5) {
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text to Speech
  const toggleAudio = () => {
    if (!synthRef.current) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      synthRef.current.cancel();
      const textToRead = `${translatedTitle || article.title}. ${article.subtitle}. ${translatedContent || article.content}`.replace(/[#*`|_]/g, '');
      const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 3000));
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Fetch AI Summary from backend Express route
  const handleFetchAISummary = async () => {
    try {
      setIsSummarizing(true);
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.content
        })
      });
      const data = await res.json();
      setAiSummaryData(data);
    } catch (err) {
      console.error('Failed to summarize article:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Instant Client Dictionary + Free Google Translate (Zero Gemini API Quota Usage)
  const handleTranslateArticle = async (langCode: string) => {
    setTargetLang(langCode);
    if (langCode === 'en') {
      setTranslatedTitle(null);
      setTranslatedContent(null);
      setIsTranslating(false);
      return;
    }

    // 1. Instant dictionary translation for immediate UI update
    const instantTitle = translateTextInstant(article.title, langCode);
    const instantBody = translateTextInstant(article.content, langCode);
    setTranslatedTitle(instantTitle);
    setTranslatedContent(instantBody);

    // 2. Perform full client-side free translation
    try {
      setIsTranslating(true);
      const [fullTitle, fullBody] = await Promise.all([
        translateTextFree(article.title, langCode),
        translateTextFree(article.content, langCode)
      ]);
      setTranslatedTitle(fullTitle);
      setTranslatedContent(fullBody);
    } catch (err) {
      console.warn('Free translation fallback failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Add Comment with Real DB Endpoint Support
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const commentObj: Comment = {
      id: `c-${Date.now()}`,
      author: newAuthorName.trim() || 'Developer Guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    setComments([commentObj, ...comments]);

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, comment: commentObj })
      });
    } catch (err) {
      console.warn('Backend comment sync fallback:', err);
    }

    if (onAddComment) {
      onAddComment(article.id, commentObj);
    }
    setNewCommentText('');
  };

  // Derived Table of Contents (uses explicit article.toc or auto-generates from content)
  const activeContent = translatedContent || article.content || '';
  const derivedToc = useMemo(() => {
    if (article.toc && article.toc.length > 0) return article.toc;
    const lines = activeContent.split('\n');
    const h2Lines = lines.filter((l) => l.trim().startsWith('## '));
    return h2Lines.map((line, idx) => ({
      id: `sec-${idx + 1}`,
      text: line.replace('## ', '').trim(),
      level: 2,
    }));
  }, [article.toc, activeContent]);

  // Navigation helpers & popular articles
  const currentIndex = allArticles ? allArticles.findIndex((a) => a.id === article.id) : -1;
  const prevArticle = currentIndex > 0 && allArticles ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && allArticles && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const popularArticles = (allArticles || [])
    .filter((a) => a.id !== article.id)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  // Share Article with Domain Link & Social Platforms
  const currentFullUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentFullUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full space-y-6"
      >
        {/* Sticky Header Navigation Bar */}
        <div
          className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4 sticky top-16 z-30 shadow-lg"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              id="back-to-articles-btn"
              className="flex items-center gap-2 px-3 py-2 sm:px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Return to Articles List"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-500" />
              <span>Back</span>
            </button>

            {onSelectArticle && (
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                <button
                  onClick={() => prevArticle && onSelectArticle(prevArticle)}
                  disabled={!prevArticle}
                  className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-bold ${
                    prevArticle
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 border-slate-200 dark:border-slate-700 cursor-pointer'
                      : 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent'
                  }`}
                  title={prevArticle ? `Previous: ${prevArticle.title}` : 'No previous article'}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => nextArticle && onSelectArticle(nextArticle)}
                  disabled={!nextArticle}
                  className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-bold ${
                    nextArticle
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 border-slate-200 dark:border-slate-700 cursor-pointer'
                      : 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent'
                  }`}
                  title={nextArticle ? `Next: ${nextArticle.title}` : 'No next article'}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hidden lg:inline">
              {article.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Audio Reader Switcher */}
            <button
              onClick={toggleAudio}
              id="modal-audio-reader-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title="Listen to Article Read Aloud"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-500" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              id="modal-bookmark-btn"
              className={`p-2 rounded-full transition-colors ${
                article.isBookmarked
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title="Bookmark Article"
            >
              <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share Modal Trigger */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              id="modal-share-btn"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="Share Article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share Modal Popup */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share Publication</h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Domain Link Copy Bar */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Article Domain URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentFullUrl}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                {shareToast && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Link copied to clipboard!
                  </p>
                )}
              </div>

              {/* Social Media Share Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Share via Social Media</label>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + currentFullUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentFullUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>X (Twitter)</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentFullUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentFullUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Page Content Body */}
        <div
          ref={articleContainerRef}
          className="space-y-8 text-slate-800 dark:text-slate-200 pt-2"
        >
          {/* Controls Bar & Meta (For HTML files, hide double cover banner & double title h1) */}
          {!article.isHtmlFile && !(article.content && article.content.trim().startsWith('<')) && (
            <>
              {/* Cover Banner */}
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {translatedTitle || article.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              </div>
            </>
          )}

          {/* Author & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/30"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{article.author.name}</p>
                <p className="text-[11px] text-slate-400">{article.author.role} • {article.publishedAt}</p>
              </div>
            </div>

            {/* Multilingual Selector & AI Tools Row */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <select
                  value={targetLang}
                  onChange={(e) => handleTranslateArticle(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-slate-800 dark:text-slate-200 text-xs"
                  id="modal-article-lang-select"
                >
                  {AVAILABLE_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleFetchAISummary}
                disabled={isSummarizing}
                id="modal-ai-summarize-btn"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                {isSummarizing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span>AI Takeaways</span>
              </button>
            </div>
          </div>

          {/* AI Summary Card (If fetched) */}
          {aiSummaryData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900 to-indigo-900/30 border border-purple-500/30 shadow-xl space-y-3"
              id="ai-summary-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Executive Summary</h3>
                </div>
                {aiSummaryData.readabilityScore && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {aiSummaryData.readabilityScore}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {aiSummaryData.summary}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-purple-500/20">
                <p className="text-[11px] font-bold text-purple-300 uppercase">Key Takeaways:</p>
                <ul className="space-y-1">
                  {aiSummaryData.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Translation Loading Indicator */}
          {isTranslating && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center gap-3 text-cyan-400 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating article content to {AVAILABLE_LANGUAGES.find(l => l.code === targetLang)?.name}...</span>
            </div>
          )}

          {/* Interactive Collapsible Table of Contents */}
          {derivedToc && derivedToc.length > 0 && (
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 overflow-hidden transition-all">
              <button
                onClick={() => setIsTocOpen(!isTocOpen)}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 uppercase tracking-wider">
                  <ListOrdered className="w-4 h-4 text-cyan-500" />
                  <span>Table of Contents ({derivedToc.length})</span>
                </div>
                {isTocOpen ? <ChevronUp className="w-4 h-4 text-cyan-500" /> : <ChevronDown className="w-4 h-4 text-cyan-500" />}
              </button>

              {isTocOpen && (
                <div className="p-4 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {derivedToc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const targetEl = document.getElementById(item.id);
                        if (targetEl) {
                          const yOffset = -100;
                          const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-medium truncate flex items-center gap-1.5 p-2 rounded-xl hover:bg-cyan-500/10 cursor-pointer"
                    >
                      <span className="text-cyan-500 font-bold">›</span>
                      <span className="truncate">{item.text}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article Body (HTML or Markdown) */}
          <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            {article.isHtmlFile || (article.content && article.content.trim().startsWith('<')) ? (
              <div className="space-y-4">
                {/* Mode Toolbar for HTML Articles */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">HTML Render Mode:</span>
                    <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-slate-800">
                      <button
                        onClick={() => setHtmlRenderMode('reading')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          htmlRenderMode === 'reading'
                            ? 'bg-cyan-500 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Formatted Reading
                      </button>
                      <button
                        onClick={() => setHtmlRenderMode('iframe')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          htmlRenderMode === 'iframe'
                            ? 'bg-cyan-500 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Live Isolated iFrame
                      </button>
                    </div>
                  </div>

                  {article.htmlUrl && (
                    <a
                      href={article.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold flex items-center gap-1.5 transition-colors text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Static HTML in New Tab</span>
                    </a>
                  )}
                </div>

                {/* HTML Display Content */}
                {htmlRenderMode === 'iframe' && article.htmlUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white min-h-[600px] w-full">
                    <iframe
                      src={article.htmlUrl}
                      title={article.title}
                      className="w-full h-[650px] border-none"
                    />
                  </div>
                ) : htmlRenderMode === 'iframe' && !article.htmlUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white min-h-[600px] w-full">
                    <iframe
                      srcDoc={translatedContent || article.content}
                      title={article.title}
                      className="w-full h-[650px] border-none"
                    />
                  </div>
                ) : (
                  <div 
                    className="raw-html-content space-y-4"
                    dangerouslySetInnerHTML={{ __html: translatedContent || article.content }} 
                  />
                )}
              </div>
            ) : (() => {
              let h2Count = 0;
              return (translatedContent || article.content).split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  const headingText = paragraph.replace('## ', '');
                  const currentTocItem = derivedToc[h2Count];
                  const headingId = currentTocItem ? currentTocItem.id : `sec-${h2Count + 1}`;
                  h2Count++;
                  return (
                    <h2
                      key={index}
                      id={headingId}
                      className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-200 dark:border-slate-800 scroll-mt-28"
                    >
                      {headingText}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-slate-900 dark:text-white pt-3 scroll-mt-24">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('```')) {
                  const codeLines = paragraph.replace(/```[a-z]*/g, '').trim();
                  return (
                    <div key={index} className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl my-4">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
                        <span>Code Snippet</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeLines);
                            setCopiedCodeIndex(index);
                            setTimeout(() => setCopiedCodeIndex(null), 2000);
                          }}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedCodeIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedCodeIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
                        <code>{codeLines}</code>
                      </pre>
                    </div>
                  );
                } else {
                  return (
                    <p key={index} className="leading-relaxed text-slate-700 dark:text-slate-300">
                      {paragraph}
                    </p>
                  );
                }
              });
            })()}
          </div>

          {/* Bottom Actions Bar (Export Markdown Removed per request) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLike(article.id)}
                id="modal-like-action-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold text-xs transition-colors shadow-sm"
              >
                <Heart className="w-4 h-4 fill-current text-rose-500" />
                <span>{article.likes} Likes</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {article.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Comments & Discussion Section */}
          <div className="pt-8 space-y-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Developer Discussion ({comments.length})
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  placeholder="Your Name / Handle"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>
              <textarea
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your thoughts, improvements, or questions..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comment Thread List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{c.author}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Previous & Next Article Navigation Banner */}
          {onSelectArticle && (prevArticle || nextArticle) && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 sm:gap-4">
              {prevArticle ? (
                <button
                  onClick={() => onSelectArticle(prevArticle)}
                  className="group flex flex-col justify-between p-2.5 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500 text-left transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-cyan-500 mb-1">
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    <span>Previous</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 line-clamp-2 leading-snug">
                    {prevArticle.title}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {prevArticle.readTime} • {prevArticle.category}
                  </span>
                </button>
              ) : <div />}

              {nextArticle ? (
                <button
                  onClick={() => onSelectArticle(nextArticle)}
                  className="group flex flex-col justify-between p-2.5 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500 text-right transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-end gap-1 text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-cyan-500 mb-1">
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 line-clamp-2 leading-snug">
                    {nextArticle.title}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {nextArticle.readTime} • {nextArticle.category}
                  </span>
                </button>
              ) : <div />}
            </div>
          )}

          {/* Popular Publications Section */}
          {popularArticles.length > 0 && onSelectArticle && (
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rose-500" />
                    <span>Popular & Trending Publications</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Explore top-rated articles recommended by the developer community.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {popularArticles.map((popArt) => (
                  <div
                    key={`popular-${popArt.id}`}
                    onClick={() => onSelectArticle(popArt)}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:border-rose-500/50 transition-all shadow-sm hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                      <img
                        src={popArt.coverImage}
                        alt={popArt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                        {popArt.category}
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                        {popArt.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1 text-rose-500 font-bold">
                          <Heart className="w-3 h-3 fill-current" />
                          {popArt.likes}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-400">
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

