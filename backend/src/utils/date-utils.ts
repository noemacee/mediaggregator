// Date utility functions for the backend

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Format a date to YYYY-MM-DD
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Parse RSS date string to ISO string
 */
export const parseRssDate = (dateString?: string): string | undefined => {
  if (!dateString) return undefined;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date.toISOString();
  } catch (error) {
    return undefined;
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Get date N days ago
 */
export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

/**
 * Check if date1 is the same as date2 (ignoring time)
 */
export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
  return formatDate(date1) === formatDate(date2);
};
