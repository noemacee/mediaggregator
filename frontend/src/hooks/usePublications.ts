import { useState, useEffect } from 'react';
import { getPublications } from '../services/api';
import { Publication, PublicationFilters } from '../types';

interface UsePublicationsResult {
  publications: Publication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePublications = (filters?: PublicationFilters): UsePublicationsResult => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublications(filters);
      setPublications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return {
    publications,
    loading,
    error,
    refetch: fetchPublications
  };
};
