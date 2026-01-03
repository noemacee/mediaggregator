-- Add many more French media sources
-- Run this in Supabase SQL Editor

-- ============================================
-- GENERAL NEWS (MAIN CATEGORY)
-- ============================================

-- Le Parisien
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Le Parisien',
  'le-parisien',
  'newspaper',
  'Quotidien d''information français',
  'https://www.leparisien.fr',
  'https://www.google.com/s2/favicons?domain=leparisien.fr&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- Ouest-France
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Ouest-France',
  'ouest-france',
  'newspaper',
  'Premier quotidien français',
  'https://www.ouest-france.fr',
  'https://www.google.com/s2/favicons?domain=ouest-france.fr&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- La Croix
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'La Croix',
  'la-croix',
  'newspaper',
  'Quotidien catholique d''actualité',
  'https://www.la-croix.com',
  'https://www.google.com/s2/favicons?domain=la-croix.com&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- Mediapart
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Mediapart',
  'mediapart',
  'newspaper',
  'Journal d''information en ligne',
  'https://www.mediapart.fr',
  'https://www.google.com/s2/favicons?domain=mediapart.fr&sz=128',
  'main',
  'left',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- France Info
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'France Info',
  'franceinfo',
  'newspaper',
  'Service public d''information',
  'https://www.francetvinfo.fr',
  'https://www.google.com/s2/favicons?domain=francetvinfo.fr&sz=128',
  'main',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- BFM TV
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'BFM TV',
  'bfmtv',
  'newspaper',
  'Chaîne d''information en continu',
  'https://www.bfmtv.com',
  'https://www.google.com/s2/favicons?domain=bfmtv.com&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- LCI
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'LCI',
  'lci',
  'newspaper',
  'Chaîne d''information du groupe TF1',
  'https://www.lci.fr',
  'https://www.google.com/s2/favicons?domain=lci.fr&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- Sud Ouest
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Sud Ouest',
  'sud-ouest',
  'newspaper',
  'Quotidien régional',
  'https://www.sudouest.fr',
  'https://www.google.com/s2/favicons?domain=sudouest.fr&sz=128',
  'main',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'main';

-- ============================================
-- ECONOMY CATEGORY
-- ============================================

-- La Tribune
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'La Tribune',
  'la-tribune',
  'newspaper',
  'Quotidien économique et financier',
  'https://www.latribune.fr',
  'https://www.google.com/s2/favicons?domain=latribune.fr&sz=128',
  'economy',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'economy';

-- Capital
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Capital',
  'capital',
  'magazine',
  'Magazine économique',
  'https://www.capital.fr',
  'https://www.google.com/s2/favicons?domain=capital.fr&sz=128',
  'economy',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'economy';

-- L'Usine Nouvelle
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'L''Usine Nouvelle',
  'usine-nouvelle',
  'magazine',
  'Magazine de l''industrie',
  'https://www.usinenouvelle.com',
  'https://www.google.com/s2/favicons?domain=usinenouvelle.com&sz=128',
  'economy',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'economy';

-- Boursorama
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Boursorama',
  'boursorama',
  'newspaper',
  'Actualité financière et boursière',
  'https://www.boursorama.com',
  'https://www.google.com/s2/favicons?domain=boursorama.com&sz=128',
  'economy',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'economy';

-- BFM Business
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'BFM Business',
  'bfm-business',
  'newspaper',
  'Chaîne économique',
  'https://www.bfmtv.com/economie',
  'https://www.google.com/s2/favicons?domain=bfmtv.com&sz=128',
  'economy',
  'center',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'economy';

-- ============================================
-- SPORTS CATEGORY
-- ============================================

-- Foot Mercato
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Foot Mercato',
  'foot-mercato',
  'newspaper',
  'Actualité football et mercato',
  'https://www.footmercato.net',
  'https://www.google.com/s2/favicons?domain=footmercato.net&sz=128',
  'sports',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'sports';

