import { Router } from 'express';
import { getArticles, getArticle } from '../controllers/articles.controller';

const router = Router();

// GET /api/articles - Get articles with pagination
router.get('/', getArticles);

// GET /api/articles/:id - Get single article
router.get('/:id', getArticle);

export default router;
