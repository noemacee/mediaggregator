import ImageWithFallback from '../common/ImageWithFallback';
import { Article } from '../../types';
import { useSavedArticles } from '../../hooks/useSavedArticles';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const { title, description, image_url, article_url, published_at, media_source } = article;
  const { isSaved, toggleSave } = useSavedArticles();

  const handleClick = () => {
    if (article_url) {
      window.open(article_url, '_blank', 'noopener,noreferrer');
    }
  };

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

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-gray-100"
    >
      <div className="flex gap-4 p-4">
        {/* Image - Left side */}
        {(image_url || media_source?.logo_url) && (
          <div className="flex-shrink-0 w-32 h-32">
            <ImageWithFallback
              src={image_url}
              fallbackSrc={media_source?.logo_url}
              alt={title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        {/* Content - Right side */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Source with Logo */}
          <div className="mb-2 flex items-center space-x-2">
            {media_source?.logo_url && (
              <img
                src={media_source.logo_url}
                alt={media_source.name}
                className="h-4 w-4 object-contain"
              />
            )}
            <span className="text-xs font-medium text-gray-700">
              {media_source?.name}
            </span>
            {published_at && (
              <span className="text-xs text-gray-500">
                • {formatDate(published_at)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-amber-950 mb-2 line-clamp-2 hover:bg-gradient-to-r hover:from-amber-700 hover:to-orange-700 hover:bg-clip-text hover:text-transparent leading-tight transition-all">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-grow">
              {description}
            </p>
          )}

          {/* Save Button */}
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(article.id);
              }}
              className={`text-sm flex items-center space-x-1 transition-all ${
                isSaved(article.id)
                  ? 'text-amber-700 hover:text-amber-900 hover:scale-105'
                  : 'text-gray-500 hover:text-amber-700 hover:scale-105'
              }`}
              title={isSaved(article.id) ? 'Retirer des sauvegardes' : 'Sauvegarder'}
            >
              {isSaved(article.id) ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 2a2 2 0 0 0-2 2v16l7-3.5L17 20V4a2 2 0 0 0-2-2H5z" />
                  </svg>
                  <span>Sauvegardé</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
