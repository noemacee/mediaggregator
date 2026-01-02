import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useArticles } from '../hooks/useArticles';
import { useMediaSources } from '../hooks/useMediaSources';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FeaturedArticlesLayout from '../components/articles/FeaturedArticlesLayout';
import ArticleCard from '../components/articles/ArticleCard';

const Home = () => {
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
  const { articles: allArticles, loading: articlesLoading } = useArticles({ limit: 100 });
  const { mediaSources } = useMediaSources();

  // Filter articles based on selected media sources
  const filteredArticles = selectedMediaIds.size > 0
    ? allArticles.filter(article => selectedMediaIds.has(article.media_source_id))
    : allArticles;

  // Featured articles (first 4)
  const featuredArticles = filteredArticles.slice(0, 4);
  // Remaining articles for grid
  const remainingArticles = filteredArticles.slice(4);

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMediaIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mediaId)) {
        newSet.delete(mediaId);
      } else {
        newSet.add(mediaId);
      }
      return newSet;
    });
  };

  const isMediaSelected = (mediaId: string) => selectedMediaIds.has(mediaId);

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-3 tracking-tight">Accueil</h1>
          <p className="text-xl text-gray-600 font-normal leading-relaxed">Vos dernières publications et articles</p>
        </div>

        {/* Featured Articles Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos derniers articles</h2>
          {articlesLoading ? (
            <LoadingSpinner />
          ) : featuredArticles.length > 0 ? (
            <FeaturedArticlesLayout articles={featuredArticles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
            </div>
          )}
        </section>

        {/* Media Sources Filter Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes médias</h2>
          <div className="flex flex-wrap gap-4">
            {mediaSources.map((source) => (
              <div
                key={source.id}
                onClick={() => toggleMediaSelection(source.id)}
                className={`flex flex-col items-center p-4 rounded-lg shadow-sm transition-all cursor-pointer ${
                  isMediaSelected(source.id)
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                    : 'bg-white hover:shadow-md border-2 border-transparent'
                }`}
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  {source.logo_url ? (
                    <img
                      src={source.logo_url}
                      alt={source.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {source.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`text-xs text-center ${
                  isMediaSelected(source.id) ? 'text-blue-700 font-semibold' : 'text-gray-600'
                }`}>
                  {source.name}
                </span>
              </div>
            ))}
          </div>
          {selectedMediaIds.size > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setSelectedMediaIds(new Set())}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Effacer la sélection ({selectedMediaIds.size})
              </button>
            </div>
          )}
        </section>

        {/* All Articles Grid Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedMediaIds.size > 0 
              ? `Articles (${remainingArticles.length})` 
              : 'Tous les articles'}
          </h2>
          {articlesLoading ? (
            <LoadingSpinner />
          ) : remainingArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {selectedMediaIds.size > 0 
                  ? 'Aucun article disponible pour les médias sélectionnés.' 
                  : 'Aucun article disponible pour le moment.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
