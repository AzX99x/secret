import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        className="group relative p-3 sm:p-3.5 rounded-full bg-slate-900/95 dark:bg-cyan-950/95 text-cyan-400 border border-cyan-500/50 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
        title="Scroll back to top"
      >
        {/* Outer Rotating Glowing Spinner Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 opacity-60 blur-xs animate-spin pointer-events-none" />

        {/* Inner Dark Badge Container */}
        <span className="relative z-10 flex items-center justify-center pointer-events-none">
          <ArrowUp className="w-5 h-5 text-cyan-400 group-hover:-translate-y-1 transition-transform duration-300 stroke-[2.5]" />
        </span>
      </button>
    </div>
  );
};
