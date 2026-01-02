-- Fix media source logos with Google's Favicon API
-- Run this in Supabase SQL Editor
-- Google's favicon service is reliable, CORS-friendly, and works with any domain
-- Format: https://www.google.com/s2/favicons?domain=DOMAIN&sz=128
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=lemonde.fr&sz=128'
WHERE slug = 'le-monde';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=lefigaro.fr&sz=128'
WHERE slug = 'le-figaro';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=liberation.fr&sz=128'
WHERE slug = 'liberation';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=humanite.fr&sz=128'
WHERE slug = 'lhumanite';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=lesechos.fr&sz=128'
WHERE slug = 'les-echos';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=france24.com&sz=128'
WHERE slug = 'france-24';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=20minutes.fr&sz=128'
WHERE slug = '20-minutes';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=lepoint.fr&sz=128'
WHERE slug = 'le-point';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=lexpress.fr&sz=128'
WHERE slug = 'lexpress';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=nouvelobs.com&sz=128'
WHERE slug = 'lobs';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=marianne.net&sz=128'
WHERE slug = 'marianne';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=challenges.fr&sz=128'
WHERE slug = 'challenges';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=parismatch.com&sz=128'
WHERE slug = 'paris-match';
UPDATE media_sources
SET logo_url = 'https://www.google.com/s2/favicons?domain=courrierinternational.com&sz=128'
WHERE slug = 'courrier-international';
-- Verify the update
SELECT name,
    slug,
    logo_url
FROM media_sources
ORDER BY name;