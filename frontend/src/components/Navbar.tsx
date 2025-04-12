import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaWineGlassAlt, FaBars, FaTimes, FaUserCircle, FaWineBottle, FaUsers, FaPlus } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-wine-800/95 backdrop-blur-md shadow-lg' : 'bg-wine-900'} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <FaWineGlassAlt className="h-8 w-8 text-wine-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full"></div>
            </div>
            <span className="font-cormorant italic text-2xl font-bold">Wine<span className="text-wine-300">Rater</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`hover:text-wine-300 transition-colors ${location.pathname === '/' ? 'text-wine-300 font-medium' : ''}`}>Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/wines" 
                  className={`flex items-center gap-1.5 hover:text-wine-300 transition-colors ${location.pathname.startsWith('/wines') && !location.pathname.includes('/add') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaWineBottle className="h-4 w-4" />
                  <span>My Collection</span>
                </Link>
                <Link 
                  to="/wines/add" 
                  className={`flex items-center gap-1.5 hover:text-wine-300 transition-colors ${location.pathname.includes('/add') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Add Wine</span>
                </Link>
                <Link 
                  to="/sessions" 
                  className={`flex items-center gap-1.5 hover:text-wine-300 transition-colors ${location.pathname.startsWith('/sessions') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaUsers className="h-4 w-4" />
                  <span>Tastings</span>
                </Link>
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-1.5 hover:text-wine-300 transition-colors py-1 px-2 rounded-md bg-wine-700/60 hover:bg-wine-700">
                    <FaUserCircle className="h-5 w-5" />
                    <span className="font-medium">{user?.username || 'User'}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-wine-300 transition-colors">Sign In</Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
        >
          <div className="space-y-4 pb-4">
            <Link
              to="/"
              className={`block hover:text-wine-300 transition-colors py-2 ${location.pathname === '/' ? 'text-wine-300 font-medium' : ''}`}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/wines"
                  className={`flex items-center gap-2 hover:text-wine-300 transition-colors py-2 ${location.pathname.startsWith('/wines') && !location.pathname.includes('/add') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaWineBottle className="h-4 w-4" />
                  <span>My Collection</span>
                </Link>
                <Link
                  to="/wines/add"
                  className={`flex items-center gap-2 hover:text-wine-300 transition-colors py-2 ${location.pathname.includes('/add') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Add Wine</span>
                </Link>
                <Link
                  to="/sessions"
                  className={`flex items-center gap-2 hover:text-wine-300 transition-colors py-2 ${location.pathname.startsWith('/sessions') ? 'text-wine-300 font-medium' : ''}`}
                >
                  <FaUsers className="h-4 w-4" />
                  <span>Tastings</span>
                </Link>
                <div className="pt-4 mt-4 border-t border-wine-700">
                  <div className="flex items-center space-x-2 mb-3 bg-wine-700/30 p-3 rounded-md">
                    <FaUserCircle className="h-5 w-5 text-wine-300" />
                    <span className="font-medium">{user?.username || 'User'}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full py-2.5 px-3 text-white bg-wine-700/50 hover:bg-wine-700 rounded-md transition-colors flex justify-center"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-3">
                <Link
                  to="/login"
                  className="block text-center py-2.5 px-3 text-wine-300 border border-wine-300 rounded-md hover:bg-wine-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-center py-2.5 px-3 bg-wine-600 hover:bg-wine-700 text-white rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;