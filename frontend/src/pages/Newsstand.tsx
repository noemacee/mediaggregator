import { useState } from 'react';
import Header from '../components/common/Header';
import FilterBar from '../components/newsstand/FilterBar';
import NewsstandGrid from '../components/newsstand/NewsstandGrid';
import { usePublications } from '../hooks/usePublications';
import { MediaType, Publication } from '../types';

const Newsstand = () => {
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');

  const { publications, loading, error, refetch } = usePublications({
    type: selectedType === 'all' ? undefined : selectedType,
    latest_only: true
  });

  const handlePublicationClick = (publication: Publication) => {
    // Open publication source URL in new tab
    if (publication.source_url || publication.media_source?.website_url) {
      window.open(
        publication.source_url || publication.media_source?.website_url,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar selectedType={selectedType} onTypeChange={setSelectedType} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedType === 'all' && 'Toutes les publications'}
            {selectedType === 'newspaper' && 'Quotidiens'}
            {selectedType === 'magazine' && 'Magazines'}
          </h2>
          <p className="text-gray-600 mt-1">
            {publications.length} publication{publications.length > 1 ? 's' : ''} disponible{publications.length > 1 ? 's' : ''}
          </p>
        </div>

        <NewsstandGrid
          publications={publications}
          loading={loading}
          error={error}
          onRetry={refetch}
          onPublicationClick={handlePublicationClick}
        />
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

export default Newsstand;
