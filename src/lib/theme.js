export const THEME_STORAGE_KEY = 'corallink_theme';

export const getStoredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
};

export const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};
