import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useMediaSources } from '../hooks/useMediaSources';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyMedia = () => {
  const { mediaSources, loading } = useMediaSources();
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    const followed = JSON.parse(localStorage.getItem('followedMedia') || '[]');
    if (followed.length === 0) {
      // By default, follow all media
      setFollowedIds(mediaSources.map((s) => s.id));
    } else {
      setFollowedIds(followed);
    }
  }, [mediaSources]);

  const toggleFollow = (sourceId: string) => {
    const newFollowed = followedIds.includes(sourceId)
      ? followedIds.filter((id) => id !== sourceId)
      : [...followedIds, sourceId];

    setFollowedIds(newFollowed);
    localStorage.setItem('followedMedia', JSON.stringify(newFollowed));
  };

  const newspapers = mediaSources.filter((s) => s.type === 'newspaper');
  const magazines = mediaSources.filter((s) => s.type === 'magazine');

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes médias</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos sources d'information préférées
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Newspapers Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quotidiens ({newspapers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newspapers.map((source) => {
                  const isFollowed = followedIds.includes(source.id);
                  return (
                    <div
                      key={source.id}
                      className={`p-6 bg-white rounded-lg border-2 transition-all cursor-pointer ${
                        isFollowed
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleFollow(source.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {source.logo_url && (
                            <img
                              src={source.logo_url}
                              alt={source.name}
                              className="h-8 w-8 object-contain"
                            />
                          )}
                          <h3 className="font-semibold text-lg text-gray-900">
                            {source.name}
                          </h3>
                        </div>
                        <button
                          className={`p-2 rounded-full ${
                            isFollowed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isFollowed ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {source.description && (
                        <p className="text-sm text-gray-600">{source.description}</p>
                      )}
                      {source.political_leaning && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {source.political_leaning}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Magazines Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Magazines ({magazines.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {magazines.map((source) => {
                  const isFollowed = followedIds.includes(source.id);
                  return (
                    <div
                      key={source.id}
                      className={`p-6 bg-white rounded-lg border-2 transition-all cursor-pointer ${
                        isFollowed
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleFollow(source.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {source.logo_url && (
                            <img
                              src={source.logo_url}
                              alt={source.name}
                              className="h-8 w-8 object-contain"
                            />
                          )}
                          <h3 className="font-semibold text-lg text-gray-900">
                            {source.name}
                          </h3>
                        </div>
                        <button
                          className={`p-2 rounded-full ${
                            isFollowed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isFollowed ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {source.description && (
                        <p className="text-sm text-gray-600">{source.description}</p>
                      )}
                      {source.political_leaning && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {source.political_leaning}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Summary */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>{followedIds.length}</strong> média{followedIds.length > 1 ? 's' : ''} suivi{followedIds.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                (Fonctionnalité de filtrage à venir)
              </p>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyMedia;
