-- Migration: Add Sports RSS Feeds
-- This migration adds sports category RSS feeds to existing media sources
-- Run this in Supabase SQL Editor
-- =====================================================
-- SPORTS RSS FEEDS FOR NEWSPAPERS
-- =====================================================
-- Le Monde - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.lemonde.fr/sport/rss_full.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'le-monde' ON CONFLICT DO NOTHING;
-- Le Figaro - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.lefigaro.fr/rss/figaro_sport.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'le-figaro' ON CONFLICT DO NOTHING;
-- Libération - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.liberation.fr/rss/sport/',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'liberation' ON CONFLICT DO NOTHING;
-- L'Humanité - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.humanite.fr/rss/sport.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'lhumanite' ON CONFLICT DO NOTHING;
-- Les Échos - Sports (if available)
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.lesechos.fr/rss/sport.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'les-echos' ON CONFLICT DO NOTHING;
-- France 24 - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.france24.com/fr/sports/rss',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'france-24' ON CONFLICT DO NOTHING;
-- 20 Minutes - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.20minutes.fr/sport/rss-une.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = '20-minutes' ON CONFLICT DO NOTHING;
-- =====================================================
-- SPORTS RSS FEEDS FOR MAGAZINES
-- =====================================================
-- Le Point - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.lepoint.fr/sport/rss.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'le-point' ON CONFLICT DO NOTHING;
-- L'Express - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.lexpress.fr/rss/sport.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'lexpress' ON CONFLICT DO NOTHING;
-- L'Obs - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.nouvelobs.com/sport/rss.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'lobs' ON CONFLICT DO NOTHING;
-- Marianne - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.marianne.net/sport/rss.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'marianne' ON CONFLICT DO NOTHING;
-- Challenges - Sports (if available)
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.challenges.fr/sport/rss.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'challenges' ON CONFLICT DO NOTHING;
-- Paris Match - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.parismatch.com/sport/rss.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'paris-match' ON CONFLICT DO NOTHING;
-- Courrier International - Sports
INSERT INTO rss_feeds (
        media_source_id,
        feed_url,
        category,
        priority,
        is_active
    )
SELECT id,
    'https://www.courrierinternational.com/rss/sport.xml',
    'sports',
    2,
    true
FROM media_sources
WHERE slug = 'courrier-international' ON CONFLICT DO NOTHING;
-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check how many sports feeds were added
SELECT 'Sports feeds added:' as message,
    COUNT(*) as count
FROM rss_feeds
WHERE category = 'sports';
-- List all sports feeds
SELECT ms.name as media_source,
    ms.type,
    rf.feed_url,
    rf.category,
    rf.is_active
FROM rss_feeds rf
    JOIN media_sources ms ON rf.media_source_id = ms.id
WHERE rf.category = 'sports'
ORDER BY ms.type,
    ms.name;