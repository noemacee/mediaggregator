import PublicationCard from './PublicationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Publication } from '../../types';

interface NewsstandGridProps {
  publications: Publication[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onPublicationClick?: (publication: Publication) => void;
}

const NewsstandGrid = ({
  publications,
  loading,
  error,
  onRetry,
  onPublicationClick
}: NewsstandGridProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune publication disponible pour le moment.</p>
        <p className="text-gray-400 text-sm mt-2">
          Vérifiez plus tard ou essayez de changer les filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {publications.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          onClick={() => onPublicationClick?.(publication)}
        />
      ))}
    </div>
  );
};

export default NewsstandGrid;
