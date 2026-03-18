import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Participants', path: '/find-support' },
    { name: 'Provide Support', path: '/provide-support' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/subscription' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center py-2">
            <img 
              src="/uploads/logo.jpg" 
              alt="The Better Together - Reimagining Disabilities"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>
            
            {/* Auth Links */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/subscription"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <Link
              to="/login"
              className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/subscription"
              className="block px-3 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-xl font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;