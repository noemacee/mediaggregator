# Adding Sports Articles Guide

This guide explains how to add sports articles to your Mediaggregator instance.

## Overview

The application now supports article categories, including sports. Sports articles can be filtered and displayed separately from other content.

## What Was Added

### 1. Category Support

- **Backend**: Added `ArticleCategory` type definition
- **Frontend**: Added category filtering UI to the Articles page
- **API**: New endpoint `/api/articles/categories/list` to get available categories

### 2. Database Structure

The existing database schema already supports categories:

- `rss_feeds.category` - Category of the RSS feed (e.g., 'sports', 'main')
- `articles.category` - Category of individual articles (inherited from RSS feed or extracted from feed content)

## Adding Sports RSS Feeds

### Option 1: Using the Migration Script (Recommended)

1. Open your Supabase SQL Editor
2. Run the migration script:

   ```sql
   -- Copy and paste the contents of:
   backend/migrations/add-sports-feeds.sql
   ```

3. Verify the feeds were added:
   ```sql
   SELECT ms.name, rf.feed_url, rf.category
   FROM rss_feeds rf
   JOIN media_sources ms ON rf.media_source_id = ms.id
   WHERE rf.category = 'sports';
   ```

### Option 2: Manual Addition via API

You can add sports feeds manually using the admin API or directly in Supabase:

```sql
-- Example: Add a sports feed for Le Monde
INSERT INTO rss_feeds (media_source_id, feed_url, category, priority, is_active)
SELECT
  id,
  'https://www.lemonde.fr/sport/rss_full.xml',
  'sports',
  2,
  true
FROM media_sources
WHERE slug = 'le-monde';
```

### Option 3: Using the Admin Interface

If you have an admin interface, you can add RSS feeds through it by:

1. Selecting a media source
2. Adding a new RSS feed URL
3. Setting the category to 'sports'
4. Setting priority to 2 (lower than main feeds which are typically 1)

## Finding Sports RSS Feed URLs

Common patterns for French media sports RSS feeds:

- `https://[domain]/sport/rss.xml`
- `https://[domain]/sport/rss-full.xml`
- `https://[domain]/rss/sport.xml`
- `https://[domain]/sports/rss.xml`

### Popular French Sports Media RSS Feeds

Here are some verified sports RSS feeds for major French media:

**Newspapers:**

- Le Monde: `https://www.lemonde.fr/sport/rss_full.xml`
- Le Figaro: `https://www.lefigaro.fr/rss/figaro_sport.xml`
- Libération: `https://www.liberation.fr/rss/sport/`
- 20 Minutes: `https://www.20minutes.fr/sport/rss-une.xml`

**Magazines:**

- L'Express: `https://www.lexpress.fr/rss/sport.xml`
- Le Point: `https://www.lepoint.fr/sport/rss.xml`
- L'Obs: `https://www.nouvelobs.com/sport/rss.xml`

**Note**: Some media sources may not have dedicated sports RSS feeds, or the URLs may have changed. Always verify the feed URL before adding it.

## Testing Sports Feeds

1. **Verify Feed URLs**: Test the RSS feed URLs in a browser or RSS reader to ensure they're valid
2. **Trigger Fetch**: Use the admin API to trigger a fetch:
   ```bash
   curl -X POST http://localhost:3000/api/admin/fetch-now
   ```
3. **Check Articles**: Query articles with sports category:
   ```sql
   SELECT COUNT(*) FROM articles WHERE category = 'sports';
   ```
4. **View in Frontend**: Navigate to the Articles page and filter by "sports" category

## Frontend Usage

Once sports feeds are added and articles are fetched:

1. Go to the **Articles** page
2. Use the **Category** dropdown filter
3. Select **"Sports"** to view only sports articles
4. You can combine filters (e.g., Sports + specific media source)

## Category Priority

RSS feeds have a `priority` field:

- **Priority 1**: Main/headline feeds (fetched first)
- **Priority 2**: Category-specific feeds like sports (fetched after main feeds)
- Higher numbers = lower priority

## Troubleshooting

### No Sports Articles Appearing

1. **Check if feeds are active**:

   ```sql
   SELECT * FROM rss_feeds WHERE category = 'sports' AND is_active = false;
   ```

2. **Check fetch logs**:

   ```sql
   SELECT * FROM fetch_logs
   WHERE rss_feed_id IN (
     SELECT id FROM rss_feeds WHERE category = 'sports'
   )
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. **Verify feed URLs**: Some RSS feed URLs may have changed or may not exist

4. **Check if articles were created**:
   ```sql
   SELECT COUNT(*), category
   FROM articles
   GROUP BY category;
   ```

### Feed URL Returns 404

- The RSS feed URL may have changed
- Check the media source's website for updated RSS feed URLs
- Some media sources may not provide sports-specific RSS feeds

## Adding Other Categories

The same process can be used to add other categories:

- `politics`
- `economy`
- `culture`
- `technology`
- `international`
- `society`
- `opinion`

Just replace `'sports'` with the desired category name in the migration script.

## Next Steps

1. Run the migration script to add sports feeds
2. Trigger a fetch to populate articles
3. Test the category filter in the frontend
4. Adjust feed URLs as needed based on what's available from each media source
