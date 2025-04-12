import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaWineGlassAlt } from 'react-icons/fa';

interface WineFormData {
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
  imageUrl?: string;
}

const EditWinePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const userId = localStorage.getItem('userId');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WineFormData>({
    defaultValues: {
      ratings: {
        aroma: 0,
        taste: 0,
        balance: 0,
        finish: 0,
        value: 0
      }
    }
  });

  useEffect(() => {
    const fetchWine = async () => {
      try {
        if (!userId || !id) {
          return;
        }
        
        const response = await api.get(`/api/users/${userId}/wines/${id}`);
        
        // Format the date for the date input field
        let wineData = response.data;
        if (wineData.purchaseDate) {
          const date = new Date(wineData.purchaseDate);
          wineData.purchaseDate = date.toISOString().split('T')[0];
        }
        
        reset(wineData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wine details:', error);
        toast.error('Failed to load wine details');
        navigate('/wines');
      }
    };

    if (id) {
      fetchWine();
    }
  }, [id, reset, navigate, userId]);

  const onSubmit = async (data: WineFormData) => {
    if (!userId || !id) {
      toast.error('User or wine not found');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.put(`/api/users/${userId}/wines/${id}`, data);
      toast.success('Wine updated successfully!');
      navigate(`/wines/${id}`);
    } catch (error) {
      console.error('Error updating wine:', error);
      toast.error('Failed to update wine. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to={`/wines/${id}`} 
        className="text-wine-600 hover:text-wine-800 flex items-center mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Wine Details
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FaWineGlassAlt className="text-wine-600 h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold font-cormorant italic text-wine-800">Edit Wine</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold font-cormorant italic mb-4 text-gray-800">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Wine Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Wine name is required' })}
                  className="input-field"
                  placeholder="e.g. Château Margaux"
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="form-label">Type *</label>
                <select
                  {...register('type', { required: 'Wine type is required' })}
                  className="input-field"
                >
                  <option value="">Select Type</option>
                  <option value="Red">Red</option>
                  <option value="White">White</option>
                  <option value="Rosé">Rosé</option>
                  <option value="Sparkling">Sparkling</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Fortified">Fortified</option>
                  <option value="Orange">Orange</option>
                </select>
                {errors.type && <p className="error-message">{errors.type.message}</p>}
              </div>
              
              <div>
                <label className="form-label">Vintage *</label>
                <input
                  type="number"
                  {...register('vintage', { 
                    required: 'Vintage is required',
                    min: { value: 1900, message: 'Invalid vintage year' },
                    max: { value: new Date().getFullYear(), message: 'Cannot be in the future' }
                  })}
                  className="input-field"
                  placeholder="e.g. 2018"
                />
                {errors.vintage && <p className="error-message">{errors.vintage.message}</p>}
              </div>
              
              <div>
                <label className="form-label">Origin/Region *</label>
                <input
                  type="text"
                  {...register('origin', { required: 'Region is required' })}
                  className="input-field"
                  placeholder="e.g. Bordeaux, France"
                />
                {errors.origin && <p className="error-message">{errors.origin.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <h2 className="text-xl font-semibold font-cormorant italic mb-4 text-gray-800">
              Additional Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Winery</label>
                <input
                  type="text"
                  {...register('winery')}
                  className="input-field"
                  placeholder="e.g. Château Margaux"
                />
              </div>
              
              <div>
                <label className="form-label">Varietal</label>
                <input
                  type="text"
                  {...register('varietal')}
                  className="input-field"
                  placeholder="e.g. Cabernet Sauvignon"
                />
              </div>
              
              <div>
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { min: 0 })}
                  className="input-field"
                  placeholder="e.g. 29.99"
                />
              </div>
              
              <div>
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  {...register('purchaseDate')}
                  className="input-field"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="form-label">Purchase Location</label>
                <input
                  type="text"
                  {...register('purchaseLocation')}
                  className="input-field"
                  placeholder="e.g. Wine Shop, Online Store"
                />
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="form-label">Tasting Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your experience with this wine..."
            ></textarea>
          </div>
          
          {/* Ratings */}
          <div>
            <h2 className="text-xl font-semibold font-cormorant italic mb-4 text-gray-800">
              Ratings
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['aroma', 'taste', 'balance', 'finish', 'value'].map((category) => (
                <div key={category}>
                  <label className="form-label capitalize">{category}</label>
                  <select
                    {...register(`ratings.${category as keyof WineFormData['ratings']}` as any)}
                    className="input-field"
                  >
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating === 0 ? 'Not Rated' : `${rating} / 5`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image URL (optional) */}
          <div>
            <label className="form-label">Image URL (optional)</label>
            <input
              type="url"
              {...register('imageUrl')}
              className="input-field"
              placeholder="https://example.com/wine-image.jpg"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/wines/${id}`)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-6 py-3"
              >
                <FaSave className="mr-2" />
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWinePage;