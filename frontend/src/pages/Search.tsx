import { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { articles, loading } = useArticles({ limit: 500 });

  // Memoize search results for better performance
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    return articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(query);
      const descMatch = article.description?.toLowerCase().includes(query);
      const sourceMatch = article.media_source?.name?.toLowerCase().includes(query);
      const authorMatch = article.author?.toLowerCase().includes(query);
      return titleMatch || descMatch || sourceMatch || authorMatch;
    });
  }, [searchQuery, articles]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-3 tracking-tight">Recherche</h1>
          <p className="text-xl text-gray-600 font-normal leading-relaxed">
            Recherchez des articles par mots-clés, titre, auteur ou source
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-4xl">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() === '') {
                    setHasSearched(false);
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Rechercher des articles..."
                className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="ml-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Rechercher</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
            {searchQuery && (
              <div className="mt-3 text-sm text-gray-500">
                Recherche dans {articles.length} article{articles.length > 1 ? 's' : ''} disponible{articles.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          {loading && articles.length === 0 ? (
            <LoadingSpinner />
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-600 text-xl font-medium mb-2">
                Aucun résultat trouvé
              </p>
              <p className="text-gray-500 text-base">
                Aucun article ne correspond à "{searchQuery}"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez avec d'autres mots-clés ou vérifiez l'orthographe
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-700 text-lg font-medium">
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                  {searchQuery && (
                    <span className="text-gray-500 font-normal ml-2">
                      pour "{searchQuery}"
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-6">
                {searchResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-600 text-xl font-medium mb-2">
                Commencez votre recherche
              </p>
              <p className="text-gray-500 text-base">
                Recherchez parmi {articles.length} article{articles.length > 1 ? 's' : ''} disponible{articles.length > 1 ? 's' : ''}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Utilisez la barre de recherche ci-dessus pour trouver des articles
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
