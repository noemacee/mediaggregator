import MainLayout from '../components/layout/MainLayout';
import { useArticles } from '../hooks/useArticles';
import { useSavedArticles } from '../hooks/useSavedArticles';
import ArticleCard from '../components/articles/ArticleCard';

const Saved = () => {
  const { articles } = useArticles({ limit: 200 });
  const { savedIds } = useSavedArticles();

  const savedArticles = articles.filter((article) => savedIds.includes(article.id));

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sauvegardés</h1>
          <p className="text-gray-600 mt-1">
            {savedArticles.length} article{savedArticles.length > 1 ? 's' : ''} sauvegardé{savedArticles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        {savedArticles.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-gray-500 text-lg mt-4">Aucun article sauvegardé</p>
            <p className="text-gray-400 text-sm mt-2">
              Sauvegardez des articles depuis l'accueil ou la recherche
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {savedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Saved;
