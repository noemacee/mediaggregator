import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * GET /api/media-sources
 * Get all active media sources
 */
export const getMediaSources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, active_only = 'true' } = req.query;

    let query = supabase
      .from('media_sources')
      .select('*')
      .order('name', { ascending: true });

    // Filter by type if provided
    if (type) {
      query = query.eq('type', type);
    }

    // Filter by active status
    if (active_only === 'true') {
      query = query.eq('is_active', true);
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
    logger.error('Error in getMediaSources controller:', error);
    res.status(500).json({
      error: 'Failed to fetch media sources',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/media-sources/:id
 * Get single media source by ID
 */
export const getMediaSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('media_sources')
      .select(`
        *,
        rss_feeds (*),
        publications (count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Media source not found' });
        return;
      }
      throw new Error(error.message);
    }

    res.json({ data });
  } catch (error) {
    logger.error('Error in getMediaSource controller:', error);
    res.status(500).json({
      error: 'Failed to fetch media source',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
