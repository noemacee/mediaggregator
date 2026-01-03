-- Simplify to only 3 categories: main, economy, sports
-- Run this in Supabase SQL Editor

-- Add category column if it doesn't exist
ALTER TABLE media_sources
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'main';

-- Categorize media sources into 3 categories
UPDATE media_sources SET category = 'sports' WHERE slug IN ('lequipe', 'rmc-sport', 'eurosport');
UPDATE media_sources SET category = 'economy' WHERE slug IN ('les-echos', 'challenges');
UPDATE media_sources SET category = 'main' WHERE slug IN (
  'le-monde', 'le-figaro', 'liberation', 'lhumanite', '20-minutes',
  'france-24', 'le-point', 'lexpress', 'lobs', 'marianne',
  'courrier-international', 'paris-match'
);

-- Update all articles to match their media source category
UPDATE articles a
SET category = ms.category
FROM media_sources ms
WHERE a.media_source_id = ms.id;

-- Set any NULL categories to 'main'
UPDATE articles SET category = 'main' WHERE category IS NULL;
UPDATE media_sources SET category = 'main' WHERE category IS NULL;

-- Verify categorization
SELECT
  category,
  COUNT(*) as source_count,
  STRING_AGG(name, ', ' ORDER BY name) as sources
FROM media_sources
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- Verify article distribution
SELECT
  category,
  COUNT(*) as article_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM articles
GROUP BY category
ORDER BY article_count DESC;
