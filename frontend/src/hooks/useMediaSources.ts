import { useState, useEffect } from 'react';
import { getMediaSources } from '../services/api';
import { MediaSource, MediaType } from '../types';

interface UseMediaSourcesResult {
  mediaSources: MediaSource[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMediaSources = (type?: MediaType): UseMediaSourcesResult => {
  const [mediaSources, setMediaSources] = useState<MediaSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMediaSources(type);
      setMediaSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media sources');
      console.error('Error fetching media sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaSources();
  }, [type]);

  return {
    mediaSources,
    loading,
    error,
    refetch: fetchMediaSources
  };
};
