import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { getTodayDate } from '../utils/date-utils';

/**
 * Scrape actual publication cover images from media websites
 * Each publication has a different structure, so we need custom scrapers
 */

interface CoverScraperResult {
  coverUrl: string | null;
  error?: string;
}

/**
 * Le Monde - ePaper cover
 */
const scrapeLeMondeCover = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://www.lemonde.fr/le-journal-du-jour/');
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Look for the cover image
    const coverImg = doc.querySelector('img[alt*="Une"]') || doc.querySelector('.journal__cover img');
    if (coverImg) {
      return coverImg.getAttribute('src') || coverImg.getAttribute('data-src');
    }
  } catch (error) {
    logger.error('Failed to scrape Le Monde cover:', error);
  }
  return null;
};

/**
 * Le Figaro - ePaper cover
 */
const scrapeLeFigaroCover = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://www.lefigaro.fr/le-journal-du-jour');
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const coverImg = doc.querySelector('.journal-cover img') || doc.querySelector('[data-testid="cover-image"]');
    if (coverImg) {
      return coverImg.getAttribute('src') || coverImg.getAttribute('data-src');
    }
  } catch (error) {
    logger.error('Failed to scrape Le Figaro cover:', error);
  }
  return null;
};

/**
 * Libération - ePaper cover
 */
const scrapeLibeCover = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://www.liberation.fr/le-journal-du-jour');
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const coverImg = doc.querySelector('.journal-cover img') || doc.querySelector('img[alt*="Une"]');
    if (coverImg) {
      return coverImg.getAttribute('src') || coverImg.getAttribute('data-src');
    }
  } catch (error) {
    logger.error('Failed to scrape Libé cover:', error);
  }
  return null;
};

/**
 * Main cover scraper mapping
 */
const coverScrapers: Record<string, () => Promise<string | null>> = {
  'le-monde': scrapeLeMondeCover,
  'le-figaro': scrapeLeFigaroCover,
  'liberation': scrapeLibeCover,
  // Add more scrapers as needed
};

/**
 * Scrape cover for a specific media source
 */
export const scrapeCoverForSource = async (slug: string): Promise<CoverScraperResult> => {
  const scraper = coverScrapers[slug];

  if (!scraper) {
    return {
      coverUrl: null,
      error: `No scraper available for ${slug}`
    };
  }

  try {
    const coverUrl = await scraper();
    return { coverUrl };
  } catch (error) {
    return {
      coverUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update publication covers for today
 */
export const updateTodayPublicationCovers = async (): Promise<void> => {
  const today = getTodayDate();

  logger.info('Starting publication cover scraping for today...');

  // Get all today's publications
  const { data: publications, error } = await supabase
    .from('publications')
    .select(`
      *,
      media_source:media_sources (slug, name)
    `)
    .eq('publication_date', today);

  if (error || !publications) {
    logger.error('Failed to fetch publications:', error);
    return;
  }

  let successCount = 0;

  for (const pub of publications) {
    const slug = (pub as any).media_source?.slug;
    if (!slug) continue;

    logger.info(`Scraping cover for ${(pub as any).media_source?.name}...`);

    const result = await scrapeCoverForSource(slug);

    if (result.coverUrl) {
      // Update publication with cover URL
      const { error: updateError } = await supabase
        .from('publications')
        .update({ cover_image_url: result.coverUrl })
        .eq('id', pub.id);

      if (!updateError) {
        successCount++;
        logger.info(`✓ Updated cover for ${(pub as any).media_source?.name}`);
      } else {
        logger.error(`Failed to update cover for ${(pub as any).media_source?.name}:`, updateError);
      }
    } else {
      logger.warn(`✗ No cover found for ${(pub as any).media_source?.name}: ${result.error || 'Unknown reason'}`);
    }

    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  logger.info(`Cover scraping complete: ${successCount}/${publications.length} covers updated`);
};
