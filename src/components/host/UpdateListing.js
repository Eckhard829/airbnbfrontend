// components/host/UpdateListing.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const UpdateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    guests: '',
    images: [],
    specificRatings: { 
      cleanliness: 0, 
      communication: 0, 
      checkin: 0, 
      accuracy: 0, 
      location: 0, 
      value: 0 
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings/${id}`, config);
        
        const listing = res.data;
        
        // TEMPORARILY REMOVE OWNERSHIP CHECK - ALLOW ALL EDITS
        // const createdById = typeof listing.createdBy === 'object' 
        //   ? listing.createdBy._id || listing.createdBy.id
        //   : listing.createdBy;
          
        // if (createdById?.toString() !== user?.id?.toString()) {
        //   setError('You do not have permission to edit this listing.');
        //   return;
        // }

        // Pre-fill form with existing data
        setFormData({
          title: listing.title || '',
          description: listing.description || '',
          price: listing.price || '',
          location: listing.location || '',
          guests: listing.guests || '',
          images: listing.images || [],
          specificRatings: listing.specificRatings || { 
            cleanliness: 0, 
            communication: 0, 
            checkin: 0, 
            accuracy: 0, 
            location: 0, 
            value: 0 
          }
        });
      } catch (err) {
        setError('Failed to load listing: ' + (err.response?.data?.message || err.message));
      } finally {
        setInitialLoading(false);
      }
    };

    if (user && token && id) {
      fetchListing();
    } else {
      setInitialLoading(false);
      setError('Missing authentication or listing ID.');
    }
  }, [user, token, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name.includes('specificRatings.')) {
      const field = name.split('.')[1];
      setFormData({ 
        ...formData, 
        specificRatings: { 
          ...formData.specificRatings, 
          [field]: Number(value) || 0 
        } 
      });
    } else if (name === 'images') {
      const imageFiles = files ? Array.from(files) : [];
      if (imageFiles.length === 0) return;
      
      setLoading(true);
      Promise.all(imageFiles.map(file => {
        return new Promise((resolve, reject) => {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            reject(new Error(`File ${file.name} is too large. Maximum size is 5MB.`));
            return;
          }
          
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsDataURL(file);
        });
      })).then(base64Images => {
        setFormData({ 
          ...formData, 
          images: [...formData.images, ...base64Images] 
        });
        setError(null);
      }).catch(err => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      setLoading(false);
      return;
    }
    if (!formData.guests || Number(formData.guests) <= 0) {
      setError('Please enter a valid number of guests');
      setLoading(false);
      return;
    }

    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const listingData = {
        ...formData,
        status: 'pending' // Reset to pending when updated
      };

      await axios.put(`${process.env.REACT_APP_API_URL}/api/listings/${id}`, listingData, config);
      
      alert('Listing updated successfully! It will be reviewed by an admin before the changes are published.');
      navigate('/host/listings');
    } catch (err) {
      setError('Failed to update listing: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/host/listings');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        setLoading(true);
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/listings/${id}`, config);
        alert('Listing deleted successfully!');
        navigate('/host/listings');
      } catch (err) {
        setError('Failed to delete listing: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Loading listing...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-4">Error Loading Listing</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/host/listings')} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1280px' }}>
      <h1 className="text-4xl font-bold mb-8 text-center">Edit Listing</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Your listing changes will be submitted for admin review and approval before they become visible to guests.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Property Title *</label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Beautiful apartment in city center"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                required
                maxLength="100"
                disabled={loading}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Location *</label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property, amenities, and what makes it special..."
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                rows="6"
                required
                maxLength="500"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
            </div>

            {/* Price and Guests Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-lg">Price per Night ($) *</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-lg">Maximum Guests *</label>
                <input
                  name="guests"
                  type="number"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder="4"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                  required
                  min="1"
                  max="20"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Ratings */}
          <div className="space-y-6">
            
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Cleanliness Rating</label>
              <input
                name="specificRatings.cleanliness"
                type="number"
                step="0.1"
                value={formData.specificRatings.cleanliness}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Communication Rating</label>
              <input
                name="specificRatings.communication"
                type="number"
                step="0.1"
                value={formData.specificRatings.communication}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Check-in Experience Rating</label>
              <input
                name="specificRatings.checkin"
                type="number"
                step="0.1"
                value={formData.specificRatings.checkin}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Accuracy Rating</label>
              <input
                name="specificRatings.accuracy"
                type="number"
                step="0.1"
                value={formData.specificRatings.accuracy}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Location Rating</label>
              <input
                name="specificRatings.location"
                type="number"
                step="0.1"
                value={formData.specificRatings.location}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Value Rating</label>
              <input
                name="specificRatings.value"
                type="number"
                step="0.1"
                value={formData.specificRatings.value}
                onChange={handleChange}
                placeholder="0.0 - 5.0"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                min="0"
                max="5"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Full Width Image Section */}
        <div className="mt-8">
          <label className="block text-gray-700 font-semibold mb-4 text-lg">Property Images</label>
          <div className="w-full">
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB per image. You can select multiple images to add to existing ones.</p>
            
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`Property ${index + 1}`} 
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mt-12">
          <button 
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold text-lg min-w-[150px]"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-lg min-w-[150px]"
            disabled={loading}
          >
            Delete Listing
          </button>
          <button 
            type="submit" 
            className={`px-8 py-4 rounded-lg transition-colors duration-200 font-semibold text-lg min-w-[150px] ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            disabled={loading}
          >
            {loading ? 'Updating Listing...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateListing;