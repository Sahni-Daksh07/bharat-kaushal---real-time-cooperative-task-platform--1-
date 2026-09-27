import React, { useState, useEffect } from 'react';

interface PlatformLoadingScreenProps {
  onLoaded?: () => void;
  durationMs?: number;
}

export const PlatformLoadingScreen: React.FC<PlatformLoadingScreenProps> = ({
  onLoaded,
  durationMs = 650,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(() => {
    try {
      return sessionStorage.getItem('bk_splash_shown') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isRemoved) {
      if (onLoaded) onLoaded();
      return;
    }

    try {
      sessionStorage.setItem('bk_splash_shown', 'true');
    } catch {
      // ignore
    }

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      if (onLoaded) onLoaded();
    }, durationMs);

    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
    }, durationMs + 400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [durationMs, onLoaded, isRemoved]);

  if (isRemoved) return null;

  return (
    <div
      id="platform-splash-loader"
      className={`fixed inset-0 z-[99999] flex items-center justify-center select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0c1938 0%, #060b19 70%, #03060f 100%)',
      }}
    >
      {/* Ambient Glow Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, #ea580c 50%, #16a34a 100%)', animationDuration: '3s' }}
        />
      </div>

      {/* Centered Animated Official Logo */}
      <div className="relative flex items-center justify-center">
        {/* Animated Concentric Pulsing Rings */}
        <div className="absolute w-52 h-52 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute w-44 h-44 rounded-full border border-amber-500/25 animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-pulse" style={{ animationDuration: '2.8s' }} />

        {/* Glowing Aura Ring */}
        <div className="absolute inset-0 w-36 h-36 m-auto rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-600/30 to-emerald-500/20 blur-xl" />

        {/* Official SVG Logo */}
        <div className="relative z-10 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-950/60 transform transition-transform duration-500 hover:scale-105">
          <svg
            width="110"
            height="110"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="logoSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
              <linearGradient id="logoNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="logoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Left Gear Arc (Navy) */}
            <path
              d="M 60 15 A 45 45 0 0 0 25 82 L 18 84 L 20 94 L 29 91 A 45 45 0 0 0 45 102 L 44 110 L 54 111 L 56 103 A 45 45 0 0 0 60 105 Z"
              fill="url(#logoNavy)"
            />
            <path d="M 14 55 L 24 57 L 23 48 L 13 46 Z" fill="url(#logoNavy)" />
            <path d="M 23 33 L 31 38 L 36 30 L 27 25 Z" fill="url(#logoNavy)" />
            <path d="M 40 18 L 46 26 L 55 21 L 49 13 Z" fill="url(#logoNavy)" />

            {/* Top Right Gear Arc (Saffron) */}
            <path
              d="M 60 15 A 45 45 0 0 1 103 55 L 111 53 L 112 63 L 104 64 A 45 45 0 0 1 102 78 L 109 82 L 105 91 L 97 86 Z"
              fill="url(#logoSaffron)"
            />
            <path d="M 72 13 L 75 22 L 84 19 L 81 10 Z" fill="url(#logoSaffron)" />
            <path d="M 92 23 L 88 32 L 97 36 L 101 27 Z" fill="url(#logoSaffron)" />

            {/* Bottom Right Gear Arc (Green) */}
            <path
              d="M 97 86 A 45 45 0 0 1 60 105 L 60 95 A 35 35 0 0 0 88 80 Z"
              fill="url(#logoGreen)"
            />
            <path d="M 88 95 L 94 103 L 85 108 L 80 101 Z" fill="url(#logoGreen)" />
            <path d="M 68 103 L 70 112 L 60 113 L 60 104 Z" fill="url(#logoGreen)" />

            {/* Central White Disc */}
            <circle cx="60" cy="60" r="30" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />

            {/* Rotating Ashoka Chakra Spokes */}
            <g className="origin-center animate-spin" style={{ transformOrigin: '60px 60px', animationDuration: '10s' }}>
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

            {/* Wrench */}
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
              fill="url(#logoSaffron)"
            />
            {/* Lower Green Swoosh */}
            <path
              d="M 32 94 C 48 106, 75 104, 94 82 C 82 96, 56 102, 32 94 Z"
              fill="url(#logoGreen)"
            />

            {/* Innovation Star */}
            <polygon
              points="86,36 88,41 93,42 89,45 90,50 86,47 82,50 83,45 79,42 84,41"
              fill="#F59E0B"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
