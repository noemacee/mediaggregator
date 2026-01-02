import { Router } from 'express';
import { triggerFetchNow, getFetchLogs } from '../controllers/admin.controller';

const router = Router();

// POST /api/admin/fetch-now - Trigger immediate RSS fetch
router.post('/fetch-now', triggerFetchNow);

// GET /api/admin/fetch-logs - Get fetch logs
router.get('/fetch-logs', getFetchLogs);

export default router;
