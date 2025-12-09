
export function toUcUrl(url) {
  if (!url) return url;
  
  const s = String(url);
  
  // If it's a data URL, return as-is
  if (s.startsWith('data:')) return s;
  
  // Extract file ID from ANY Google Drive/Google URL format
  const match = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  
  if (match) {
    const fileId = match[1];
    // Try multiple formats - browser will use first one that works
    // This creates an image with multiple source fallbacks
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Return original URL if we can't extract an ID
  return s;
}

/**
 * Extract file ID from any Google Drive URL
 */
export function extractFileId(url) {
  if (!url) return null;
  const s = String(url);
  const match = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Get all possible image URLs to try (for fallback)
 */
export function getImageSrcSet(url) {
  if (!url) return [];
  
  const s = String(url);
  
  // If it's a data URL, just return it
  if (s.startsWith('data:')) return [s];
  
  // Extract file ID
  const fileId = extractFileId(url);
  if (!fileId) return [url]; // Return original if can't extract ID
  
  // Return multiple formats to try
  return [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
  ];
}

/**
 * Get image source with error handling
 * Returns placeholder if image URL is invalid or empty
 */
export function getImageSrc(url, placeholder = '') {
  if (!url) return placeholder;
  
  // If it's a data URL (base64), return as is
  if (String(url).startsWith('data:')) return url;
  
  // Convert Drive URLs to uc format
  return toUcUrl(url);
}

const imageUrlUtils = { toUcUrl, getImageSrc };
export default imageUrlUtils;
