import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioControllerProps {
  hasUserInteracted: boolean;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const YOUTUBE_VIDEO_ID = 'XHu2v3piSOU'; // "Engagement Ring (Background Score)" by Anirudh Ravichander

export const AudioController: React.FC<AudioControllerProps> = ({ hasUserInteracted }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [ytReady, setYtReady] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        try {
          playerRef.current = new window.YT.Player('meenu-yt-audio-player', {
            height: '1',
            width: '1',
            videoId: YOUTUBE_VIDEO_ID,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              loop: 1,
              playlist: YOUTUBE_VIDEO_ID,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: (event: any) => {
                setYtReady(true);
                event.target.setVolume(85);
              },
              onStateChange: (event: any) => {
                if (window.YT) {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    setIsPlaying(true);
                  } else if (
                    event.data === window.YT.PlayerState.PAUSED ||
                    event.data === window.YT.PlayerState.ENDED
                  ) {
                    setIsPlaying(false);
                  }
                }
              },
            },
          });
        } catch {
          // If YouTube embed fails, fallback to Web Audio
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
      }
    };
  }, []);

  // Web Audio Fallback Synthesizer
  const initSynth = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;
    } catch {}
  };

  const playSynthTone = (freq: number, startTime: number, duration: number, volume: number = 0.08) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(master);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  };

  const startSynthLoop = () => {
    initSynth();
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.8);

    const CHORDS = [
      [293.66, 369.99, 440.0, 587.33],
      [220.0, 329.63, 440.0, 554.37],
      [246.94, 293.66, 369.99, 493.88],
      [196.0, 293.66, 392.0, 493.88],
    ];

    let chordIdx = 0;
    const tick = () => {
      const now = ctx.currentTime;
      const notes = CHORDS[chordIdx % CHORDS.length];
      playSynthTone(notes[0], now, 3.8, 0.12);
      for (let i = 1; i < notes.length; i++) {
        playSynthTone(notes[i], now + 0.35 * i, 3.2, 0.08);
      }
      chordIdx++;
    };

    tick();
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    synthIntervalRef.current = window.setInterval(tick, 4000);
    setIsPlaying(true);
  };

  const stopSynth = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (master && ctx) {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Play music (prioritizing YouTube track, falling back to Web Audio synth)
  const playTrack = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
        return;
      } catch {}
    }
    startSynthLoop();
  };

  const pauseTrack = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch {}
    }
    stopSynth();
    setIsPlaying(false);
  };

  const handleToggle = () => {
    if (isPlaying && !isMuted) {
      setIsMuted(true);
      pauseTrack();
    } else {
      setIsMuted(false);
      playTrack();
    }
  };

  useEffect(() => {
    if (hasUserInteracted && !isPlaying && !isMuted) {
      playTrack();
    }
  }, [hasUserInteracted, isMuted, isPlaying, ytReady]);

  useEffect(() => {
    return () => {
      stopSynth();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      {/* Hidden YouTube IFrame Player */}
      <div
        className="fixed -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id="meenu-yt-audio-player" />
      </div>

      {/* Floating Music Toggle Button */}
      <div className="fixed top-3 right-3 z-50 pt-safe pr-safe pointer-events-auto">
        <button
          onClick={handleToggle}
          type="button"
          className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full glass-panel border border-pink-400/25 text-pink-200/90 hover:text-pink-100 hover:border-pink-300/40 hover:bg-rose-950/40 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40"
          aria-label={isPlaying ? 'Mute song' : 'Play song: Engagement Ring (Anirudh)'}
          title="Engagement Ring (Background Score) - Anirudh"
        >
          <span className="relative flex h-2 w-2">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isPlaying ? 'bg-rose-400' : 'bg-gray-500'
              }`}
            />
          </span>

          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300/60" />
          )}

          <div className="flex items-center gap-1">
            <Music className="w-3 h-3 text-pink-400/80" />
            <span className="text-[11px] sm:text-xs font-serif italic tracking-wide text-pink-200/90 group-hover:text-pink-100 whitespace-nowrap">
              {isPlaying ? 'Engagement Ring 🎵' : 'Play Song 🎵'}
            </span>
          </div>
        </button>
      </div>
    </>
  );
};
