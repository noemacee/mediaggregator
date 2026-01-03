-- Add French Sports Media Sources
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
);

-- RMC Sport - Sports news and coverage
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'RMC Sport',
  'rmc-sport',
  'newspaper',
  'Actualité sportive et résultats en direct',
  'https://www.rmcsport.bfmtv.com',
  'https://www.google.com/s2/favicons?domain=rmcsport.bfmtv.com&sz=128',
  'neutral',
  true,
  60
);

-- Eurosport France
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Eurosport',
  'eurosport',
  'newspaper',
  'Sport en direct et actualités sportives',
  'https://www.eurosport.fr',
  'https://www.google.com/s2/favicons?domain=eurosport.fr&sz=128',
  'neutral',
  true,
  60
);

-- Add RSS feeds for L'Équipe
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://www.lequipe.fr/rss/actu_rss.xml',
  'sports',
  true,
  1
FROM media_sources
WHERE slug = 'lequipe';

-- L'Équipe Football feed
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://www.lequipe.fr/rss/actu_rss_Football.xml',
  'sports',
  true,
  2
FROM media_sources
WHERE slug = 'lequipe';

-- Add RSS feeds for RMC Sport
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://www.rmcsport.bfmtv.com/rss/sports/',
  'sports',
  true,
  1
FROM media_sources
WHERE slug = 'rmc-sport';

-- RMC Sport Football feed
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://www.rmcsport.bfmtv.com/rss/football/',
  'sports',
  true,
  2
FROM media_sources
WHERE slug = 'rmc-sport';

-- Add RSS feeds for Eurosport
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT
  id,
  'https://www.eurosport.fr/rss.xml',
  'sports',
  true,
  1
FROM media_sources
WHERE slug = 'eurosport';

-- Verify the insertions
SELECT
  ms.name,
  ms.slug,
  COUNT(rf.id) as rss_feeds_count
FROM media_sources ms
LEFT JOIN rss_feeds rf ON ms.id = rf.media_source_id
WHERE ms.slug IN ('lequipe', 'rmc-sport', 'eurosport')
GROUP BY ms.id, ms.name, ms.slug
ORDER BY ms.name;
