import { useState } from 'react';
import Header from '../components/common/Header';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { articles, loading } = useArticles({ limit: 200 });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const query = searchQuery.toLowerCase().trim();

    // Search in articles
    const results = articles.filter(
      (article) => {
        const titleMatch = article.title?.toLowerCase().includes(query);
        const descMatch = article.description?.toLowerCase().includes(query);
        const sourceMatch = article.media_source?.name?.toLowerCase().includes(query);
        return titleMatch || descMatch || sourceMatch;
      }
    );

    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-3 tracking-tight">Recherche</h1>
          <p className="text-xl text-gray-600 font-normal leading-relaxed">Recherchez des articles par mots-clés</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher des articles..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun résultat trouvé pour "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-2">Essayez avec d'autres mots-clés</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="text-gray-500 text-lg mt-4">
                Commencez votre recherche
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Recherchez parmi {articles.length} articles disponibles
              </p>
            </div>
          )}
        </div>
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

export default Search;
