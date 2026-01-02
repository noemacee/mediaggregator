import ImageWithFallback from '../common/ImageWithFallback';
import { Article } from '../../types';
import { useSavedArticles } from '../../hooks/useSavedArticles';

interface SmallArticleCardProps {
  article: Article;
}

const SmallArticleCard = ({ article }: SmallArticleCardProps) => {
  const { title, description, image_url, article_url, published_at, media_source } = article;
  const { isSaved, toggleSave } = useSavedArticles();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Il y a moins d\'une heure';
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const handleClick = () => {
    if (article_url) {
      window.open(article_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-md border border-gray-200 shadow-sm"
    >
      <div className="flex gap-3 p-4">
        {/* Small Square Image */}
        {(image_url || media_source?.logo_url) && (
          <div className="flex-shrink-0 w-28 h-28">
            <ImageWithFallback
              src={image_url}
              fallbackSrc={media_source?.logo_url}
              alt={title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 leading-tight">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Footer: Source with Logo, Bookmark, Share */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              {media_source?.logo_url && (
                <img
                  src={media_source.logo_url}
                  alt={media_source.name}
                  className="h-3 w-3 object-contain"
                />
              )}
              <span className="text-xs font-medium text-gray-900">
                {media_source?.name}
              </span>
              {published_at && (
                <span className="text-xs text-gray-500">
                  • {formatDate(published_at)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(article.id);
                }}
                className={`transition-colors ${
                  isSaved(article.id)
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-blue-600'
                }`}
                title={isSaved(article.id) ? 'Retirer des sauvegardes' : 'Sauvegarder'}
              >
                {isSaved(article.id) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 2a2 2 0 0 0-2 2v16l7-3.5L17 20V4a2 2 0 0 0-2-2H5z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Partager"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SmallArticleCard;
