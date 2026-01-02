import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { logger } from './utils/logger';
import { startScheduler } from './services/scheduler.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Mediaggregator API is running' });
});

// API routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('API endpoints available at /api');

  // Start RSS feed scheduler
  const fetchInterval = parseInt(process.env.FEED_UPDATE_INTERVAL || '60');
  startScheduler(fetchInterval);
  logger.info(`RSS feed scheduler started (interval: ${fetchInterval} minutes)`);
});
