import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'starry-night' | 'daylight';

interface ThemeContextType {
  theme: ThemeMode;
  isStarryNight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'bk_theme_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'daylight' || saved === 'starry-night') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'starry-night';
  });

  const isStarryNight = theme === 'starry-night';

  const applyThemeToDOM = (activeTheme: ThemeMode) => {
    const root = document.documentElement;
    const body = document.body;

    if (activeTheme === 'starry-night') {
      root.classList.add('dark', 'theme-starry-night');
      root.classList.remove('light', 'theme-daylight');
      body.classList.add('theme-starry-night');
      body.classList.remove('theme-daylight');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light', 'theme-daylight');
      root.classList.remove('dark', 'theme-starry-night');
      body.classList.add('theme-daylight');
      body.classList.remove('theme-starry-night');
      root.style.colorScheme = 'light';
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'starry-night' ? 'daylight' : 'starry-night'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isStarryNight, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
