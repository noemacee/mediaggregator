import { Article } from '../../types';
import ImageWithFallback from '../common/ImageWithFallback';
import { useSavedArticles } from '../../hooks/useSavedArticles';
import SmallArticleCard from './SmallArticleCard';

interface FeaturedArticlesLayoutProps {
  articles: Article[];
}

const FeaturedArticlesLayout = ({ articles }: FeaturedArticlesLayoutProps) => {
  const { isSaved, toggleSave } = useSavedArticles();

  if (articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

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

  const handleMainArticleClick = () => {
    if (mainArticle.article_url) {
      window.open(mainArticle.article_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Featured Article - Left Side (2 columns) */}
      <div className="lg:col-span-2 h-full">
        <article
          onClick={handleMainArticleClick}
          className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-gray-100 shadow-lg h-full flex flex-col"
        >
          {/* Large Image */}
          {(mainArticle.image_url || mainArticle.media_source?.logo_url) && (
            <div className="w-full h-48 flex-shrink-0 overflow-hidden">
              <ImageWithFallback
                src={mainArticle.image_url}
                fallbackSrc={mainArticle.media_source?.logo_url}
                alt={mainArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Title */}
            <h2 className="text-xl lg:text-2xl font-bold text-amber-950 mb-3 hover:bg-gradient-to-r hover:from-amber-700 hover:to-orange-700 hover:bg-clip-text hover:text-transparent line-clamp-2 transition-all">
              {mainArticle.title}
            </h2>

            {/* Description */}
            {mainArticle.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {mainArticle.description}
              </p>
            )}

            {/* Footer: Source with Logo, Bookmark, Share */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-2">
                {mainArticle.media_source?.logo_url && (
                  <img
                    src={mainArticle.media_source.logo_url}
                    alt={mainArticle.media_source.name}
                    className="h-5 w-5 object-contain"
                  />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {mainArticle.media_source?.name}
                </span>
                {mainArticle.published_at && (
                  <span className="text-sm text-gray-500">
                    • {formatDate(mainArticle.published_at)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(mainArticle.id);
                  }}
                  className={`transition-all duration-200 hover:scale-110 ${
                    isSaved(mainArticle.id)
                      ? 'text-amber-700'
                      : 'text-gray-400 hover:text-amber-700'
                  }`}
                  title={isSaved(mainArticle.id) ? 'Retirer des sauvegardes' : 'Sauvegarder'}
                >
                  {isSaved(mainArticle.id) ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 2a2 2 0 0 0-2 2v16l7-3.5L17 20V4a2 2 0 0 0-2-2H5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  title="Partager"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Side Articles - Right Side (1 column) */}
      <div className="lg:col-span-1 h-full flex flex-col gap-3">
        {sideArticles.map((article) => (
          <div key={article.id} className="flex-1 min-h-0">
            <SmallArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArticlesLayout;
