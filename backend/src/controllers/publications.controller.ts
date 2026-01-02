import { Request, Response } from 'express';
import {
  getLatestPublications,
  getPublicationById,
  getPublicationsBySource,
  getPublicationsByDate,
  getPublicationStats
} from '../services/publication.service';
import { logger } from '../utils/logger';

/**
 * GET /api/publications
 * Get latest publications (newsstand view)
 */
export const getPublications = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      date,
      type,
      source_id,
      latest_only,
      limit,
      offset
    } = req.query;

    const publications = await getLatestPublications({
      date: date as string,
      type: type as 'newspaper' | 'magazine',
      source_id: source_id as string,
      latest_only: latest_only === 'true',
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });

    res.json({
      data: publications,
      meta: {
        total: publications.length,
        limit: limit ? parseInt(limit as string) : 100,
        offset: offset ? parseInt(offset as string) : 0
      }
    });
  } catch (error) {
    logger.error('Error in getPublications controller:', error);
    res.status(500).json({
      error: 'Failed to fetch publications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/publications/:id
 * Get single publication by ID
 */
export const getPublication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const publication = await getPublicationById(id);

    if (!publication) {
      res.status(404).json({ error: 'Publication not found' });
      return;
    }

    res.json({ data: publication });
  } catch (error) {
    logger.error('Error in getPublication controller:', error);
    res.status(500).json({
      error: 'Failed to fetch publication',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/publications/source/:sourceId
 * Get publications by media source
 */
export const getPublicationsByMediaSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceId } = req.params;
    const { limit } = req.query;

    const publications = await getPublicationsBySource(
      sourceId,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      data: publications,
      meta: { total: publications.length }
    });
  } catch (error) {
    logger.error('Error in getPublicationsByMediaSource controller:', error);
    res.status(500).json({
      error: 'Failed to fetch publications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/publications/date/:date
 * Get publications by date
 */
export const getPublicationsByDateController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;

    const publications = await getPublicationsByDate(date);

    res.json({
      data: publications,
      meta: { total: publications.length }
    });
  } catch (error) {
    logger.error('Error in getPublicationsByDateController:', error);
    res.status(500).json({
      error: 'Failed to fetch publications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/publications/stats
 * Get publication statistics
 */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getPublicationStats();
    res.json({ data: stats });
  } catch (error) {
    logger.error('Error in getStats controller:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
