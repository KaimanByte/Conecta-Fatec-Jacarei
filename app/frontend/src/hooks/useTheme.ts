import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return {
    theme,
    isDarkMode: theme === 'dark',
    setLightMode: () => setTheme('light'),
    setDarkMode: () => setTheme('dark'),
  };
}
