import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { parseRssDate, getTodayDate } from '../utils/date-utils';
import { extractImageFromRssItem, extractAllImages, selectBestCoverImage } from '../utils/image-extractor';
import { MediaSource, RssFeed, FetchResult, Article } from '../models/types';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail', { keepArray: true }]
    ]
  }
});

/**
 * Fetch and parse a single RSS feed
 */
const fetchRssFeed = async (
  feedUrl: string,
  timeout: number = 10000
): Promise<Parser.Output<any>> => {
  try {
    // Fetch with custom headers to avoid 403 errors
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Mediaggregator/1.0; +https://mediaggregator.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      timeout
    });

    if (!response.ok) {
      throw new Error(`Status code ${response.status}`);
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);
    return feed;
  } catch (error) {
    throw error;
  }
};

/**
 * Store articles from RSS feed in database
 */
const storeArticles = async (
  items: any[],
  mediaSource: MediaSource,
  rssFeed: RssFeed,
  publicationId: string
): Promise<number> => {
  let storedCount = 0;

  for (const item of items) {
    try {
      // Extract image from RSS item
      const imageResult = extractImageFromRssItem(item);

      // Prepare article data
      const articleData: Partial<Article> = {
        media_source_id: mediaSource.id,
        rss_feed_id: rssFeed.id,
        publication_id: publicationId,
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.description,
        content: item.content,
        author: item.creator || item.author,
        published_at: parseRssDate(item.pubDate || item.isoDate),
        article_url: item.link,
        image_url: imageResult?.url,
        category: item.categories?.[0],
        guid: item.guid || item.link
      };

      // Insert article (on conflict do nothing - avoid duplicates)
      const { error } = await supabase
        .from('articles')
        .upsert(articleData, { onConflict: 'guid', ignoreDuplicates: true });

      if (!error) {
        storedCount++;
      } else if (error.code !== '23505') {
        // Ignore duplicate errors, log others
        logger.warn(`Error storing article: ${error.message}`);
      }
    } catch (error) {
      logger.error(`Failed to store individual article:`, error);
    }
  }

  return storedCount;
};

/**
 * Try to find cover image from RSS feed metadata
 */
const findCoverFromFeedMetadata = async (feedUrl: string): Promise<string | null> => {
  try {
    const feed = await fetchRssFeed(feedUrl);
    
    // Check feed image (often the publication cover)
    if (feed.image?.url) {
      return feed.image.url;
    }
    
    // Check for itunes:image (some feeds use this)
    if ((feed as any)['itunes:image']?.[0]?.$.href) {
      return (feed as any)['itunes:image'][0].$.href;
    }
    
    return null;
  } catch (error) {
    logger.debug('Could not extract cover from feed metadata:', error);
    return null;
  }
};

/**
 * Try common cover image URL patterns for a media source
 */
const tryCommonCoverPatterns = async (mediaSource: MediaSource): Promise<string | null> => {
  if (!mediaSource.website_url) return null;
  
  try {
    const baseUrl = new URL(mediaSource.website_url).origin;
    const commonPaths = [
      '/cover.jpg',
      '/couverture.jpg',
      '/une.jpg',
      '/front.jpg',
      '/magazine-cover.jpg',
      '/journal-cover.jpg',
      '/images/cover.jpg',
      '/images/couverture.jpg',
      '/images/une.jpg',
      '/static/cover.jpg',
      '/assets/cover.jpg'
    ];
    
    // Try a few common patterns (don't check all to avoid too many requests)
    for (const path of commonPaths.slice(0, 3)) {
      try {
        const testUrl = `${baseUrl}${path}`;
        const response = await fetch(testUrl, { method: 'HEAD', timeout: 2000 });
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          return testUrl;
        }
      } catch {
        // Continue to next pattern
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return null;
};

/**
 * Create or update publication for today
 */
const createOrUpdatePublication = async (
  mediaSource: MediaSource,
  articles: any[],
  rssFeedUrl: string | null = null
): Promise<string | null> => {
  const today = getTodayDate();

  try {
    // Priority 1: Try to get cover from RSS feed metadata
    let coverImageUrl: string | null = null;
    if (rssFeedUrl) {
      coverImageUrl = await findCoverFromFeedMetadata(rssFeedUrl);
    }
    
    // Priority 2: Extract all images from articles and find best cover
    if (!coverImageUrl) {
      const allImages = extractAllImages(articles);
      coverImageUrl = selectBestCoverImage(allImages);
    }
    
    // Priority 3: Try common cover URL patterns
    if (!coverImageUrl) {
      coverImageUrl = await tryCommonCoverPatterns(mediaSource);
    }
    
    // Priority 4: Fallback to media source defaults
    if (!coverImageUrl) {
      coverImageUrl = mediaSource.cover_image_url || mediaSource.logo_url || null;
    }

    // Check if publication exists for today
    const { data: existing } = await supabase
      .from('publications')
      .select('id')
      .eq('media_source_id', mediaSource.id)
      .eq('publication_date', today)
      .single();

    if (existing) {
      // Update existing publication
      const { data, error } = await supabase
        .from('publications')
        .update({
          cover_image_url: coverImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating publication:`, error);
        return null;
      }
      return data.id;
    } else {
      // Create new publication
      const { data, error } = await supabase
        .from('publications')
        .insert({
          media_source_id: mediaSource.id,
          title: `${mediaSource.name} - ${today}`,
          publication_date: today,
          cover_image_url: coverImageUrl,
          description: `${mediaSource.name} edition for ${today}`,
          source_url: mediaSource.website_url,
          is_latest: true
        })
        .select()
        .single();

      if (error) {
        logger.error(`Error creating publication:`, error);
        return null;
      }

      // Mark other publications from this source as not latest
      await supabase
        .from('publications')
        .update({ is_latest: false })
        .eq('media_source_id', mediaSource.id)
        .neq('id', data.id);

      return data.id;
    }
  } catch (error) {
    logger.error(`Failed to create/update publication:`, error);
    return null;
  }
};

/**
 * Log fetch attempt to database
 */
const logFetch = async (
  mediaSourceId: string,
  rssFeedId: string,
  status: 'success' | 'error' | 'partial',
  itemsFetched: number,
  durationMs: number,
  errorMessage?: string
): Promise<void> => {
  try {
    await supabase.from('fetch_logs').insert({
      media_source_id: mediaSourceId,
      rss_feed_id: rssFeedId,
      status,
      items_fetched: itemsFetched,
      fetch_duration_ms: durationMs,
      error_message: errorMessage
    });
  } catch (error) {
    logger.error('Failed to log fetch:', error);
  }
};

/**
 * Fetch RSS feed for a single media source
 */
export const fetchMediaSourceRss = async (
  mediaSource: MediaSource,
  rssFeed: RssFeed
): Promise<FetchResult> => {
  const startTime = Date.now();

  try {
    logger.info(`Fetching RSS feed for ${mediaSource.name}...`);

    // Fetch and parse RSS feed
    const feed = await fetchRssFeed(rssFeed.feed_url);

    if (!feed.items || feed.items.length === 0) {
      logger.warn(`No items found in RSS feed for ${mediaSource.name}`);
      const durationMs = Date.now() - startTime;
      await logFetch(mediaSource.id, rssFeed.id, 'success', 0, durationMs);
      return {
        success: true,
        mediaSourceId: mediaSource.id,
        rssFeedId: rssFeed.id,
        itemsFetched: 0,
        durationMs
      };
    }

    logger.debug(`Found ${feed.items.length} items in RSS feed`);

    // Create or update publication for today
    const publicationId = await createOrUpdatePublication(mediaSource, feed.items, rssFeed.feed_url);

    if (!publicationId) {
      throw new Error('Failed to create/update publication');
    }

    // Store articles in database
    const storedCount = await storeArticles(feed.items, mediaSource, rssFeed, publicationId);

    // Update last fetched timestamp
    await supabase
      .from('media_sources')
      .update({ last_fetched_at: new Date().toISOString() })
      .eq('id', mediaSource.id);

    const durationMs = Date.now() - startTime;
    await logFetch(mediaSource.id, rssFeed.id, 'success', storedCount, durationMs);

    logger.info(`Successfully fetched ${storedCount} articles for ${mediaSource.name} in ${durationMs}ms`);

    return {
      success: true,
      mediaSourceId: mediaSource.id,
      rssFeedId: rssFeed.id,
      itemsFetched: storedCount,
      durationMs
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error(`Failed to fetch RSS for ${mediaSource.name}:`, errorMessage);
    await logFetch(mediaSource.id, rssFeed.id, 'error', 0, durationMs, errorMessage);

    return {
      success: false,
      mediaSourceId: mediaSource.id,
      rssFeedId: rssFeed.id,
      itemsFetched: 0,
      error: errorMessage,
      durationMs
    };
  }
};

/**
 * Fetch RSS feeds for all active media sources
 */
export const fetchAllMediaSources = async (): Promise<FetchResult[]> => {
  logger.info('Starting RSS fetch for all media sources...');

  try {
    // Get all active media sources with their RSS feeds
    const { data: mediaSources, error: sourcesError } = await supabase
      .from('media_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      throw new Error(`Failed to fetch media sources: ${sourcesError.message}`);
    }

    if (!mediaSources || mediaSources.length === 0) {
      logger.warn('No active media sources found');
      return [];
    }

    const results: FetchResult[] = [];

    // Fetch RSS feeds for each media source with staggered delay
    for (const source of mediaSources) {
      // Get RSS feeds for this source
      const { data: rssFeeds, error: feedsError } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('media_source_id', source.id)
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (feedsError || !rssFeeds || rssFeeds.length === 0) {
        logger.warn(`No RSS feeds found for ${source.name}`);
        continue;
      }

      // Fetch primary feed (priority 1)
      const primaryFeed = rssFeeds[0];
      const result = await fetchMediaSourceRss(source, primaryFeed);
      results.push(result);

      // Add delay to avoid overwhelming servers (100-200ms)
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    const successCount = results.filter(r => r.success).length;
    const totalItems = results.reduce((sum, r) => sum + r.itemsFetched, 0);

    logger.info(
      `RSS fetch complete: ${successCount}/${results.length} sources successful, ${totalItems} total items`
    );

    return results;
  } catch (error) {
    logger.error('Failed to fetch all media sources:', error);
    throw error;
  }
};

/**
 * Retry logic with exponential backoff
 */
export const fetchWithRetry = async (
  mediaSource: MediaSource,
  rssFeed: RssFeed,
  maxRetries: number = 3
): Promise<FetchResult> => {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await fetchMediaSourceRss(mediaSource, rssFeed);

    if (result.success) {
      return result;
    }

    lastError = result.error || 'Unknown error';

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
      logger.info(`Retry ${attempt}/${maxRetries} for ${mediaSource.name} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    mediaSourceId: mediaSource.id,
    rssFeedId: rssFeed.id,
    itemsFetched: 0,
    error: `Failed after ${maxRetries} retries: ${lastError}`,
    durationMs: 0
  };
};
