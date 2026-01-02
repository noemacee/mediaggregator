import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * GET /api/articles
 * Get recent articles with pagination
 */
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      media_source_id,
      publication_id,
      category,
      limit = '20',
      offset = '0'
    } = req.query;

    let query = supabase
      .from('articles')
      .select(`
        *,
        media_source:media_sources (name, slug, logo_url)
      `)
      .order('published_at', { ascending: false });

    // Apply filters
    if (media_source_id) {
      query = query.eq('media_source_id', media_source_id);
    }

    if (publication_id) {
      query = query.eq('publication_id', publication_id);
    }

    if (category) {
      query = query.eq('category', category);
    }

    // Pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      data: data || [],
      meta: {
        total: count || data?.length || 0,
        limit: limitNum,
        offset: offsetNum
      }
    });
  } catch (error) {
    logger.error('Error in getArticles controller:', error);
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/articles/:id
 * Get single article by ID
 */
export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        media_source:media_sources (*),
        publication:publications (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Article not found' });
        return;
      }
      throw new Error(error.message);
    }

    res.json({ data });
  } catch (error) {
    logger.error('Error in getArticle controller:', error);
    res.status(500).json({
      error: 'Failed to fetch article',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
