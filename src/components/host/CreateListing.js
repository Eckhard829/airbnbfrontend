// components/host/CreateListing.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const CreateListing = () => {
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
  const { user, token } = useAuth();
  const navigate = useNavigate();

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
        createdBy: user.id,
        status: 'pending' // All host submissions start as pending
      };

      console.log('Creating listing with payload:', listingData);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/listings`, listingData, config);
      
      alert('Listing created successfully! It will be reviewed by an admin before being published.');
      navigate('/host/listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/host/listings');
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1280px' }}>
      <h1 className="text-4xl font-bold mb-8 text-center">Create New Listing</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Your listing will be submitted for admin review and approval before it becomes visible to guests.
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
            <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB per image. You can select multiple images.</p>
            
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
            type="submit" 
            className={`px-8 py-4 rounded-lg transition-colors duration-200 font-semibold text-lg min-w-[150px] ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            disabled={loading}
          >
            {loading ? 'Creating Listing...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;