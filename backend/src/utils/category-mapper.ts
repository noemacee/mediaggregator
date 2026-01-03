/**
 * Category Mapper
 * Maps various RSS feed categories to standardized categories
 */

export type StandardCategory =
  | 'main'
  | 'sports'
  | 'politics'
  | 'economy'
  | 'culture'
  | 'technology'
  | 'international'
  | 'society'
  | 'opinion';

/**
 * Mapping of raw RSS categories to standard categories
 * Keys are lowercase for case-insensitive matching
 */
const categoryMappings: Record<string, StandardCategory> = {
  // Sports
  'sport': 'sports',
  'sports': 'sports',
  'football': 'sports',
  'soccer': 'sports',
  'basket': 'sports',
  'basketball': 'sports',
  'rugby': 'sports',
  'tennis': 'sports',
  'cyclisme': 'sports',
  'cycling': 'sports',
  'athletisme': 'sports',
  'athletics': 'sports',
  'formule 1': 'sports',
  'f1': 'sports',
  'auto-moto': 'sports',
  'handball': 'sports',
  'volley': 'sports',
  'volleyball': 'sports',
  'natation': 'sports',
  'swimming': 'sports',
  'judo': 'sports',
  'boxe': 'sports',
  'boxing': 'sports',
  'nba': 'sports',
  'ligue 1': 'sports',
  'champions league': 'sports',
  'ligue des champions': 'sports',
  'premier league': 'sports',
  'coupe du monde': 'sports',
  'world cup': 'sports',
  'euro': 'sports',

  // Politics
  'politique': 'politics',
  'politics': 'politics',
  '政治': 'politics',
  'gouvernement': 'politics',
  'government': 'politics',
  'elections': 'politics',
  'élections': 'politics',
  'election': 'politics',
  'parlement': 'politics',
  'parliament': 'politics',
  'assemblee nationale': 'politics',
  'senat': 'politics',
  'senate': 'politics',

  // Economy
  'economie': 'economy',
  'economy': 'economy',
  'economic': 'economy',
  'économie': 'economy',
  'finance': 'economy',
  'business': 'economy',
  'bourse': 'economy',
  'stock market': 'economy',
  'entreprise': 'economy',
  'company': 'economy',
  'industrie': 'economy',
  'industry': 'economy',
  'emploi': 'economy',
  'employment': 'economy',
  'travail': 'economy',
  'work': 'economy',

  // Culture
  'culture': 'culture',
  'art': 'culture',
  'arts': 'culture',
  'cinema': 'culture',
  'cinéma': 'culture',
  'film': 'culture',
  'movie': 'culture',
  'musique': 'culture',
  'music': 'culture',
  'theatre': 'culture',
  'théâtre': 'culture',
  'theater': 'culture',
  'livre': 'culture',
  'books': 'culture',
  'litterature': 'culture',
  'littérature': 'culture',
  'literature': 'culture',
  'spectacle': 'culture',
  'entertainment': 'culture',
  'divertissement': 'culture',

  // Technology
  'technologie': 'technology',
  'technology': 'technology',
  'tech': 'technology',
  'high-tech': 'technology',
  'informatique': 'technology',
  'computer': 'technology',
  'computing': 'technology',
  'internet': 'technology',
  'web': 'technology',
  'digital': 'technology',
  'numérique': 'technology',
  'innovation': 'technology',
  'startup': 'technology',
  'startups': 'technology',
  'intelligence artificielle': 'technology',
  'ai': 'technology',
  'artificial intelligence': 'technology',
  'cybersecurite': 'technology',
  'cybersecurity': 'technology',

  // International
  'international': 'international',
  'monde': 'international',
  'world': 'international',
  'global': 'international',
  'etranger': 'international',
  'étranger': 'international',
  'foreign': 'international',
  'europe': 'international',
  'asie': 'international',
  'asia': 'international',
  'amerique': 'international',
  'amérique': 'international',
  'america': 'international',
  'afrique': 'international',
  'africa': 'international',
  'moyen-orient': 'international',
  'middle east': 'international',

  // Society
  'societe': 'society',
  'société': 'society',
  'society': 'society',
  'social': 'society',
  'education': 'society',
  'éducation': 'society',
  'sante': 'society',
  'santé': 'society',
  'health': 'society',
  'environnement': 'society',
  'environment': 'society',
  'ecologie': 'society',
  'écologie': 'society',
  'ecology': 'society',
  'justice': 'society',
  'droit': 'society',
  'law': 'society',
  'police': 'society',
  'securite': 'society',
  'sécurité': 'society',
  'security': 'society',
  'immigration': 'society',
  'famille': 'society',
  'family': 'society',

  // Opinion
  'opinion': 'opinion',
  'editorial': 'opinion',
  'éditorial': 'opinion',
  'chronique': 'opinion',
  'column': 'opinion',
  'tribune': 'opinion',
  'debat': 'opinion',
  'débat': 'opinion',
  'debate': 'opinion',
  'analyse': 'opinion',
  'analysis': 'opinion',
  'commentaire': 'opinion',
  'comment': 'opinion',

  // Main/Featured
  'une': 'main',
  'a la une': 'main',
  'à la une': 'main',
  'top stories': 'main',
  'headlines': 'main',
  'breaking': 'main',
  'breaking news': 'main',
  'actualite': 'main',
  'actualité': 'main',
  'news': 'main',
  'actu': 'main',
};

/**
 * Normalize a category string for matching
 */
const normalizeCategory = (category: string): string => {
  return category.toLowerCase().trim();
};

/**
 * Map a raw RSS category to a standard category
 * @param rawCategory - Category from RSS feed or rss_feeds table
 * @param feedCategory - Category from rss_feeds table (preferred)
 * @returns Standard category or 'main' as default
 */
export const mapCategory = (
  rawCategory?: string | null,
  feedCategory?: string | null
): StandardCategory => {
  // Prefer feed category from database
  if (feedCategory) {
    const normalized = normalizeCategory(feedCategory);
    const mapped = categoryMappings[normalized];
    if (mapped) return mapped;
    // If it's already a standard category, return it
    if (isStandardCategory(feedCategory)) {
      return feedCategory as StandardCategory;
    }
  }

  // Fallback to raw category from RSS item
  if (rawCategory) {
    const normalized = normalizeCategory(rawCategory);
    const mapped = categoryMappings[normalized];
    if (mapped) return mapped;
    // If it's already a standard category, return it
    if (isStandardCategory(rawCategory)) {
      return rawCategory as StandardCategory;
    }
  }

  // Default to 'main' if no category can be determined
  return 'main';
};

/**
 * Check if a string is a valid standard category
 */
const isStandardCategory = (category: string): boolean => {
  const standardCategories: StandardCategory[] = [
    'main',
    'sports',
    'politics',
    'economy',
    'culture',
    'technology',
    'international',
    'society',
    'opinion'
  ];
  return standardCategories.includes(category as StandardCategory);
};

/**
 * Get all standard categories
 */
export const getStandardCategories = (): StandardCategory[] => {
  return [
    'main',
    'sports',
    'politics',
    'economy',
    'culture',
    'technology',
    'international',
    'society',
    'opinion'
  ];
};
