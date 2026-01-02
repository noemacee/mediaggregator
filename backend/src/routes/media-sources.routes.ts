import { Router } from 'express';
import { getMediaSources, getMediaSource } from '../controllers/media-sources.controller';

const router = Router();

// GET /api/media-sources - Get all active media sources
router.get('/', getMediaSources);

// GET /api/media-sources/:id - Get single media source
router.get('/:id', getMediaSource);

export default router;
