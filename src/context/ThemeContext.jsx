import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('Theme loaded from localStorage:', savedTheme);
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      logo: {
        text: isDark ? 'text-sky-200' : 'text-sky-800',
        subText: isDark ? 'text-sky-100' : 'text-sky-900',
      },
      primary: isDark ? 'sky-200' : 'sky-800',
      primaryHover: isDark ? 'hover:bg-sky-300' : 'hover:bg-sky-900',
      primaryLight: isDark ? 'bg-sky-700/40' : 'bg-sky-200',
      text: {
        primary: isDark ? 'text-gray-100' : 'text-gray-900',
        secondary: isDark ? 'text-gray-300' : 'text-gray-700',
        muted: isDark ? 'text-gray-400' : 'text-gray-600'
      },
      background: {
        primary: isDark ? 'bg-gray-900' : 'bg-white',
        secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
        tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100'
      },
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      button: {
        primary: isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-sky-800 hover:bg-sky-900 text-white',
        secondary: isDark ? 'border border-2 border-gray-600 bg-gray-900 hover:bg-sky-400 text-white' : 'border border-2 broder-sky-800 bg-white hover:bg-gray-300 text-sky-800'
      },
      status: {
        0: isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
        1: isDark ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800',
        2: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
        3: isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800',
        4: isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800',
        5: isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800',
        6: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
        7: isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800',
        8: isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      },
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};