import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, BookOpen, Image, Edit3, X, Check, ChevronLeft, ChevronRight, ChevronDown, Search, RotateCcw, Filter } from 'lucide-react';
import { ArticleCategory } from '../types';
import { translateTextInstant } from '../utils/translationHelper';

interface HeroSectionProps {
  selectedCategory: ArticleCategory;
  onSelectCategory: (cat: ArticleCategory) => void;
  totalArticles: number;
  currentLang?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES: ArticleCategory[] = [
  'All',
  'Mind Science',
  'Business',
  'AI & Future',
  'Science',
  'Health',
  'Tech',
  'World Cast',
];

// High quality curated visual presets (No raw link strings displayed in UI)
const PRESET_BANNER_GALLERY = [
  {
    id: 'preset-1',
    title: 'Cloudflare Edge Infrastructure',
    tag: 'Cloud & Edge',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-2',
    title: 'UI Motion & Micro-Interactions',
    tag: 'Frontend & Motion',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-3',
    title: 'Gemini 3.6 AI Content Pipelines',
    tag: 'AI & Future',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-4',
    title: 'Custom CSS & Live Studio Tools',
    tag: 'Web Tools',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-5',
    title: 'Quantum Computing Networks',
    tag: 'Deep Tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-6',
    title: 'Zero-Trust Cyber Security Systems',
    tag: 'DevOps & CI/CD',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-7',
    title: 'Distributed Microservice Architecture',
    tag: 'Design Systems',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preset-8',
    title: 'Real-Time Data Visualizations',
    tag: 'Frontend & Motion',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];

// Custom Typewriter Effect Hook
function useTypewriter(fullText: string, speed = 40, delay = 0) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timeoutId: any;
    setDisplayedText('');
    let currentIndex = 0;

    const startTyping = () => {
      timeoutId = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(timeoutId);
        }
      }, speed);
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timeoutId);
    };
  }, [fullText, speed, delay]);

  return displayedText;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  totalArticles,
  currentLang = 'en',
  searchQuery,
  onSearchChange,
}) => {
  const [heroImages, setHeroImages] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_hero_images');
      return saved ? JSON.parse(saved) : PRESET_BANNER_GALLERY.slice(0, 4);
    } catch (e) {
      return PRESET_BANNER_GALLERY.slice(0, 4);
    }
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [selectedPresetForActiveSlide, setSelectedPresetForActiveSlide] = useState<number>(0);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  // Auto Slider Timer
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, heroImages.length]);

  const rawHeading = "World-Class Tech Insights & Developer Motion Studio";
  const rawSub = "Explore interactive technical publications, test live CSS themes, and translate content seamlessly in real-time.";
  const rawStat1 = "Instant Multi-Language Support";
  const rawStat2 = `${totalArticles} Curated Technical Publications`;

  const headingText = translateTextInstant(rawHeading, currentLang);
  const subText = translateTextInstant(rawSub, currentLang);
  const stat1Text = translateTextInstant(rawStat1, currentLang);
  const stat2Text = translateTextInstant(rawStat2, currentLang);

  const typedHeading = useTypewriter(headingText, 35, 100);
  const typedSub = useTypewriter(subText, 25, 1200);
  const typedStat1 = useTypewriter(stat1Text, 30, 2400);
  const typedStat2 = useTypewriter(stat2Text, 30, 2800);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % heroImages.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleSelectPreset = (preset: typeof PRESET_BANNER_GALLERY[0]) => {
    const updated = [...heroImages];
    updated[activeSlideIndex] = preset;
    setHeroImages(updated);
    try {
      localStorage.setItem('nexus_hero_images', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <section className="relative overflow-hidden py-6 sm:py-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">

        {/* Top Featured Banner Image Slider (Clean, no text overlay) */}
        <div className="pt-1">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-3xl overflow-hidden aspect-[21/9] sm:aspect-[24/8] border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl group"
          >
            {/* Slide Images (Clean display) */}
            {heroImages.map((img: any, idx: number) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={`hero-slide-${idx}-${img.id || ''}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover transform scale-100 transition-transform duration-1000"
                    loading={isActive ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              );
            })}

            {/* Previous & Next Navigation Arrows on Hover */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/60 hover:bg-cyan-500 text-white backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
              title="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/60 hover:bg-cyan-500 text-white backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
              title="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Slide Indicators / Dots */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-slate-800/80">
              {heroImages.map((_: any, idx: number) => (
                <button
                  key={`slide-dot-${idx}`}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex
                      ? 'w-6 bg-cyan-400'
                      : 'w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Text Content & World-Class Typewriter Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
            <span>Developer Insights & Article Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">2026 Edition</span>
          </div>

          {/* Typewriter Headline */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight min-h-[3rem]">
            {typedHeading}
            <span className="inline-block w-1 h-6 ml-1 bg-cyan-500 animate-pulse align-middle" />
          </h1>

          {/* Typewriter Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto min-h-[2rem]">
            {typedSub}
          </p>

          {/* Quick Stats Pills with Typewriter */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{typedStat1}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>{typedStat2}</span>
            </div>
          </div>
        </div>

        {/* Real-time Article Search Bar */}
        <div className="max-w-2xl mx-auto pt-1">
          <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-cyan-500 transition-colors">
            <Search className="w-5 h-5 text-cyan-500 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search publications by title, keyword, technology or tag..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 mr-3 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Preset Banner Picker Modal (NO Raw URL links shown!) */}
        {isEditingImages && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Customize Slide {activeSlideIndex + 1} Theme
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingImages(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a visual publication banner theme preset below to update <strong>Slide {activeSlideIndex + 1}</strong>:
              </p>

              {/* Visual Thumbnail Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {PRESET_BANNER_GALLERY.map((preset, pIdx) => {
                  const isSelected = heroImages[activeSlideIndex]?.url === preset.url;
                  return (
                    <button
                      key={`preset-item-${preset.id}-${pIdx}`}
                      onClick={() => handleSelectPreset(preset)}
                      className={`group relative rounded-2xl overflow-hidden aspect-[4/3] border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg scale-[1.02]'
                          : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 hover:border-cyan-400/50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                        <span className="text-[9px] font-bold uppercase text-cyan-300 block truncate">
                          {preset.tag}
                        </span>
                        <p className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                          {preset.title}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  Slide {activeSlideIndex + 1} of {heroImages.length}
                </span>
                <button
                  onClick={() => setIsEditingImages(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider hover:text-cyan-500 transition-colors"
                title={isCategoryFilterOpen ? 'Hide Categories' : 'Show Categories'}
              >
                <Filter className="w-4 h-4 text-cyan-500" />
                <span>Filter Category</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCategoryFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-500 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <span>Showing: <strong className="text-cyan-500 dark:text-cyan-400">{translateTextInstant(selectedCategory, currentLang)}</strong></span>
              </button>

              {/* Scroll Arrows when open */}
              {isCategoryFilterOpen && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleScrollCategories('left')}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-white transition-colors"
                    title="Scroll Left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleScrollCategories('right')}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-white transition-colors"
                    title="Scroll Right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Pills Row with Horizontal Scroll */}
          {isCategoryFilterOpen && (
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth transition-all duration-300"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      active
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 ring-2 ring-cyan-500/30'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {translateTextInstant(cat, currentLang)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
