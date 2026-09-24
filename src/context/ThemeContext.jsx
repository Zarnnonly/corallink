import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { THEME_STORAGE_KEY, getStoredTheme, getSystemTheme, applyTheme } from '../lib/theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const THEME_META_COLORS = { light: '#286C83', dark: '#0F1E24' };

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getStoredTheme() || getSystemTheme());

  useEffect(() => {
    applyTheme(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_META_COLORS[theme]);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = (e) => {
      if (!getStoredTheme()) setTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
