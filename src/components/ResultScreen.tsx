import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface ResultScreenProps {
  outcome: 'accepted' | 'declined';
  onReset?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ outcome }) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const floatingElements = useMemo(() => {
    const count = isMobile ? 12 : 20;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${6 + Math.random() * 88}%`,
      size: (isMobile ? 14 : 16) + Math.random() * (isMobile ? 14 : 22),
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.45,
      drift: (Math.random() - 0.5) * 60,
      isRing: i % 3 === 0,
    }));
  }, [isMobile]);

  if (outcome === 'accepted') {
    return (
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-sm sm:max-w-md w-full mx-auto select-none">
        {/* Floating rising hearts and rings for celebration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 gpu-layer" aria-hidden="true">
          {floatingElements.map((el) => (
            <motion.div
              key={el.id}
              initial={{ y: '108vh', opacity: 0, x: 0 }}
              animate={{
                y: '-18vh',
                opacity: [0, el.opacity, el.opacity, 0],
                x: el.drift,
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: 'easeInOut',
              }}
              className="absolute will-change-transform"
              style={{ left: el.left }}
            >
              {el.isRing ? (
                <span style={{ fontSize: `${el.size}px` }}>💍</span>
              ) : (
                <Heart
                  className="text-rose-400 fill-rose-400/40"
                  style={{ width: `${el.size}px`, height: `${el.size}px` }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Cinematic Acceptance Content */}
        <motion.main
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-col items-center text-center w-full"
          role="region"
          aria-label="Marriage Acceptance response"
        >
          {/* Subtle glowing ring emblem */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="mb-4 sm:mb-5 relative"
          >
            <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-lg sm:blur-xl animate-pulse" />
            <div className="relative p-3.5 sm:p-4 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-xl shadow-amber-950/60">
              <span className="text-3xl sm:text-4xl">💍</span>
            </div>
          </motion.div>

          {/* Heading: She Said YES! 💍❤️ */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-xs sm:text-sm uppercase tracking-widest text-amber-300 font-semibold mb-1"
          >
            She Said YES! 💍
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-glow text-white mb-2 sm:mb-3"
          >
            Thank you, Meenu <span className="inline-block text-rose-400">❤️</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="font-serif italic text-lg sm:text-xl md:text-2xl text-pink-100/95 font-light tracking-wide max-w-[280px] sm:max-w-xs mb-5"
          >
            "Forever begins today."
          </motion.p>

          {/* Sincere Marriage Promise Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="glass-panel px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border border-pink-400/25 shadow-xl max-w-xs sm:max-w-sm flex items-start gap-2.5 text-left"
          >
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-sans text-pink-100/90 leading-relaxed">
              I promise to love you, cherish you, stand by you through every storm, and celebrate every joy with you for the rest of our lives. Forever yours. 💍❤️
            </p>
          </motion.div>
        </motion.main>
      </div>
    );
  }

  // Outcome: declined
  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-sm sm:max-w-md w-full mx-auto select-none">
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center text-center w-full"
        role="region"
        aria-label="Respectful response"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-full bg-purple-900/20 border border-pink-400/20"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300/80" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-glow text-white mb-3"
        >
          I understand <span className="inline-block text-rose-400">❤️</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="font-serif italic text-base sm:text-lg md:text-xl text-pink-100/90 font-light tracking-wide max-w-[280px] sm:max-w-xs"
        >
          "Your feelings and your happiness will always matter to me."
        </motion.p>
      </motion.main>
    </div>
  );
};
