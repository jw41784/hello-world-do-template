import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaWineBottle } from 'react-icons/fa';

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

const AddWinePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const userId = localStorage.getItem('userId');
  
  const { register, handleSubmit, formState: { errors } } = useForm<WineFormData>({
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

  const onSubmit = async (data: WineFormData) => {
    if (!userId) {
      toast.error('User not found');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await api.post(`/api/users/${userId}/wines`, data);
      toast.success('Wine added successfully!');
      navigate(`/wines/${response.data.id}`);
    } catch (error) {
      console.error('Error adding wine:', error);
      toast.error('Failed to add wine. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/wines" 
        className="text-wine-600 hover:text-wine-800 flex items-center mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Collection
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FaWineBottle className="text-wine-600 h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold font-cormorant italic text-wine-800">Add New Wine</h1>
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
                onClick={() => navigate('/wines')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-6 py-3"
              >
                {submitting ? 'Adding...' : 'Add Wine'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWinePage;