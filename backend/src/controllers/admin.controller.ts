import { Request, Response } from 'express';
import { fetchAllMediaSources } from '../services/rss-fetcher.service';
import { updateTodayPublicationCovers } from '../services/cover-scraper.service';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * POST /api/admin/fetch-now
 * Trigger immediate RSS fetch for all sources
 */
export const triggerFetchNow = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Manual RSS fetch triggered');

    // Run fetch in background
    fetchAllMediaSources()
      .then(results => {
        logger.info(`Manual fetch completed: ${results.length} sources processed`);
      })
      .catch(error => {
        logger.error('Manual fetch failed:', error);
      });

    res.json({
      message: 'RSS fetch started',
      status: 'processing'
    });
  } catch (error) {
    logger.error('Error triggering fetch:', error);
    res.status(500).json({
      error: 'Failed to trigger fetch',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/admin/fetch-logs
 * Get recent fetch logs
 */
export const getFetchLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '50', status } = req.query;

    let query = supabase
      .from('fetch_logs')
      .select(`
        *,
        media_source:media_sources (name, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      data: data || [],
      meta: { total: data?.length || 0 }
    });
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/admin/scrape-covers
 * Trigger publication cover scraping for today
 */
export const scrapeCoverImages = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Manual cover scraping triggered');

    // Run cover scraping in background
    updateTodayPublicationCovers()
      .then(() => {
        logger.info('Manual cover scraping completed');
      })
      .catch(error => {
        logger.error('Manual cover scraping failed:', error);
      });

    res.json({
      message: 'Cover scraping started',
      status: 'processing'
    });
  } catch (error) {
    logger.error('Error triggering cover scraping:', error);
    res.status(500).json({
      error: 'Failed to trigger cover scraping',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
