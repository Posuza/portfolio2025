import React, { useState } from 'react';
import { getImageSrcSet } from '../utils/imageUrl';

/**
 * Component that tries multiple Google Drive image URL formats
 * Falls back to next format if one fails to load
 */
export default function DriveImage({ src, alt, className, fallback }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  
  const srcSet = getImageSrcSet(src);
  
  const handleError = () => {
    // Try next URL format
    if (currentIndex < srcSet.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All formats failed
      setFailed(true);
    }
  };
  
  if (!src || failed || srcSet.length === 0) {
    return fallback || null;
  }
  
  return (
    <img
      src={srcSet[currentIndex]}
      alt={alt}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
}
