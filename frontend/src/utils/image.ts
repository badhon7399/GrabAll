/**
 * Optimizes image URLs for production performance.
 * Dynamically injects format, quality, and width transforms for Cloudinary and Unsplash URLs.
 * 
 * @param url The raw image URL
 * @param width The target width for the image
 * @returns The optimized image URL
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return '';

  // Cloudinary Optimization
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/image/upload/');
    if (parts.length === 2) {
      const transform = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
      return `${parts[0]}/image/upload/${transform}/${parts[1]}`;
    }
  }

  // Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      if (width) {
        urlObj.searchParams.set('w', width.toString());
      }
      urlObj.searchParams.set('q', '80');
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  return url;
}