-- So Foot
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'So Foot',
  'so-foot',
  'magazine',
  'Magazine de football',
  'https://www.sofoot.com',
  'https://www.google.com/s2/favicons?domain=sofoot.com&sz=128',
  'sports',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'sports';

-- France Football
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'France Football',
  'france-football',
  'magazine',
  'Magazine de football',
  'https://www.francefootball.fr',
  'https://www.google.com/s2/favicons?domain=francefootball.fr&sz=128',
  'sports',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'sports';

-- Le 10 Sport
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Le 10 Sport',
  'le-10-sport',
  'newspaper',
  'Actualité sportive',
  'https://www.le10sport.com',
  'https://www.google.com/s2/favicons?domain=le10sport.com&sz=128',
  'sports',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'sports';

-- Sport.fr
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, category, political_leaning, is_active, fetch_interval_minutes)
VALUES (
  'Sport.fr',
  'sport-fr',
  'newspaper',
  'Actualité sportive multisport',
  'https://www.sport.fr',
  'https://www.google.com/s2/favicons?domain=sport.fr&sz=128',
  'sports',
  'neutral',
  true,
  60
) ON CONFLICT (slug) DO UPDATE SET is_active = true, category = 'sports';

-- ============================================
-- ADD RSS FEEDS
-- ============================================

-- Le Parisien RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.leparisien.fr/rss.php', 'main', true, 1
FROM media_sources WHERE slug = 'le-parisien';

-- Ouest-France RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.ouest-france.fr/rss', 'main', true, 1
FROM media_sources WHERE slug = 'ouest-france';

-- La Croix RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.la-croix.com/RSS/UNIVERS', 'main', true, 1
FROM media_sources WHERE slug = 'la-croix';

-- France Info RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.francetvinfo.fr/titres.rss', 'main', true, 1
FROM media_sources WHERE slug = 'franceinfo';

-- BFM TV RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/', 'main', true, 1
FROM media_sources WHERE slug = 'bfmtv';

-- LCI RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.lci.fr/rss/', 'main', true, 1
FROM media_sources WHERE slug = 'lci';

-- Sud Ouest RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.sudouest.fr/rss', 'main', true, 1
FROM media_sources WHERE slug = 'sud-ouest';

-- La Tribune RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.latribune.fr/rss/a-la-une.rss', 'economy', true, 1
FROM media_sources WHERE slug = 'la-tribune';

-- Capital RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.capital.fr/rss', 'economy', true, 1
FROM media_sources WHERE slug = 'capital';

-- L'Usine Nouvelle RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.usinenouvelle.com/rss', 'economy', true, 1
FROM media_sources WHERE slug = 'usine-nouvelle';

-- Boursorama RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.boursorama.com/rss/actualites/', 'economy', true, 1
FROM media_sources WHERE slug = 'boursorama';

-- Foot Mercato RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.footmercato.net/rss.xml', 'sports', true, 1
FROM media_sources WHERE slug = 'foot-mercato';

-- So Foot RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.sofoot.com/rss.xml', 'sports', true, 1
FROM media_sources WHERE slug = 'so-foot';

-- France Football RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.francefootball.fr/rss', 'sports', true, 1
FROM media_sources WHERE slug = 'france-football';

-- Le 10 Sport RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.le10sport.com/rss', 'sports', true, 1
FROM media_sources WHERE slug = 'le-10-sport';

-- Sport.fr RSS
INSERT INTO rss_feeds (media_source_id, feed_url, category, is_active, priority)
SELECT id, 'https://www.sport.fr/rss.xml', 'sports', true, 1
FROM media_sources WHERE slug = 'sport-fr';

-- ============================================
-- VERIFY
-- ============================================

-- Count sources by category
SELECT
  category,
  COUNT(*) as source_count,
  STRING_AGG(name, ', ' ORDER BY name) as sources
FROM media_sources
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- Count RSS feeds
SELECT
  ms.category,
  COUNT(rf.id) as feed_count
FROM media_sources ms
LEFT JOIN rss_feeds rf ON ms.id = rf.media_source_id
WHERE ms.is_active = true
GROUP BY ms.category
ORDER BY ms.category;
