// TypeScript interfaces for Mediaggregator frontend

export type MediaType = 'newspaper' | 'magazine';
export type PoliticalLeaning = 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'neutral';

// Common article categories (simplified)
export type ArticleCategory =
  | 'main'     // General news
  | 'economy'  // Économie
  | 'sports';  // Sports

export interface MediaSource {
  id: string;
  name: string;
  slug: string;
  type: MediaType;
  description?: string;
  website_url?: string;
  logo_url?: string;
  cover_image_url?: string;
  political_leaning?: PoliticalLeaning;
  category?: ArticleCategory;
  is_active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at?: string;
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
  media_source?: MediaSource;
  articles_count?: number;
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
  media_source?: MediaSource;
  publication?: Publication;
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

export interface PublicationFilters {
  date?: string;
  type?: MediaType;
  source_id?: string;
  latest_only?: boolean;
}
