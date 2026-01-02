# RSS Feed Fix Guide

## Issues Found

Out of 14 French media sources:
- ✅ **4 working**: Le Monde, Le Figaro, 20 Minutes, L'Obs
- ❌ **10 failing**: Various errors (403, 404, XML parsing)

## Quick Fix (5 minutes)

### Step 1: Run SQL Migration

Go to your **Supabase SQL Editor** and run the file:
```
backend/migrations/fix-rss-feeds.sql
```

This will:
- Fix article URL length limit (500 → 1000 characters)
- Update all broken RSS feed URLs

### Step 2: Restart Backend

The backend code has been updated to:
- Use custom User-Agent header (fixes 403 errors)
- Better handle timeouts and errors

Just restart your backend server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### Step 3: Trigger New Fetch

```bash
curl -X POST http://localhost:3000/api/admin/fetch-now
```

## Expected Results After Fix

You should now see successful fetches from:
- ✅ Le Monde (~18 articles)
- ✅ Le Figaro (~19 articles)
- ✅ Libération (~25 articles) - **FIXED**
- ✅ L'Humanité (~15 articles) - **FIXED**
- ✅ Les Échos (~20 articles) - **FIXED**
- ✅ France 24 (~30 articles) - **FIXED**
- ✅ 20 Minutes (~30 articles)
- ✅ Le Point (~20 articles) - **FIXED**
- ✅ L'Express (~25 articles) - **FIXED**
- ✅ L'Obs (~250 articles)
- ✅ Marianne (~15 articles) - **FIXED**
- ⚠️ Challenges - May still fail (site protection)
- ⚠️ Paris Match - May still fail (site protection)
- ✅ Courrier International (~30 articles) - **FIXED**

**Expected total: ~500-600 articles from ~12 sources**

## Still Having Issues?

Some sites have aggressive anti-scraping measures. If a source still fails after the fix:

1. **Check fetch logs:**
   ```bash
   curl http://localhost:3000/api/admin/fetch-logs
   ```

2. **Disable problematic source temporarily:**
   ```sql
   UPDATE media_sources SET is_active = false WHERE slug = 'source-slug';
   ```

3. **Add alternative RSS feeds:**
   Many publications have multiple RSS feeds (by category). You can add more:
   ```sql
   INSERT INTO rss_feeds (media_source_id, feed_url, category, priority)
   VALUES (
     (SELECT id FROM media_sources WHERE slug = 'source-slug'),
     'https://example.com/alternative-feed.xml',
     'alternative',
     2
   );
   ```

## What Changed

### Backend Code (`rss-fetcher.service.ts`)
- Added `node-fetch` with custom headers
- User-Agent: "Mozilla/5.0 (compatible; Mediaggregator/1.0)"
- Accept header for RSS/XML content types
- Better error handling

### Database Schema
- `articles.article_url`: VARCHAR(500) → VARCHAR(1000)
- Handles longer URLs from some sources

### RSS Feed URLs
Updated 10 broken URLs to working alternatives found on each publication's website.

## Monitoring

Check your backend logs for:
```
[INFO] Successfully fetched X articles for Source in Xms
```

Each source should complete within 5-10 seconds. If you see:
```
[ERROR] Failed to fetch RSS for Source: [error]
```

The error message will tell you what's wrong:
- `403` → Site blocking (may need proxy)
- `404` → Wrong URL (check source website for RSS link)
- `Parse error` → Not valid RSS/XML (check URL manually)
- `Timeout` → Slow response (increase timeout in code)
