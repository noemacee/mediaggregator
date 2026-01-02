import MainLayout from '../components/layout/MainLayout';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useState } from 'react';

const Feed = () => {
  const [limit, setLimit] = useState(50);
  const { articles, loading, refetch } = useArticles({ limit });

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">En continu</h1>
          <p className="text-gray-600 mt-1">
            Tous les articles en temps réel
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualiser</span>
          </button>
        </div>

        {/* Feed */}
        {loading && articles.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More */}
            {!loading && articles.length >= limit && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setLimit(limit + 50)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Charger plus d'articles
                </button>
              </div>
            )}

            {loading && articles.length > 0 && (
              <div className="mt-8">
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Feed;
