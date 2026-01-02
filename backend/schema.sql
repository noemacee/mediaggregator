-- Mediaggregator Database Schema for Supabase
-- Run this entire file in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Table: media_sources
-- Stores information about French media outlets
CREATE TABLE IF NOT EXISTS media_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('newspaper', 'magazine')),
  description TEXT,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  political_leaning VARCHAR(50) CHECK (political_leaning IN ('left', 'center-left', 'center', 'center-right', 'right', 'neutral')),
  is_active BOOLEAN DEFAULT true,
  fetch_interval_minutes INTEGER DEFAULT 60,
  last_fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: rss_feeds
-- Stores RSS feed URLs for each media source
CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_source_id UUID REFERENCES media_sources(id) ON DELETE CASCADE,
  feed_url VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: publications
-- Stores daily publication editions
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_source_id UUID REFERENCES media_sources(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  publication_date DATE NOT NULL,
  cover_image_url VARCHAR(500),
  description TEXT,
  source_url VARCHAR(500),
  is_latest BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(media_source_id, publication_date)
);

-- Table: articles
-- Stores individual articles from RSS feeds
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
  media_source_id UUID REFERENCES media_sources(id) ON DELETE CASCADE,
  rss_feed_id UUID REFERENCES rss_feeds(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP,
  article_url VARCHAR(500) UNIQUE,
  image_url VARCHAR(500),
  category VARCHAR(100),
  guid VARCHAR(500) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: fetch_logs
-- Logs RSS feed fetch attempts for monitoring
CREATE TABLE IF NOT EXISTS fetch_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_source_id UUID REFERENCES media_sources(id) ON DELETE CASCADE,
  rss_feed_id UUID REFERENCES rss_feeds(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  items_fetched INTEGER DEFAULT 0,
  error_message TEXT,
  fetch_duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_media_sources_slug ON media_sources(slug);
CREATE INDEX IF NOT EXISTS idx_media_sources_type ON media_sources(type);
CREATE INDEX IF NOT EXISTS idx_media_sources_active ON media_sources(is_active);

CREATE INDEX IF NOT EXISTS idx_rss_feeds_media_source ON rss_feeds(media_source_id);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_active ON rss_feeds(is_active);

CREATE INDEX IF NOT EXISTS idx_publications_media_source ON publications(media_source_id);
CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_publications_latest ON publications(is_latest) WHERE is_latest = true;

CREATE INDEX IF NOT EXISTS idx_articles_publication ON articles(publication_id);
CREATE INDEX IF NOT EXISTS idx_articles_media_source ON articles(media_source_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_guid ON articles(guid);

CREATE INDEX IF NOT EXISTS idx_fetch_logs_created ON fetch_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fetch_logs_status ON fetch_logs(status);

-- =====================================================
-- SEED DATA - FRENCH MEDIA SOURCES
-- =====================================================

-- Insert French Newspapers
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active) VALUES
('Le Monde', 'le-monde', 'newspaper', 'Quotidien français de référence', 'https://www.lemonde.fr', 'https://www.lemonde.fr/dist/assets/img/logos/lemonde_logo.svg', 'center-left', true),
('Le Figaro', 'le-figaro', 'newspaper', 'Quotidien national français', 'https://www.lefigaro.fr', 'https://www.lefigaro.fr/favicon.ico', 'center-right', true),
('Libération', 'liberation', 'newspaper', 'Quotidien français d''information', 'https://www.liberation.fr', 'https://www.liberation.fr/apps/static/img/logos/liberation.svg', 'left', true),
('L''Humanité', 'lhumanite', 'newspaper', 'Quotidien communiste français', 'https://www.humanite.fr', 'https://www.humanite.fr/sites/all/themes/custom/humanite/logo.svg', 'left', true),
('Les Échos', 'les-echos', 'newspaper', 'Quotidien français d''information économique', 'https://www.lesechos.fr', 'https://www.lesechos.fr/medias/2021/07/27/logo-les-echos.svg', 'center-right', true),
('France 24', 'france-24', 'newspaper', 'Chaîne d''information internationale', 'https://www.france24.com/fr/', 'https://www.france24.com/fr/assets/images/logo-france-24.png', 'neutral', true),
('20 Minutes', '20-minutes', 'newspaper', 'Quotidien gratuit d''information', 'https://www.20minutes.fr', 'https://www.20minutes.fr/img/logo-20minutes.svg', 'neutral', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert French Magazines
INSERT INTO media_sources (name, slug, type, description, website_url, logo_url, political_leaning, is_active) VALUES
('Le Point', 'le-point', 'magazine', 'Magazine d''actualité hebdomadaire', 'https://www.lepoint.fr', 'https://www.lepoint.fr/dist/img/logo-le-point.svg', 'center-right', true),
('L''Express', 'lexpress', 'magazine', 'Magazine d''information hebdomadaire', 'https://www.lexpress.fr', 'https://www.lexpress.fr/arc/outbrain/logo-lexpress.png', 'center', true),
('L''Obs', 'lobs', 'magazine', 'Magazine hebdomadaire d''information', 'https://www.nouvelobs.com', 'https://www.nouvelobs.com/assets/images/logo-obs.svg', 'center-left', true),
('Marianne', 'marianne', 'magazine', 'Hebdomadaire d''actualité français', 'https://www.marianne.net', 'https://www.marianne.net/sites/all/themes/marianne/logo.svg', 'left', true),
('Challenges', 'challenges', 'magazine', 'Magazine économique hebdomadaire', 'https://www.challenges.fr', 'https://www.challenges.fr/assets/svg/logo-challenges.svg', 'center-right', true),
('Paris Match', 'paris-match', 'magazine', 'Magazine hebdomadaire français', 'https://www.parismatch.com', 'https://www.parismatch.com/assets/images/logo-paris-match.svg', 'center', true),
('Courrier International', 'courrier-international', 'magazine', 'Magazine hebdomadaire français', 'https://www.courrierinternational.com', 'https://www.courrierinternational.com/sites/all/themes/ci/logo.png', 'center-left', true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - RSS FEEDS
-- =====================================================

-- RSS Feeds for Newspapers
INSERT INTO rss_feeds (media_source_id, feed_url, category, priority) VALUES
((SELECT id FROM media_sources WHERE slug = 'le-monde'), 'https://www.lemonde.fr/rss/une.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'le-figaro'), 'https://www.lefigaro.fr/rss/figaro_actualites.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'liberation'), 'https://www.liberation.fr/rss/', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'lhumanite'), 'https://www.humanite.fr/rss.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'les-echos'), 'https://www.lesechos.fr/rss/', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'france-24'), 'https://www.france24.com/fr/rss', 'main', 1),
((SELECT id FROM media_sources WHERE slug = '20-minutes'), 'https://www.20minutes.fr/feeds/rss-une.xml', 'main', 1)
ON CONFLICT DO NOTHING;

-- RSS Feeds for Magazines
INSERT INTO rss_feeds (media_source_id, feed_url, category, priority) VALUES
((SELECT id FROM media_sources WHERE slug = 'le-point'), 'https://www.lepoint.fr/24h-infos/rss.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'lexpress'), 'https://www.lexpress.fr/rss/', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'lobs'), 'https://www.nouvelobs.com/a-la-une/rss.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'marianne'), 'https://www.marianne.net/rss.xml', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'challenges'), 'https://www.challenges.fr/rss/', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'paris-match'), 'https://www.parismatch.com/rss/', 'main', 1),
((SELECT id FROM media_sources WHERE slug = 'courrier-international'), 'https://www.courrierinternational.com/rss/', 'main', 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS (Optional - for automatic timestamp updates)
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_media_sources_updated_at BEFORE UPDATE ON media_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON rss_feeds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETE
-- =====================================================

-- Verify setup
SELECT 'Database schema created successfully!' as message;
SELECT 'Media Sources:', COUNT(*) FROM media_sources;
SELECT 'RSS Feeds:', COUNT(*) FROM rss_feeds;
