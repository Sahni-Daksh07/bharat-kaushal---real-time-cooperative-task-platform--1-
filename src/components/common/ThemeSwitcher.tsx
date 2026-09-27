import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  variant?: 'icon' | 'segmented' | 'badge';
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'icon',
  className = '',
  showLabel = false,
}) => {
  const { theme, isStarryNight, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl border text-xs font-semibold backdrop-blur-md transition-colors ${
          isStarryNight
            ? 'bg-[#0b132b]/80 border-white/10 text-slate-300'
            : 'bg-white/80 border-slate-200 text-slate-700 shadow-xs'
        } ${className}`}
        role="group"
        aria-label="Theme Selection"
      >
        <button
          onClick={() => setTheme('starry-night')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            isStarryNight
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 font-bold'
              : 'hover:text-slate-900 text-slate-500'
          }`}
          aria-pressed={isStarryNight}
          title="Switch to Starry Night celestial theme"
        >
          <Sparkles size={13} className={isStarryNight ? 'text-amber-300 animate-pulse' : ''} />
          <span>Starry Night</span>
        </button>

        <button
          onClick={() => setTheme('daylight')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            !isStarryNight
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'hover:text-white text-slate-400'
          }`}
          aria-pressed={!isStarryNight}
          title="Switch to Daylight cream theme"
        >
          <Sun size={13} className={!isStarryNight ? 'text-slate-950' : ''} />
          <span>Daylight</span>
        </button>
      </div>
    );
  }

  // Default 'icon' toggle button
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isStarryNight ? 'Daylight' : 'Starry Night'} theme`}
      title={isStarryNight ? 'Starry Night Active • Click for Daylight' : 'Daylight Active • Click for Starry Night'}
      className={`relative h-8 px-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all border outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 ${
        isStarryNight
          ? 'bg-slate-900/70 border-white/15 text-slate-200 hover:text-white hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isStarryNight ? (
          <motion.div
            key="starry"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-1.5 text-blue-400"
          >
            <div className="relative">
              <Moon size={14} className="fill-blue-400/20 text-blue-400" />
              <Sparkles size={8} className="absolute -top-1 -right-1 text-amber-300 animate-pulse" />
            </div>
            {showLabel && <span className="text-[11px] font-semibold text-slate-200">Starry</span>}
          </motion.div>
        ) : (
          <motion.div
            key="daylight"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-1.5 text-amber-500"
          >
            <Sun size={14} className="fill-amber-400 text-amber-500" />
            {showLabel && <span className="text-[11px] font-semibold text-slate-700">Daylight</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
