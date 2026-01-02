import { useState, useEffect } from 'react';
import { getArticles } from '../services/api';
import { Article } from '../types';

interface UseArticlesParams {
  media_source_id?: string;
  publication_id?: string;
  category?: string;
  limit?: number;
}

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useArticles = (params?: UseArticlesParams): UseArticlesResult => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles(params);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [JSON.stringify(params)]);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles
  };
};
