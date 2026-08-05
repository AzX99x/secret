import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, Heart, Bookmark, Share2, Clock, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { translateTextInstant, translateTextFree } from '../utils/translationHelper';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
  onLike: (articleId: string, e: React.MouseEvent) => void;
  onShare: (article: Article, e: React.MouseEvent) => void;
  currentLang?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({
  article,
  onSelect,
  onToggleBookmark,
  onLike,
  onShare,
  currentLang = 'en',
}) => {
  const [displayTitle, setDisplayTitle] = useState(translateTextInstant(article.title, currentLang));
  const [displaySubtitle, setDisplaySubtitle] = useState(translateTextInstant(article.subtitle, currentLang));

  useEffect(() => {
    let isMounted = true;
    if (currentLang === 'en') {
      setDisplayTitle(article.title);
      setDisplaySubtitle(article.subtitle);
      return;
    }

    const instantT = translateTextInstant(article.title, currentLang);
    const instantS = translateTextInstant(article.subtitle, currentLang);
    setDisplayTitle(instantT);
    setDisplaySubtitle(instantS);

    Promise.all([
      translateTextFree(article.title, currentLang),
      translateTextFree(article.subtitle, currentLang)
    ]).then(([t, s]) => {
      if (isMounted) {
        setDisplayTitle(t);
        setDisplaySubtitle(s);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [article.title, article.subtitle, currentLang]);


  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(article)}
      id={`article-card-${article.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 gpu-accelerated"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[21/9] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold tracking-wider uppercase rounded-md bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
            {article.category}
          </span>

          <button
            onClick={(e) => onToggleBookmark(article.id, e)}
            id={`bookmark-btn-${article.id}`}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              article.isBookmarked
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
            title={article.isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Read Time Overlay */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 text-[9px] sm:text-[11px] font-medium text-slate-200 bg-slate-950/70 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
          <span>{article.readTime}</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
            {displayTitle}
          </h3>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Footer info & stats */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-5 h-5 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-cyan-500/20"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                {article.author.name}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-none mt-0.5">
                {article.publishedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={(e) => onLike(article.id, e)}
              className="flex items-center gap-1 hover:text-rose-500 transition-colors"
              title="Like"
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500/20 text-rose-500" />
              <span className="font-semibold text-[11px] sm:text-xs">{article.likes}</span>
            </button>

            <button
              onClick={(e) => onShare(article, e)}
              className="p-1 hover:text-cyan-500 transition-colors"
              title="Share"
            >
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

