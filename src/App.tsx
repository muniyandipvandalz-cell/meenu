import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PetalCanvas } from './components/PetalCanvas';
import { AmbientStarfield } from './components/AmbientStarfield';
import { ProposalCard } from './components/ProposalCard';
import { ResultScreen } from './components/ResultScreen';
import { AudioController } from './components/AudioController';
import { sendPhoneNotification, notifySiteOpened } from './services/notificationService';

export const App: React.FC = () => {
  const [outcome, setOutcome] = useState<'idle' | 'accepted' | 'declined'>('idle');
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  useEffect(() => {
    // Notify when visitor opens the page
    notifySiteOpened();
  }, []);

  const handleInteraction = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [hasUserInteracted]);

  const handleSelectYes = useCallback((dodgeCount?: number) => {
    setOutcome('accepted');
    sendPhoneNotification('accepted', { dodgeCount });

    try {
      const count = 150;
      const defaults = {
        origin: { y: 0.65 },
        zIndex: 30,
        disableForReducedMotion: true,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      // Multi-stage golden-rose wedding confetti
      fire(0.25, {
        spread: 45,
        startVelocity: 50,
        colors: ['#f59e0b', '#fbbf24', '#ff7597', '#f43f5e'],
      });

      fire(0.2, {
        spread: 70,
        colors: ['#ffe4e6', '#ffd700', '#f472b6'],
      });

      fire(0.35, {
        spread: 110,
        decay: 0.91,
        scalar: 0.95,
        colors: ['#fbbf24', '#f43f5e', '#ffffff'],
      });

      fire(0.1, {
        spread: 130,
        startVelocity: 30,
        decay: 0.92,
        scalar: 1.25,
        colors: ['#ffd700', '#fb7185'],
      });

      fire(0.1, {
        spread: 140,
        startVelocity: 50,
        colors: ['#ffb6c1', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleSelectNo = useCallback(() => {
    setOutcome('declined');
    sendPhoneNotification('declined');
  }, []);

  return (
    <div
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between items-center pt-safe pb-safe pl-safe pr-safe bg-[#080312]"
    >
      <AmbientStarfield />

      <PetalCanvas
        intensity={outcome === 'accepted' ? 'celebration' : 'normal'}
      />

      <AudioController hasUserInteracted={hasUserInteracted} />

      <div className="flex-1 w-full flex items-center justify-center relative z-20">
        <AnimatePresence mode="wait">
          {outcome === 'idle' && (
            <ProposalCard
              key="proposal-card-meenu"
              onSelectYes={handleSelectYes}
              onSelectNo={handleSelectNo}
              onInteraction={handleInteraction}
            />
          )}

          {outcome === 'accepted' && (
            <ResultScreen key="result-accepted-meenu" outcome="accepted" />
          )}

          {outcome === 'declined' && (
            <ResultScreen key="result-declined-meenu" outcome="declined" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
