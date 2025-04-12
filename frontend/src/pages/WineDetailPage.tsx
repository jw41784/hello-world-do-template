import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaGlassCheers, FaShareAlt } from 'react-icons/fa';

interface Wine {
  id: string;
  name: string;
  type: string;
  vintage: number;
  origin: string;
  winery?: string;
  varietal?: string;
  price?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
  ratings: {
    aroma: number;
    taste: number;
    balance: number;
    finish: number;
    value: number;
  };
  averageRating: number;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

const WineDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWine = async () => {
      try {
        if (!userId || !id) {
          return;
        }
        
        const response = await api.get(`/api/users/${userId}/wines/${id}`);
        setWine(response.data);
      } catch (error) {
        console.error('Error fetching wine details:', error);
        toast.error('Failed to load wine details');
        navigate('/wines');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWine();
    }
  }, [id, navigate, userId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this wine?')) return;
    
    try {
      if (!userId || !id) {
        return;
      }
      
      await api.delete(`/api/users/${userId}/wines/${id}`);
      toast.success('Wine deleted successfully');
      navigate('/wines');
    } catch (error) {
      console.error('Error deleting wine:', error);
      toast.error('Failed to delete wine');
    }
  };

  // Calculate the overall rating from individual ratings
  const calculateAverageRating = (ratings: Wine['ratings']) => {
    const values = Object.values(ratings).filter(val => val > 0);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-500"></div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Wine not found</h2>
        <Link to="/wines" className="btn-secondary mt-4 inline-block">
          <FaArrowLeft className="inline mr-2" /> Back to Collection
        </Link>
      </div>
    );
  }

  const averageRating = wine.averageRating || calculateAverageRating(wine.ratings);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/wines" className="text-wine-600 hover:text-wine-800 flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Back to Collection
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Header with wine image if available */}
        <div className="relative">
          {wine.imageUrl ? (
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img 
                src={wine.imageUrl} 
                alt={wine.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-wine-700 to-wine-900"></div>
          )}
          
          {/* Badge showing wine type */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-sm rounded-full font-medium bg-white/90 text-wine-700 shadow-sm">
              {wine.type}
            </span>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold font-cormorant italic text-wine-800 mb-2">{wine.name}</h1>
              <p className="text-lg text-gray-700">{wine.vintage} • {wine.origin}</p>
              {wine.winery && <p className="text-gray-600">{wine.winery}</p>}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 mt-2 md:mt-0">
              <button className="btn-secondary flex items-center gap-1">
                <FaShareAlt /> Share
              </button>
              <Link 
                to={`/wines/${wine.id}/edit`} 
                className="btn-secondary flex items-center gap-1"
              >
                <FaEdit /> Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="btn-danger flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wine Details */}
            <div>
              <h2 className="text-xl font-semibold font-cormorant italic mb-4 border-b border-gray-200 pb-2">Details</h2>
              <dl className="grid grid-cols-[120px_1fr] gap-y-3">
                {wine.varietal && (
                  <>
                    <dt className="text-gray-600">Varietal:</dt>
                    <dd>{wine.varietal}</dd>
                  </>
                )}
                
                {wine.price !== undefined && (
                  <>
                    <dt className="text-gray-600">Price:</dt>
                    <dd>${wine.price.toFixed(2)}</dd>
                  </>
                )}
                
                {wine.purchaseDate && (
                  <>
                    <dt className="text-gray-600">Purchased:</dt>
                    <dd>{new Date(wine.purchaseDate).toLocaleDateString()}</dd>
                  </>
                )}
                
                {wine.purchaseLocation && (
                  <>
                    <dt className="text-gray-600">Location:</dt>
                    <dd>{wine.purchaseLocation}</dd>
                  </>
                )}
                
                <dt className="text-gray-600">Added:</dt>
                <dd>{new Date(wine.createdAt).toLocaleDateString()}</dd>
              </dl>
              
              {wine.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line border-l-4 border-wine-100 pl-4 py-2 bg-gray-50 rounded">{wine.notes}</p>
                </div>
              )}

              {/* Tasting button */}
              <div className="mt-8">
                <button className="btn-primary w-full justify-center py-3">
                  <FaGlassCheers className="mr-2" /> Start Tasting Session
                </button>
              </div>
            </div>
            
            {/* Ratings */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold font-cormorant italic">
                  Ratings
                </h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-wine-700 mr-1">{averageRating.toFixed(1)}</span>
                  <span className="text-lg text-amber-500">★</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(wine.ratings).map(([category, rating]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize text-gray-700">{category}</span>
                      <span className="font-semibold">{rating || "N/A"}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-wine-500 rounded-full" 
                        style={{ width: `${((rating || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Star rating visualization */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Rating</h3>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div 
                      key={star} 
                      className={`text-3xl ${star <= Math.round(averageRating) ? 'text-amber-500' : 'text-gray-300'}`}
                    >
                      ★
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WineDetailPage;