import { FaWineGlassAlt, FaGithub, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and tagline */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <FaWineGlassAlt className="h-6 w-6 text-wine-600 mr-2" />
              <span className="font-cormorant italic text-xl font-bold text-wine-800">
                Wine<span className="text-wine-600">Rater</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2 text-center md:text-left">
              Your personal wine tasting journey
            </p>
          </div>

          {/* Navigation links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mb-6 md:mb-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-wine-600 text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/wines" className="text-gray-600 hover:text-wine-600 text-sm">
                    My Collection
                  </Link>
                </li>
                <li>
                  <Link to="/sessions" className="text-gray-600 hover:text-wine-600 text-sm">
                    Tastings
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-wine-600 text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-wine-600 text-sm">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-wine-600 text-sm">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Connect</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-wine-600"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-wine-600"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center md:flex md:items-center md:justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} WineRater. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="/cache-clear.html" 
              className="text-xs text-gray-400 hover:text-wine-600 mr-4"
            >
              Clear Cache
            </a>
            <a 
              href="/language.html" 
              className="text-xs text-gray-400 hover:text-wine-600"
            >
              English
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;