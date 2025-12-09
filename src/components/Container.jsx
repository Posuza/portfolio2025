import React from 'react';

const Container = ({ children, className = '' }) => {  
  return (
    <div className={`container mx-auto px-1 md:px-4 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;