-- Normalize existing article categories to standard categories
-- Run this in Supabase SQL Editor

-- Sports categories
UPDATE articles
SET category = 'sports'
WHERE LOWER(category) IN (
  'sport', 'sports', 'football', 'soccer', 'basket', 'basketball',
  'rugby', 'tennis', 'cyclisme', 'cycling', 'athletisme', 'athletics',
  'formule 1', 'f1', 'auto-moto', 'handball', 'volley', 'volleyball',
  'natation', 'swimming', 'judo', 'boxe', 'boxing', 'nba',
  'ligue 1', 'champions league', 'ligue des champions', 'premier league',
  'coupe du monde', 'world cup', 'euro'
);

-- Politics categories
UPDATE articles
SET category = 'politics'
WHERE LOWER(category) IN (
  'politique', 'politics', 'gouvernement', 'government',
  'elections', 'élections', 'election', 'parlement', 'parliament',
  'assemblee nationale', 'senat', 'senate'
);

-- Economy categories
UPDATE articles
SET category = 'economy'
WHERE LOWER(category) IN (
  'economie', 'economy', 'economic', 'économie', 'finance', 'business',
  'bourse', 'stock market', 'entreprise', 'company', 'industrie', 'industry',
  'emploi', 'employment', 'travail', 'work'
);

-- Culture categories
UPDATE articles
SET category = 'culture'
WHERE LOWER(category) IN (
  'culture', 'art', 'arts', 'cinema', 'cinéma', 'film', 'movie',
  'musique', 'music', 'theatre', 'théâtre', 'theater',
  'livre', 'books', 'litterature', 'littérature', 'literature',
  'spectacle', 'entertainment', 'divertissement'
);

-- Technology categories
UPDATE articles
SET category = 'technology'
WHERE LOWER(category) IN (
  'technologie', 'technology', 'tech', 'high-tech', 'informatique',
  'computer', 'computing', 'internet', 'web', 'digital', 'numérique',
  'innovation', 'startup', 'startups', 'intelligence artificielle',
  'ai', 'artificial intelligence', 'cybersecurite', 'cybersecurity'
);

-- International categories
UPDATE articles
SET category = 'international'
WHERE LOWER(category) IN (
  'international', 'monde', 'world', 'global', 'etranger', 'étranger',
  'foreign', 'europe', 'asie', 'asia', 'amerique', 'amérique', 'america',
  'afrique', 'africa', 'moyen-orient', 'middle east'
);

-- Society categories
UPDATE articles
SET category = 'society'
WHERE LOWER(category) IN (
  'societe', 'société', 'society', 'social', 'education', 'éducation',
  'sante', 'santé', 'health', 'environnement', 'environment',
  'ecologie', 'écologie', 'ecology', 'justice', 'droit', 'law',
  'police', 'securite', 'sécurité', 'security', 'immigration',
  'famille', 'family'
);

-- Opinion categories
UPDATE articles
SET category = 'opinion'
WHERE LOWER(category) IN (
  'opinion', 'editorial', 'éditorial', 'chronique', 'column',
  'tribune', 'debat', 'débat', 'debate', 'analyse', 'analysis',
  'commentaire', 'comment'
);

-- Main/Featured categories
UPDATE articles
SET category = 'main'
WHERE LOWER(category) IN (
  'une', 'a la une', 'à la une', 'top stories', 'headlines',
  'breaking', 'breaking news', 'actualite', 'actualité', 'news', 'actu'
);

-- Set NULL categories to 'main' as default
UPDATE articles
SET category = 'main'
WHERE category IS NULL;

-- Verify the normalization
SELECT
  category,
  COUNT(*) as article_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM articles
GROUP BY category
ORDER BY article_count DESC;
