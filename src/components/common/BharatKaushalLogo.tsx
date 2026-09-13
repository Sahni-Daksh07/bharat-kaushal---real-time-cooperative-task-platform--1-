import React from 'react';

interface BharatKaushalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inline?: boolean;
  className?: string;
}

export const BharatKaushalLogo: React.FC<BharatKaushalLogoProps> = ({
  size = 'md',
  showTagline = true,
  inline = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 44, h: 44 },
    lg: { w: 60, h: 60 },
    xl: { w: 84, h: 84 },
  }[size];

  const titleSize = {
    sm: 'text-base leading-tight',
    md: 'text-lg sm:text-xl leading-tight',
    lg: 'text-2xl leading-tight',
    xl: 'text-4xl leading-tight',
  }[size];

  const taglineSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size];

  return (
    <div
      id="bharat-kaushal-brand-logo"
      className={`flex ${inline ? 'items-center gap-3' : 'flex-col items-center text-center'} select-none ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          {/* Circular Gear with Tricolor segments */}
          <defs>
            <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>

          {/* Left Gear Arc (Navy) */}
          <path
            d="M 60 15 A 45 45 0 0 0 25 82 L 18 84 L 20 94 L 29 91 A 45 45 0 0 0 45 102 L 44 110 L 54 111 L 56 103 A 45 45 0 0 0 60 105 Z"
            fill="url(#navyGradient)"
          />
          {/* Gear teeth notches around left/bottom */}
          <path d="M 14 55 L 24 57 L 23 48 L 13 46 Z" fill="url(#navyGradient)" />
          <path d="M 23 33 L 31 38 L 36 30 L 27 25 Z" fill="url(#navyGradient)" />
          <path d="M 40 18 L 46 26 L 55 21 L 49 13 Z" fill="url(#navyGradient)" />

          {/* Top Right Gear Arc (Saffron) */}
          <path
            d="M 60 15 A 45 45 0 0 1 103 55 L 111 53 L 112 63 L 104 64 A 45 45 0 0 1 102 78 L 109 82 L 105 91 L 97 86 Z"
            fill="url(#saffronGradient)"
          />
          <path d="M 72 13 L 75 22 L 84 19 L 81 10 Z" fill="url(#saffronGradient)" />
          <path d="M 92 23 L 88 32 L 97 36 L 101 27 Z" fill="url(#saffronGradient)" />

          {/* Bottom Right Gear Arc (Green) */}
          <path
            d="M 97 86 A 45 45 0 0 1 60 105 L 60 95 A 35 35 0 0 0 88 80 Z"
            fill="url(#greenGradient)"
          />
          <path d="M 88 95 L 94 103 L 85 108 L 80 101 Z" fill="url(#greenGradient)" />
          <path d="M 68 103 L 70 112 L 60 113 L 60 104 Z" fill="url(#greenGradient)" />

          {/* Central Ashoka Chakra background spokes */}
          <circle cx="60" cy="60" r="30" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <line
              key={i}
              x1="60"
              y1="60"
              x2={60 + 28 * Math.cos((angle * Math.PI) / 180)}
              y2={60 + 28 * Math.sin((angle * Math.PI) / 180)}
              stroke="#BFDBFE"
              strokeWidth="0.8"
            />
          ))}

          {/* Worker Silhouette holding Wrench */}
          {/* Head */}
          <circle cx="58" cy="42" r="6" fill="#1E3A8A" />
          {/* Torso & Arm */}
          <path
            d="M 52 50 C 47 52, 44 60, 43 68 L 49 70 L 53 62 L 62 62 L 66 72 L 72 70 C 70 60, 66 52, 58 50 Z"
            fill="#1E3A8A"
          />
          {/* Leg stride */}
          <path d="M 44 68 L 35 84 L 41 87 L 50 74 Z" fill="#1E3A8A" />
          <path d="M 64 70 L 74 86 L 80 83 L 68 67 Z" fill="#1E3A8A" />

          {/* Wrench held diagonally */}
          <path
            d="M 44 76 L 76 46 L 80 50 L 48 80 Z"
            fill="#FFFFFF"
            stroke="#1E3A8A"
            strokeWidth="2.5"
          />
          {/* Wrench Head */}
          <path
            d="M 74 44 C 75 41, 79 40, 82 42 C 84 43, 85 46, 84 48 L 78 54 L 72 48 Z"
            fill="#FFFFFF"
            stroke="#1E3A8A"
            strokeWidth="2"
          />

          {/* Upward Dynamic Arrow / Swoop in Saffron & Green */}
          <path
            d="M 28 88 C 42 102, 70 98, 92 72 L 96 79 L 102 52 L 76 56 L 81 63 C 65 82, 45 84, 28 88 Z"
            fill="url(#saffronGradient)"
          />
          {/* Lower Green Swoosh */}
          <path
            d="M 32 94 C 48 106, 75 104, 94 82 C 82 96, 56 102, 32 94 Z"
            fill="url(#greenGradient)"
          />

          {/* Innovation star / spark near wrench */}
          <polygon
            points="86,36 88,41 93,42 89,45 90,50 86,47 82,50 83,45 79,42 84,41"
            fill="#F59E0B"
          />
        </svg>
      </div>

      <div className={inline ? 'flex flex-col text-left' : 'mt-2'}>
        <div className={`font-black tracking-wider uppercase text-slate-900 ${titleSize} flex items-center gap-1.5`}>
          <span className="text-blue-900">{t('BHARAT_n2vvg', `BHARAT`)}</span>
          <span className="text-blue-700">{t('KAUSHAL_kk67v', `KAUSHAL`)}</span>
        </div>
        {showTagline && (
          <div className={`font-medium tracking-wide text-slate-600 ${taglineSize} whitespace-nowrap`}>
            {t('Empowering_Skills__Shaping_Ind_9j6o4', `Empowering Skills, Shaping India`)}</div>
        )}
      </div>
    </div>
  );
};
