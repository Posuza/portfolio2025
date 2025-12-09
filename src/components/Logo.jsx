import React from 'react';
import { useTheme } from '../context/ThemeContext';
import tabLogo from '../assets/tab-logo.png';

const Logo = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  textColor = null,      // null means use theme colors
  subTextColor = null    // null means use theme colors
}) => {
  const { colors } = useTheme();

  // Use theme colors if no custom colors provided
  const finalSubTextColor = subTextColor || colors.logo.subText;



  return (
    <div className={`flex items-center ${className}`}>
      {/* Tab Logo (Icon) */}
      <div className="w-9 h-9  md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
        <img 
          src={tabLogo} 
          alt="GUTS Logo Icon" 
          className=" sm:w-12 sm:h-12 lg:w-14 lg:h-14  object-contain transition-opacity duration-300"
        />
      </div>
      
      {/* Main Logo with Text */}
      {showText && (
        <div className="flex flex-col justify-center items-start">
          <h1 className={`text-lg gap-1 font-bold ${colors.text.secondary}`}>Paing Hein Thet Mon</h1>

          {/* <img 
            src={logo} 
            alt="GUTS Investigation Logo" 
            className="h-4 md:h-5  w-auto object-contain mb-1 transition-opacity duration-300"
            onError={() => setLogoError(true)}
            onLoad={() => setLogoError(false)}
          /> */}
          <span className={`text-[10px] md:text-sm  font-medium ${finalSubTextColor} leading-tight transition-colors duration-300`}>
          My Creations & Arts
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;