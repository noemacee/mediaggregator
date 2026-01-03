-- Add category column to media_sources table
-- This determines the category for ALL articles from this source

-- Add category column if it doesn't exist
ALTER TABLE media_sources
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'main';

-- Set categories based on media source type
UPDATE media_sources SET category = 'sports' WHERE slug IN ('lequipe', 'rmc-sport', 'eurosport');
UPDATE media_sources SET category = 'economy' WHERE slug IN ('les-echos', 'challenges');
UPDATE media_sources SET category = 'politics' WHERE slug IN ('liberation', 'lhumanite', 'marianne');
UPDATE media_sources SET category = 'main' WHERE slug IN ('le-monde', 'le-figaro', '20-minutes', 'france-24');
UPDATE media_sources SET category = 'culture' WHERE slug IN ('lobs', 'le-point', 'lexpress');

-- View current categorization
SELECT
  name,
  slug,
  type,
  category,
  is_active
FROM media_sources
ORDER BY category, name;
