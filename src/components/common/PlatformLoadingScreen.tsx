import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PlatformLoadingScreenProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export const PlatformLoadingScreen: React.FC<PlatformLoadingScreenProps> = ({
  onLoaded,
  minDurationMs = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const statusMessages = [
    { title: 'Initializing Real-Time Mesh', subtitle: 'Connecting to WebSocket broadcast clusters...' },
    { title: 'Loading Hyper-Local Catalog', subtitle: 'Syncing 146+ verified Indore trade services...' },
    { title: 'Verifying Cooperative Policies', subtitle: 'Enforcing NSQF standards & fair 94.5% artisan split...' },
    { title: 'Connecting Community Societies', subtitle: 'Routing geo-spatial dispatch and welfare safety nets...' },
    { title: 'Platform Ready', subtitle: 'Welcome to Bharat Kaushal • भारत कौशल' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const intervalMs = 25;
    const stepIncrement = 100 / (minDurationMs / intervalMs);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement + (Math.random() * 0.8 - 0.4);
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(next, 99.5);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [minDurationMs]);

  // Update status messages according to progress percentage
  useEffect(() => {
    if (progress < 25) setStatusIndex(0);
    else if (progress < 50) setStatusIndex(1);
    else if (progress < 75) setStatusIndex(2);
    else if (progress < 95) setStatusIndex(3);
    else setStatusIndex(4);
  }, [progress]);

  // Handle fade out when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        if (onLoaded) onLoaded();
      }, 350);

      const removeTimer = setTimeout(() => {
        setIsRemoved(true);
      }, 1100);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onLoaded]);

  if (isRemoved) return null;

  return (
    <div
      id="platform-splash-loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0c1938 0%, #060b19 70%, #03060f 100%)',
      }}
    >
      {/* Background Animated Ambient Lights (Tricolor Glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Saffron Aura Top-Left */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-25 animate-pulse"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)', animationDuration: '4s' }}
        />
        {/* Navy Blue Center Core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
        />
        {/* Emerald Green Aura Bottom-Right */}
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)', animationDuration: '5s' }}
        />

        {/* Subtle Geometric Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 py-8 text-center">
        {/* National / Cooperative Pillar Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-medium mb-6 shadow-inner tracking-wide animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>National Cooperative Digital Labour Platform</span>
        </div>

        {/* Animated Official Logo Presentation */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Animated Concentric Pulsing Rings */}
          <div className="absolute w-44 h-44 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-36 h-36 rounded-full border border-amber-500/25 animate-pulse" style={{ animationDuration: '2s' }} />

          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 w-32 h-32 m-auto rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-600/30 to-emerald-500/20 blur-xl" />

          {/* Official SVG Logo with Rotating Chakra Spoke effect */}
          <div className="relative z-10 p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl shadow-blue-900/40">
            <svg
              width="100"
              height="100"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <defs>
                <linearGradient id="splashSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
                <linearGradient id="splashNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="splashGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Left Gear Arc (Navy) */}
              <path
                d="M 60 15 A 45 45 0 0 0 25 82 L 18 84 L 20 94 L 29 91 A 45 45 0 0 0 45 102 L 44 110 L 54 111 L 56 103 A 45 45 0 0 0 60 105 Z"
                fill="url(#splashNavy)"
              />
              <path d="M 14 55 L 24 57 L 23 48 L 13 46 Z" fill="url(#splashNavy)" />
              <path d="M 23 33 L 31 38 L 36 30 L 27 25 Z" fill="url(#splashNavy)" />
              <path d="M 40 18 L 46 26 L 55 21 L 49 13 Z" fill="url(#splashNavy)" />

              {/* Top Right Gear Arc (Saffron) */}
              <path
                d="M 60 15 A 45 45 0 0 1 103 55 L 111 53 L 112 63 L 104 64 A 45 45 0 0 1 102 78 L 109 82 L 105 91 L 97 86 Z"
                fill="url(#splashSaffron)"
              />
              <path d="M 72 13 L 75 22 L 84 19 L 81 10 Z" fill="url(#splashSaffron)" />
              <path d="M 92 23 L 88 32 L 97 36 L 101 27 Z" fill="url(#splashSaffron)" />

              {/* Bottom Right Gear Arc (Green) */}
              <path
                d="M 97 86 A 45 45 0 0 1 60 105 L 60 95 A 35 35 0 0 0 88 80 Z"
                fill="url(#splashGreen)"
              />
              <path d="M 88 95 L 94 103 L 85 108 L 80 101 Z" fill="url(#splashGreen)" />
              <path d="M 68 103 L 70 112 L 60 113 L 60 104 Z" fill="url(#splashGreen)" />

              {/* Central White Disc */}
              <circle cx="60" cy="60" r="30" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />

              {/* Rotating Ashoka Chakra Spokes */}
              <g className="origin-center animate-spin" style={{ transformOrigin: '60px 60px', animationDuration: '14s' }}>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                  <line
                    key={i}
                    x1="60"
                    y1="60"
                    x2={60 + 28 * Math.cos((angle * Math.PI) / 180)}
                    y2={60 + 28 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#2563EB"
                    strokeWidth="1.2"
                  />
                ))}
              </g>

              {/* Worker Silhouette holding Wrench */}
              <circle cx="58" cy="42" r="6" fill="#1E3A8A" />
              <path
                d="M 52 50 C 47 52, 44 60, 43 68 L 49 70 L 53 62 L 62 62 L 66 72 L 72 70 C 70 60, 66 52, 58 50 Z"
                fill="#1E3A8A"
              />
              <path d="M 44 68 L 35 84 L 41 87 L 50 74 Z" fill="#1E3A8A" />
              <path d="M 64 70 L 74 86 L 80 83 L 68 67 Z" fill="#1E3A8A" />

              {/* Wrench held diagonally */}
              <path
                d="M 44 76 L 76 46 L 80 50 L 48 80 Z"
                fill="#FFFFFF"
                stroke="#1E3A8A"
                strokeWidth="2.5"
              />
              <path
                d="M 74 44 C 75 41, 79 40, 82 42 C 84 43, 85 46, 84 48 L 78 54 L 72 48 Z"
                fill="#FFFFFF"
                stroke="#1E3A8A"
                strokeWidth="2"
              />

              {/* Upward Dynamic Arrow / Swoop in Saffron */}
              <path
                d="M 28 88 C 42 102, 70 98, 92 72 L 96 79 L 102 52 L 76 56 L 81 63 C 65 82, 45 84, 28 88 Z"
                fill="url(#splashSaffron)"
              />
              {/* Lower Green Swoosh */}
              <path
                d="M 32 94 C 48 106, 75 104, 94 82 C 82 96, 56 102, 32 94 Z"
                fill="url(#splashGreen)"
              />

              {/* Sparkling Innovation Star */}
              <polygon
                points="86,36 88,41 93,42 89,45 90,50 86,47 82,50 83,45 79,42 84,41"
                fill="#F59E0B"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Brand Title & Tagline with Gradient Effect */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black tracking-wider uppercase">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">BHARAT</span>
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
              KAUSHAL
            </span>
          </div>
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300">
            भारत कौशल • Empowering Skills, Shaping India
          </div>
        </div>

        {/* Progress Bar with Tricolor Radiant Gradient */}
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs font-mono px-1">
            <span className="text-blue-300 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              {statusMessages[statusIndex].title}
            </span>
            <span className="text-white font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800/80 p-0.5 border border-white/10 shadow-inner overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150 ease-out shadow-lg"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #EA580C 0%, #2563EB 50%, #16A34A 100%)',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.7)',
              }}
            />
          </div>
        </div>

        {/* Status Subtitle Ticker */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs text-slate-400 transition-opacity duration-300 font-normal">
            {statusMessages[statusIndex].subtitle}
          </p>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-white/10 pt-4 w-full">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NSQF Aligned
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> WebSockets Live Sync
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>Indore Smart Pilot</span>
        </div>
      </div>
    </div>
  );
};
