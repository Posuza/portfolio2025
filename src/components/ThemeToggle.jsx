import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`transition-colors duration-300 ${
        isDark 
          ? '  text-yellow-400' 
          : ' text-gray-700'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark 
        ? <FiSun className="w-4 h-4 md:w-5 md:h-5" />
        : <FiMoon className="w-4 h-4 md:w-5 md:h-5" />
      }
    </button>
  );
};

export default ThemeToggle;