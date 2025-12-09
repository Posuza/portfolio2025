import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {FiChevronDown, FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'en', lang: 'English', short: 'EN', flag: '🇺🇸' },
  { code: 'cn', lang: '中文 (简体)', short: 'CN', flag: '🇨🇳' },
  { code: 'th', lang: 'ไทย', short: 'TH', flag: '🇹🇭' },
    { code: 'my', lang: 'မြန်မာ (Burmese)', short: 'MY', flag: '🇲🇲' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((lng) => lng.code === i18n.resolvedLanguage) || languages[0];

  const changeLanguage = (lngCode) => {
    i18n.changeLanguage(lngCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-[0.05rem] md:gap-[0.1rem] px-[0.2rem] py-[0.05px] md:px-[0.4rem] md:py-[0.15rem] } 
                   rounded-md transition-all duration-200 ${colors.border} border text-sm font-medium shadow-sm
                   hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      >
        <span className="text-base">{currentLanguage.flag}</span>
       <span className={`${colors.text.primary} hidden lg:inline font-semibold ml-1.5`}>{currentLanguage.short}</span>
        <FiChevronDown className={`${colors.text.muted}  transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-1 w-13 md:w-44 ${colors.background.primary} rounded-lg shadow-xl 
                      ${colors.border} border md:py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200`}>
          <div className={`hidden md:flex flex-1 px-3 py-2 md:text-xs font-medium ${colors.text.muted} border-b ${colors.border}`}>
            Select Language
          </div>
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`w-full text-left px-1.5 py-0.5 md:px-3 md:py-2 text-xs md:text-sm flex items-center gap-1 md:gap-3 transition-colors
                hover:${colors.background.secondary} group
                ${ i18n.resolvedLanguage === lng.code
                  ? `${colors.background.secondary} ${colors.text.primary} font-medium`
                  : `${colors.text.secondary}`
                }
              `}
            >
              <span className="text-base">{lng.flag}</span>
              <div className="hidden md:flex flex-col">
                <div className={`${i18n.resolvedLanguage === lng.code ? colors.text.primary : colors.text.secondary}`}>
                  {lng.lang}
                </div>
                <div className={`text-xs ${colors.text.muted}`}>
                  {lng.short}
                </div>
              </div>
              {i18n.resolvedLanguage === lng.code && (
                <FiCheck className={`${colors.text.primary} opacity-70`} size={16} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;