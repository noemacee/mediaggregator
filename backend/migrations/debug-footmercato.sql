-- Debug Foot Mercato
-- Run this in Supabase SQL Editor to check what's happening

-- 1. Check if Foot Mercato exists in media_sources
SELECT
  id,
  name,
  slug,
  category,
  is_active
FROM media_sources
WHERE slug = 'foot-mercato';

-- 2. Check if it has RSS feeds
SELECT
  rf.id,
  rf.feed_url,
  rf.category,
  rf.is_active,
  ms.name as media_name
FROM rss_feeds rf
JOIN media_sources ms ON rf.media_source_id = ms.id
WHERE ms.slug = 'foot-mercato';

-- 3. Check if any articles exist from Foot Mercato
SELECT
  COUNT(*) as article_count,
  MIN(published_at) as oldest_article,
  MAX(published_at) as newest_article,
  category
FROM articles a
JOIN media_sources ms ON a.media_source_id = ms.id
WHERE ms.slug = 'foot-mercato'
GROUP BY category;

-- 4. Show sample articles if they exist
SELECT
  a.title,
  a.category,
  a.published_at,
  ms.name as source_name
FROM articles a
JOIN media_sources ms ON a.media_source_id = ms.id
WHERE ms.slug = 'foot-mercato'
ORDER BY a.published_at DESC
LIMIT 5;

-- 5. Check all sports sources and their article counts
SELECT
  ms.name,
  ms.slug,
  ms.category,
  ms.is_active,
  COUNT(a.id) as article_count
FROM media_sources ms
LEFT JOIN articles a ON ms.id = a.media_source_id
WHERE ms.category = 'sports'
GROUP BY ms.id, ms.name, ms.slug, ms.category, ms.is_active
ORDER BY article_count DESC;
