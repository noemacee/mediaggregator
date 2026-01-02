import axios, { AxiosInstance } from 'axios';
import { Publication, MediaSource, Article, ApiResponse, PublicationFilters } from '../types';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// =====================================================
// PUBLICATIONS API
// =====================================================

export const getPublications = async (
  filters?: PublicationFilters
): Promise<Publication[]> => {
  const { data } = await apiClient.get<ApiResponse<Publication[]>>('/api/publications', {
    params: filters
  });
  return data.data;
};

export const getPublicationById = async (id: string): Promise<Publication> => {
  const { data } = await apiClient.get<ApiResponse<Publication>>(`/api/publications/${id}`);
  return data.data;
};

export const getPublicationsBySource = async (
  sourceId: string
): Promise<Publication[]> => {
  const { data } = await apiClient.get<ApiResponse<Publication[]>>(
    `/api/publications/source/${sourceId}`
  );
  return data.data;
};

export const getPublicationsByDate = async (date: string): Promise<Publication[]> => {
  const { data } = await apiClient.get<ApiResponse<Publication[]>>(
    `/api/publications/date/${date}`
  );
  return data.data;
};

export const getPublicationStats = async (): Promise<{
  total_publications: number;
  today_publications: number;
  total_articles: number;
  today_articles: number;
}> => {
  const { data } = await apiClient.get('/api/publications/stats');
  return data.data;
};

// =====================================================
// MEDIA SOURCES API
// =====================================================

export const getMediaSources = async (
  type?: 'newspaper' | 'magazine'
): Promise<MediaSource[]> => {
  const { data } = await apiClient.get<ApiResponse<MediaSource[]>>('/api/media-sources', {
    params: type ? { type } : undefined
  });
  return data.data;
};

export const getMediaSourceById = async (id: string): Promise<MediaSource> => {
  const { data } = await apiClient.get<ApiResponse<MediaSource>>(
    `/api/media-sources/${id}`
  );
  return data.data;
};

// =====================================================
// ARTICLES API
// =====================================================

export const getArticles = async (params?: {
  media_source_id?: string;
  publication_id?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> => {
  const { data } = await apiClient.get<ApiResponse<Article[]>>('/api/articles', {
    params
  });
  return data.data;
};

export const getArticleById = async (id: string): Promise<Article> => {
  const { data } = await apiClient.get<ApiResponse<Article>>(`/api/articles/${id}`);
  return data.data;
};

// =====================================================
// ADMIN API
// =====================================================

export const triggerFetchNow = async (): Promise<void> => {
  await apiClient.post('/api/admin/fetch-now');
};

export const getFetchLogs = async (
  limit?: number,
  status?: 'success' | 'error' | 'partial'
): Promise<any[]> => {
  const { data } = await apiClient.get('/api/admin/fetch-logs', {
    params: { limit, status }
  });
  return data.data;
};

// =====================================================
// HEALTH CHECK
// =====================================================

export const checkHealth = async (): Promise<{ status: string; message: string }> => {
  const { data } = await apiClient.get('/health');
  return data;
};

export default apiClient;
