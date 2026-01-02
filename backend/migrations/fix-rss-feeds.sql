-- Migration to fix RSS feed URLs and database schema issues
-- Run this in your Supabase SQL Editor

-- 1. Fix article_url column length (increase from 500 to 1000)
ALTER TABLE articles ALTER COLUMN article_url TYPE VARCHAR(1000);

-- 2. Update RSS feed URLs for sources that are failing

-- Update L'Humanité RSS feed (404 error)
UPDATE rss_feeds
SET feed_url = 'https://www.humanite.fr/feed'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'lhumanite');

-- Update Libération RSS feed (use alternative URL)
UPDATE rss_feeds
SET feed_url = 'https://www.liberation.fr/arc/outboundfeeds/rss-all/'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'liberation');

-- Update Les Échos RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.lesechos.fr/rss/toutes-les-actualites.xml'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'les-echos');

-- Update Le Point RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.lepoint.fr/rss.xml'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'le-point');

-- Update L'Express RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.lexpress.fr/arc/outboundfeeds/rss/alaune.xml'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'lexpress');

-- Update Marianne RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.marianne.net/feed'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'marianne');

-- Update Challenges RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.challenges.fr/feed'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'challenges');

-- Update Paris Match RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.parismatch.com/feed'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'paris-match');

-- Update Courrier International RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.courrierinternational.com/feed/all/rss.xml'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'courrier-international');

-- Update France 24 RSS feed
UPDATE rss_feeds
SET feed_url = 'https://www.france24.com/fr/actualites/rss'
WHERE media_source_id = (SELECT id FROM media_sources WHERE slug = 'france-24');

-- Verify updates
SELECT
  ms.name,
  ms.slug,
  rf.feed_url,
  rf.is_active
FROM media_sources ms
JOIN rss_feeds rf ON ms.id = rf.media_source_id
WHERE ms.is_active = true
ORDER BY ms.name;
