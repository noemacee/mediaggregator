import { Link, useLocation } from 'react-router-dom';
import kiosqueLogo from '../../assets/kiosque-logo.png';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/" className="hover:opacity-80 transition-opacity flex items-center space-x-3">
              <img 
                src={kiosqueLogo} 
                alt="Le Kiosque" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Le Kiosque</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Votre kiosque de presse français
                </p>
              </div>
            </Link>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Kiosque
          </Link>
          <Link
            to="/articles"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/articles'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Articles
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
