import cron from 'node-cron';
import { fetchAllMediaSources } from './rss-fetcher.service';
import { logger } from '../utils/logger';

let scheduledTask: cron.ScheduledTask | null = null;
let isRunning = false;

/**
 * Start the RSS feed scheduler
 * Runs every 60 minutes by default
 */
export const startScheduler = (intervalMinutes: number = 60): void => {
  if (scheduledTask) {
    logger.warn('Scheduler already running');
    return;
  }

  // Convert minutes to cron expression
  // Every N minutes: */N * * * *
  const cronExpression = `*/${intervalMinutes} * * * *`;

  logger.info(`Starting RSS feed scheduler (every ${intervalMinutes} minutes)`);

  scheduledTask = cron.schedule(cronExpression, async () => {
    if (isRunning) {
      logger.warn('Previous RSS fetch still running, skipping this interval');
      return;
    }

    try {
      isRunning = true;
      logger.info('Scheduled RSS fetch starting...');

      const results = await fetchAllMediaSources();

      const successCount = results.filter(r => r.success).length;
      const totalItems = results.reduce((sum, r) => sum + r.itemsFetched, 0);

      logger.info(
        `Scheduled RSS fetch completed: ${successCount}/${results.length} sources, ${totalItems} items`
      );
    } catch (error) {
      logger.error('Scheduled RSS fetch failed:', error);
    } finally {
      isRunning = false;
    }
  });

  logger.info('Scheduler started successfully');
};

/**
 * Stop the scheduler
 */
export const stopScheduler = (): void => {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    logger.info('Scheduler stopped');
  }
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = (): {
  running: boolean;
  fetchInProgress: boolean;
} => {
  return {
    running: scheduledTask !== null,
    fetchInProgress: isRunning
  };
};

/**
 * Run an immediate fetch (doesn't affect schedule)
 */
export const runImmediateFetch = async (): Promise<void> => {
  if (isRunning) {
    throw new Error('A fetch is already in progress');
  }

  try {
    isRunning = true;
    logger.info('Manual RSS fetch triggered');

    const results = await fetchAllMediaSources();

    const successCount = results.filter(r => r.success).length;
    const totalItems = results.reduce((sum, r) => sum + r.itemsFetched, 0);

    logger.info(
      `Manual RSS fetch completed: ${successCount}/${results.length} sources, ${totalItems} items`
    );
  } finally {
    isRunning = false;
  }
};
