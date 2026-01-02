-- Check publication cover images
-- Run this to see what's in your database

-- Check recent publications and their cover images
SELECT
  p.title,
  p.publication_date,
  p.cover_image_url,
  ms.name as source_name,
  ms.logo_url,
  (SELECT COUNT(*) FROM articles WHERE publication_id = p.id) as article_count
FROM publications p
JOIN media_sources ms ON p.media_source_id = ms.id
WHERE p.publication_date = CURRENT_DATE
ORDER BY p.created_at DESC
LIMIT 20;

-- Check if any publications have cover images
SELECT
  COUNT(*) as total_publications,
  COUNT(cover_image_url) as publications_with_covers,
  COUNT(*) - COUNT(cover_image_url) as publications_without_covers
FROM publications
WHERE publication_date = CURRENT_DATE;

-- Check articles with images (these should become publication covers)
SELECT
  ms.name,
  COUNT(*) as articles_with_images
FROM articles a
JOIN media_sources ms ON a.media_source_id = ms.id
WHERE a.image_url IS NOT NULL
  AND a.created_at > CURRENT_DATE
GROUP BY ms.name
ORDER BY articles_with_images DESC;
