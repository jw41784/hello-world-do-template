import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaPlus, FaWineGlassAlt, FaSearch, FaFilter } from 'react-icons/fa';

interface Wine {
  id: string;
  name: string;
  type: string;
  vintage: number;
  origin: string;
  averageRating: number;
  createdAt: number;
}

const WineListPage = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWines = async () => {
      try {
        if (!userId) {
          return;
        }
        
        const response = await api.get(`/api/users/${userId}/wines`);
        setWines(response.data);
      } catch (error) {
        console.error('Error fetching wines:', error);
        toast.error('Failed to load your wine collection');
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [userId]);

  // Filter wines based on search term and type filter
  const filteredWines = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         wine.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || wine.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Get unique wine types for the filter dropdown
  const wineTypes = ['all', ...Array.from(new Set(wines.map(wine => wine.type)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-cormorant italic text-wine-800 mb-2">My Wine Collection</h1>
          <p className="text-gray-600">{wines.length} wines in your collection</p>
        </div>
        <Link 
          to="/wines/add" 
          className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <FaPlus /> Add Wine
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search wines by name or region..."
              className="pl-10 w-full border-gray-300 rounded-md focus:ring-wine-500 focus:border-wine-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 w-full border-gray-300 rounded-md focus:ring-wine-500 focus:border-wine-500 capitalize"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {wineTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {wines.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaWineGlassAlt className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your collection is empty</h2>
          <p className="text-gray-600 mb-6">Start building your wine collection by adding your first wine.</p>
          <Link to="/wines/add" className="btn-primary">Add Your First Wine</Link>
        </div>
      ) : filteredWines.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No wines match your search</h2>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWines.map((wine) => (
            <Link 
              key={wine.id} 
              to={`/wines/${wine.id}`}
              className="card hover:border-wine-300"
            >
              <div className="flex justify-between">
                <div className="px-2 py-1 text-xs rounded-full uppercase font-medium bg-gray-100 text-gray-800 mb-2">
                  {wine.type}
                </div>
                <div className="flex items-center">
                  <div className="text-amber-500 mr-1">★</div>
                  <span className="text-gray-700 font-medium">{wine.averageRating?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold font-cormorant italic text-wine-800 mb-1">{wine.name}</h2>
              <div className="text-gray-600 mb-4">
                <p>{wine.vintage} • {wine.origin}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Added {new Date(wine.createdAt).toLocaleDateString()}
                </div>
                <div className="text-wine-600 text-sm font-medium">View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WineListPage;