import StyledPublicationCover from './StyledPublicationCover';
import { Publication } from '../../types';

interface PublicationCardProps {
  publication: Publication;
  topArticleTitle?: string;
  onClick?: () => void;
}

const PublicationCard = ({ publication, topArticleTitle, onClick }: PublicationCardProps) => {
  const { media_source, publication_date, articles_count } = publication;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="aspect-[3/4] relative bg-gray-100">
        <StyledPublicationCover
          publication={publication}
          topArticleTitle={topArticleTitle}
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm truncate">
          {media_source?.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(publication_date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })}
        </p>
        {articles_count !== undefined && articles_count > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {articles_count} article{articles_count > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
