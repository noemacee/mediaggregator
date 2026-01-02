import { Router } from 'express';
import {
  getPublications,
  getPublication,
  getPublicationsByMediaSource,
  getPublicationsByDateController,
  getStats
} from '../controllers/publications.controller';

const router = Router();

// GET /api/publications - Get latest publications (newsstand)
router.get('/', getPublications);

// GET /api/publications/stats - Get publication statistics
router.get('/stats', getStats);

// GET /api/publications/source/:sourceId - Get publications by media source
router.get('/source/:sourceId', getPublicationsByMediaSource);

// GET /api/publications/date/:date - Get publications by date
router.get('/date/:date', getPublicationsByDateController);

// GET /api/publications/:id - Get single publication
router.get('/:id', getPublication);

export default router;
