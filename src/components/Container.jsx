import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Container = ({ children, className = '' }) => {
  const { colors } = useTheme();
  
  return (
    <div className={`container mx-auto px-1 md:px-4 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;