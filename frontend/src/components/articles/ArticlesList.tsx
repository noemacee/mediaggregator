import ArticleCard from './ArticleCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Article } from '../../types';

interface ArticlesListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const ArticlesList = ({ articles, loading, error, onRetry }: ArticlesListProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
        <p className="text-gray-400 text-sm mt-2">
          Essayez de changer les filtres ou revenez plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticlesList;
