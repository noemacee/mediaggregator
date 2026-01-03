-- Add French Sports Media Sources - FIXED URLs
-- Run this in Supabase SQL Editor

-- L'Équipe - France's leading sports newspaper
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'L''Équipe',
  'lequipe',
  'newspaper',
  'Premier quotidien sportif français',
  'https://www.lequipe.fr',
  'https://www.google.com/s2/favicons?domain=lequipe.fr&sz=128',
  'neutral',
  true,
  60
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  logo_url = EXCLUDED.logo_url,
  is_active = true;

-- RMC Sport - Sports news and coverage
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'RMC Sport',
  'rmc-sport',
  'newspaper',
  'Actualité sportive et résultats en direct',
  'https://rmcsport.bfmtv.com',
  'https://www.google.com/s2/favicons?domain=rmcsport.bfmtv.com&sz=128',
  'neutral',
  true,
  60
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  logo_url = EXCLUDED.logo_url,
  is_active = true;

-- Delete old RSS feeds if they exist
DELETE FROM rss_feeds
WHERE media_source_id IN (
  SELECT id FROM media_sources WHERE slug IN ('lequipe', 'rmc-sport')
);

-- Add RSS feeds for L'Équipe (FIXED URLs)
-- General sports news
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://dwh.lequipe.fr/api/edito/rss?path=/',
  'sports',
  true,
  1
FROM media_sources
WHERE slug = 'lequipe';

-- Football specific
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://dwh.lequipe.fr/api/edito/rss?path=/Football/',
  'sports',
  true,
  2
FROM media_sources
WHERE slug = 'lequipe';

-- Basketball
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://dwh.lequipe.fr/api/edito/rss?path=/Basket/',
  'sports',
  true,
  3
FROM media_sources
WHERE slug = 'lequipe';

-- Rugby
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://dwh.lequipe.fr/api/edito/rss?path=/Rugby/',
  'sports',
  true,
  4
FROM media_sources
WHERE slug = 'lequipe';

-- Tennis
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://dwh.lequipe.fr/api/edito/rss?path=/Tennis/',
  'sports',
  true,
  5
FROM media_sources
WHERE slug = 'lequipe';

-- Add RSS feeds for RMC Sport (FIXED URLs)
-- General football
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://rmcsport.bfmtv.com/rss/football/',
  'sports',
  true,
  1
FROM media_sources
WHERE slug = 'rmc-sport';

-- Ligue 1
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://rmcsport.bfmtv.com/rss/football/ligue-1/',
  'sports',
  true,
  2
FROM media_sources
WHERE slug = 'rmc-sport';

-- Basketball
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://rmcsport.bfmtv.com/rss/basket/',
  'sports',
  true,
  3
FROM media_sources
WHERE slug = 'rmc-sport';

-- Tennis
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://rmcsport.bfmtv.com/rss/tennis/',
  'sports',
  true,
  4
FROM media_sources
WHERE slug = 'rmc-sport';

-- Rugby
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://rmcsport.bfmtv.com/rss/rugby/',
  'sports',
  true,
  5
FROM media_sources
WHERE slug = 'rmc-sport';

-- Verify the insertions
SELECT
  ms.name,
  ms.slug,
  ms.is_active,
  COUNT(rf.id) as rss_feeds_count
FROM media_sources ms
LEFT JOIN rss_feeds rf ON ms.id = rf.media_source_id
WHERE ms.slug IN ('lequipe', 'rmc-sport')
GROUP BY ms.id, ms.name, ms.slug, ms.is_active
ORDER BY ms.name;

-- View the RSS feeds
SELECT
  ms.name,
  rf.feed_url,
  rf.category,
  rf.priority
FROM rss_feeds rf
JOIN media_sources ms ON rf.media_source_id = ms.id
WHERE ms.slug IN ('lequipe', 'rmc-sport')
ORDER BY ms.name, rf.priority;
