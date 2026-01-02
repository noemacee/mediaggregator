import { Router } from 'express';
import publicationsRoutes from './publications.routes';
import mediaSourcesRoutes from './media-sources.routes';
import articlesRoutes from './articles.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount all routes
router.use('/publications', publicationsRoutes);
router.use('/media-sources', mediaSourcesRoutes);
router.use('/articles', articlesRoutes);
router.use('/admin', adminRoutes);

export default router;
