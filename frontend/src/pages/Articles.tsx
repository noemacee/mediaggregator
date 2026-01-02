import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ArticlesList from '../components/articles/ArticlesList';
import { useArticles } from '../hooks/useArticles';
import { useMediaSources } from '../hooks/useMediaSources';
import { getArticleCategories } from '../services/api';

const Articles = () => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articlesLimit, setArticlesLimit] = useState<number>(50);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  const { mediaSources } = useMediaSources();
  const { articles, loading, error, refetch } = useArticles({
    media_source_id: selectedSourceId === 'all' ? undefined : selectedSourceId,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: articlesLimit
  });

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const cats = await getArticleCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* First row: Source and Category filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Media source filter */}
              <div className="flex items-center space-x-3">
                <label htmlFor="source-filter" className="text-sm font-medium text-gray-700">
                  Source:
                </label>
                <select
                  id="source-filter"
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les sources</option>
                  {mediaSources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name} ({source.type === 'newspaper' ? 'Quotidien' : 'Magazine'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div className="flex items-center space-x-3">
                <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                  Catégorie:
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={categoriesLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second row: Articles count */}
            <div className="flex items-center space-x-3">
              <label htmlFor="limit-filter" className="text-sm font-medium text-gray-700">
                Afficher:
              </label>
              <select
                id="limit-filter"
                value={articlesLimit}
                onChange={(e) => setArticlesLimit(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={20}>20 articles</option>
                <option value={50}>50 articles</option>
                <option value={100}>100 articles</option>
                <option value={200}>200 articles</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Articles récents</h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Chargement...' : `${articles.length} article${articles.length > 1 ? 's' : ''}`}
          </p>
        </div>

        <ArticlesList
          articles={articles}
          loading={loading}
          error={error}
          onRetry={refetch}
        />

        {/* Load more button */}
        {!loading && articles.length >= articlesLimit && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setArticlesLimit(articlesLimit + 50)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Charger plus d'articles
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Le Kiosque - Votre kiosque de presse français</p>
          <p className="mt-2 text-gray-500">
            Les contenus sont la propriété de leurs éditeurs respectifs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Articles;
