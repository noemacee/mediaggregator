import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { getTodayDate, formatDate } from '../utils/date-utils';
import { Publication, PublicationWithSource, GetPublicationsQuery } from '../models/types';

/**
 * Get latest publications (today's editions) for newsstand view
 */
export const getLatestPublications = async (
  query: GetPublicationsQuery = {}
): Promise<PublicationWithSource[]> => {
  try {
    const {
      date = getTodayDate(),
      type,
      source_id,
      latest_only = true,
      limit = 100,
      offset = 0
    } = query;

    let queryBuilder = supabase
      .from('publications')
      .select(`
        *,
        media_source:media_sources (*)
      `)
      .order('created_at', { ascending: false });

    // Filter by date
    if (date) {
      queryBuilder = queryBuilder.eq('publication_date', date);
    }

    // Filter by latest only
    if (latest_only) {
      queryBuilder = queryBuilder.eq('is_latest', true);
    }

    // Filter by media source type
    if (type) {
      queryBuilder = queryBuilder.eq('media_source.type', type);
    }

    // Filter by specific source
    if (source_id) {
      queryBuilder = queryBuilder.eq('media_source_id', source_id);
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error } = await queryBuilder;

    if (error) {
      logger.error('Error fetching publications:', error);
      throw new Error(`Failed to fetch publications: ${error.message}`);
    }

    // Get article counts for each publication
    const publicationsWithCounts = await Promise.all(
      (data || []).map(async (pub: any) => {
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('publication_id', pub.id);

        return {
          ...pub,
          articles_count: count || 0
        };
      })
    );

    return publicationsWithCounts;
  } catch (error) {
    logger.error('Failed to get latest publications:', error);
    throw error;
  }
};

/**
 * Get a single publication by ID with its articles
 */
export const getPublicationById = async (
  publicationId: string
): Promise<PublicationWithSource | null> => {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select(`
        *,
        media_source:media_sources (*),
        articles (*)
      `)
      .eq('id', publicationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch publication: ${error.message}`);
    }

    return data;
  } catch (error) {
    logger.error(`Failed to get publication ${publicationId}:`, error);
    throw error;
  }
};

/**
 * Get publications by media source
 */
export const getPublicationsBySource = async (
  mediaSourceId: string,
  limit: number = 30
): Promise<Publication[]> => {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('media_source_id', mediaSourceId)
      .order('publication_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch publications: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    logger.error(`Failed to get publications for source ${mediaSourceId}:`, error);
    throw error;
  }
};

/**
 * Get publications by date
 */
export const getPublicationsByDate = async (
  date: string
): Promise<PublicationWithSource[]> => {
  try {
    const formattedDate = formatDate(date);

    const { data, error } = await supabase
      .from('publications')
      .select(`
        *,
        media_source:media_sources (*)
      `)
      .eq('publication_date', formattedDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch publications: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    logger.error(`Failed to get publications for date ${date}:`, error);
    throw error;
  }
};

/**
 * Get publication statistics
 */
export const getPublicationStats = async (): Promise<{
  total_publications: number;
  today_publications: number;
  total_articles: number;
  today_articles: number;
}> => {
  try {
    const today = getTodayDate();

    const [totalPubs, todayPubs, totalArticles, todayArticles] = await Promise.all([
      supabase.from('publications').select('*', { count: 'exact', head: true }),
      supabase
        .from('publications')
        .select('*', { count: 'exact', head: true })
        .eq('publication_date', today),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
    ]);

    return {
      total_publications: totalPubs.count || 0,
      today_publications: todayPubs.count || 0,
      total_articles: totalArticles.count || 0,
      today_articles: todayArticles.count || 0
    };
  } catch (error) {
    logger.error('Failed to get publication stats:', error);
    throw error;
  }
};
