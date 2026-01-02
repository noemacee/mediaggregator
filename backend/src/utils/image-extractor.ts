import { RssItem, ImageExtractionResult } from '../models/types';

/**
 * Extract image URL from RSS item
 * Priority: media:content > media:thumbnail > enclosure > HTML content
 */
export const extractImageFromRssItem = (item: RssItem): ImageExtractionResult | null => {
  // 1. Try media:content (highest quality)
  if (item['media:content'] && item['media:content'].length > 0) {
    const mediaContent = item['media:content'][0];
    if (mediaContent.$ && mediaContent.$.url) {
      return {
        url: mediaContent.$.url,
        width: mediaContent.$.width ? parseInt(mediaContent.$.width) : undefined,
        height: mediaContent.$.height ? parseInt(mediaContent.$.height) : undefined,
        source: 'media:content'
      };
    }
  }

  // 2. Try media:thumbnail
  if (item['media:thumbnail'] && item['media:thumbnail'].length > 0) {
    const mediaThumbnail = item['media:thumbnail'][0];
    if (mediaThumbnail.$ && mediaThumbnail.$.url) {
      return {
        url: mediaThumbnail.$.url,
        width: mediaThumbnail.$.width ? parseInt(mediaThumbnail.$.width) : undefined,
        height: mediaThumbnail.$.height ? parseInt(mediaThumbnail.$.height) : undefined,
        source: 'media:thumbnail'
      };
    }
  }

  // 3. Try enclosure (often used for images/media)
  if (item.enclosure && item.enclosure.url) {
    const isImage = item.enclosure.type?.startsWith('image/');
    if (isImage) {
      return {
        url: item.enclosure.url,
        source: 'enclosure'
      };
    }
  }

  // 4. Try extracting from HTML content/description
  const htmlContent = item.content || item.contentSnippet || '';
  const imageUrl = extractImageFromHtml(htmlContent);
  if (imageUrl) {
    return {
      url: imageUrl,
      source: 'html'
    };
  }

  return null;
};

/**
 * Extract first image URL from HTML content
 */
export const extractImageFromHtml = (html: string): string | null => {
  if (!html) return null;

  // Match <img> tags with src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const match = imgRegex.exec(html);

  if (match && match[1]) {
    const url = match[1];
    // Filter out tracking pixels and small images
    if (url.includes('1x1') || url.includes('pixel') || url.includes('tracker')) {
      return null;
    }
    return url;
  }

  return null;
};

/**
 * Check if an image URL looks like a cover image
 */
const isLikelyCoverImage = (url: string): boolean => {
  const urlLower = url.toLowerCase();
  const coverKeywords = [
    'cover', 'couverture', 'une', 'front', 'magazine', 'journal',
    'edition', 'édition', 'numero', 'numéro', 'issue', 'page-1'
  ];
  
  return coverKeywords.some(keyword => urlLower.includes(keyword));
};

/**
 * Get the best quality image from a list of articles
 * Used to select publication cover image
 * Prioritizes images that look like covers (contain keywords like "cover", "une", etc.)
 */
export const selectBestCoverImage = (imageUrls: string[]): string | null => {
  if (imageUrls.length === 0) return null;

  // First, try to find images that look like covers
  const coverImages = imageUrls.filter(url => isLikelyCoverImage(url));
  if (coverImages.length > 0) {
    return coverImages[0];
  }

  // If no obvious cover images, prefer larger images (check URL patterns)
  // Many sites use size indicators in URLs (e.g., _large, _800x600, etc.)
  const largeImages = imageUrls.filter(url => {
    const urlLower = url.toLowerCase();
    return urlLower.includes('large') || 
           urlLower.includes('big') || 
           urlLower.match(/\d{3,4}x\d{3,4}/); // Dimensions like 800x600
  });
  
  if (largeImages.length > 0) {
    return largeImages[0];
  }

  // Fallback to first image
  return imageUrls[0];
};

/**
 * Validate image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    // Check if it's http/https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Accept URLs (CDNs often don't have extensions, so we don't check)
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Extract all images from RSS items
 */
export const extractAllImages = (items: RssItem[]): string[] => {
  const images: string[] = [];

  for (const item of items) {
    const imageResult = extractImageFromRssItem(item);
    if (imageResult && isValidImageUrl(imageResult.url)) {
      images.push(imageResult.url);
    }
  }

  return images;
};
