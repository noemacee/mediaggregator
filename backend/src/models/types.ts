// TypeScript interfaces for Mediaggregator backend

// =====================================================
// DATABASE MODELS
// =====================================================

export interface MediaSource {
  id: string;
  name: string;
  slug: string;
  type: 'newspaper' | 'magazine';
  description?: string;
  website_url?: string;
  logo_url?: string;
  cover_image_url?: string;
  political_leaning?: 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'neutral';
  is_active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RssFeed {
  id: string;
  media_source_id: string;
  feed_url: string;
  category?: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  media_source_id: string;
  title: string;
  publication_date: string;
  cover_image_url?: string;
  description?: string;
  source_url?: string;
  is_latest: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  publication_id?: string;
  media_source_id: string;
  rss_feed_id?: string;
  title: string;
  description?: string;
  content?: string;
  author?: string;
  published_at?: string;
  article_url?: string;
  image_url?: string;
  category?: string;
  guid?: string;
  created_at: string;
  updated_at: string;
}

export interface FetchLog {
  id: string;
  media_source_id: string;
  rss_feed_id?: string;
  status: 'success' | 'error' | 'partial';
  items_fetched: number;
  error_message?: string;
  fetch_duration_ms: number;
  created_at: string;
}

// =====================================================
// RSS PARSER TYPES
// =====================================================

export interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  isoDate?: string;
  enclosure?: {
    url: string;
    length?: string;
    type?: string;
  };
  'media:content'?: Array<{
    $: {
      url: string;
      medium?: string;
      width?: string;
      height?: string;
    };
  }>;
  'media:thumbnail'?: Array<{
    $: {
      url: string;
      width?: string;
      height?: string;
    };
  }>;
}

export interface RssFeed {
  title?: string;
  description?: string;
  link?: string;
  items: RssItem[];
}

// =====================================================
// SERVICE TYPES
// =====================================================

export interface FetchResult {
  success: boolean;
  mediaSourceId: string;
  rssFeedId: string;
  itemsFetched: number;
  error?: string;
  durationMs: number;
}

export interface ImageExtractionResult {
  url: string;
  width?: number;
  height?: number;
  source: 'media:content' | 'media:thumbnail' | 'enclosure' | 'html' | 'fallback';
}

export interface PublicationWithSource extends Publication {
  media_source: MediaSource;
  articles_count?: number;
}

export interface ArticleWithRelations extends Article {
  media_source?: MediaSource;
  publication?: Publication;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface GetPublicationsQuery {
  date?: string;
  type?: 'newspaper' | 'magazine';
  source_id?: string;
  latest_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetArticlesQuery {
  media_source_id?: string;
  publication_id?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type MediaType = 'newspaper' | 'magazine';
export type FetchStatus = 'success' | 'error' | 'partial';
export type PoliticalLeaning = 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'neutral';
