import { Publication } from '../../types';

interface StyledPublicationCoverProps {
  publication: Publication;
  topArticleTitle?: string;
}

const StyledPublicationCover = ({ publication, topArticleTitle }: StyledPublicationCoverProps) => {
  const { media_source, publication_date, cover_image_url } = publication;

  // If we have an actual cover image from RSS, use it
  if (cover_image_url) {
    return (
      <img
        src={cover_image_url}
        alt={media_source?.name}
        className="w-full h-full object-cover"
      />
    );
  }

  // Otherwise, create a styled magazine/newspaper cover
  const isNewspaper = media_source?.type === 'newspaper';
  const date = new Date(publication_date);

  // Color scheme based on publication
  const getPublicationColors = () => {
    const slug = media_source?.slug || '';

    const colorSchemes: Record<string, { bg: string; accent: string; text: string }> = {
      'le-monde': { bg: 'bg-white', accent: 'bg-blue-900', text: 'text-blue-900' },
      'le-figaro': { bg: 'bg-red-50', accent: 'bg-red-800', text: 'text-red-900' },
      'liberation': { bg: 'bg-black', accent: 'bg-red-600', text: 'text-white' },
      'lhumanite': { bg: 'bg-red-700', accent: 'bg-red-900', text: 'text-white' },
      'les-echos': { bg: 'bg-red-600', accent: 'bg-red-800', text: 'text-white' },
      '20-minutes': { bg: 'bg-purple-600', accent: 'bg-purple-800', text: 'text-white' },
      'le-point': { bg: 'bg-white', accent: 'bg-red-600', text: 'text-gray-900' },
      'lexpress': { bg: 'bg-blue-600', accent: 'bg-blue-800', text: 'text-white' },
      'lobs': { bg: 'bg-orange-500', accent: 'bg-orange-700', text: 'text-white' },
      'marianne': { bg: 'bg-blue-900', accent: 'bg-blue-950', text: 'text-white' },
      'default': { bg: 'bg-gray-100', accent: 'bg-gray-800', text: 'text-gray-900' }
    };

    return colorSchemes[slug] || colorSchemes.default;
  };

  const colors = getPublicationColors();

  return (
    <div className={`w-full h-full ${colors.bg} flex flex-col relative overflow-hidden`}>
      {/* Header/Masthead */}
      <div className={`${colors.accent} ${colors.text} p-3 text-center`}>
        <div className="text-xs font-light tracking-wider mb-1">
          {date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
        <div className="font-bold text-lg leading-tight tracking-tight">
          {media_source?.name}
        </div>
        {media_source?.type && (
          <div className="text-xs mt-1 opacity-75">
            {media_source.type === 'newspaper' ? 'QUOTIDIEN' : 'MAGAZINE'}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-4 ${colors.text} flex flex-col justify-center`}>
        {topArticleTitle && (
          <div className="space-y-3">
            <div className="text-sm font-bold leading-tight line-clamp-4 border-l-4 border-current pl-3">
              {topArticleTitle}
            </div>
            {isNewspaper && (
              <div className="text-xs opacity-60 uppercase tracking-wide">
                Actualité du jour
              </div>
            )}
          </div>
        )}

        {!topArticleTitle && (
          <div className="text-center opacity-40">
            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`${colors.accent} ${colors.text} p-2 text-center text-xs`}>
        <div className="opacity-75">
          {media_source?.website_url?.replace('https://', '').replace('www.', '')}
        </div>
      </div>

      {/* Corner Badge */}
      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
        {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
      </div>
    </div>
  );
};

export default StyledPublicationCover;
