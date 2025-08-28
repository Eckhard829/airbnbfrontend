// components/admin/CreateListing.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    guests: '',
    images: [],
    specificRatings: { cleanliness: 0, communication: 0, checkin: 0, accuracy: 0, location: 0, value: 0 }
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.includes('specificRatings.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, specificRatings: { ...formData.specificRatings, [field]: Number(value) || 0 } });
    } else if (name === 'images') {
      const imageFiles = files ? Array.from(files) : [];
      Promise.all(imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })).then(base64Images => {
        setFormData({ ...formData, images: [...formData.images, ...base64Images] });
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating listing with payload:', formData);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/listings`, formData);
      alert('Listing created!');
      navigate('/admin/listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('Failed to create listing: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Listing</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Price per Night</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Location</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Guests</label>
          <input
            name="guests"
            type="number"
            value={formData.guests}
            onChange={handleChange}
            placeholder="Guests"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Listing Images</label>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formData.images.length > 0 && (
            <div className="mt-2">
              {formData.images.map((img, index) => (
                <img key={index} src={img} alt={`Listing ${index}`} className="w-24 h-24 object-cover rounded mr-2" />
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Cleanliness Rating</label>
          <input
            name="specificRatings.cleanliness"
            type="number"
            step="0.1"
            value={formData.specificRatings.cleanliness}
            onChange={handleChange}
            placeholder="Cleanliness (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Communication Rating</label>
          <input
            name="specificRatings.communication"
            type="number"
            step="0.1"
            value={formData.specificRatings.communication}
            onChange={handleChange}
            placeholder="Communication (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Check-in Rating</label>
          <input
            name="specificRatings.checkin"
            type="number"
            step="0.1"
            value={formData.specificRatings.checkin}
            onChange={handleChange}
            placeholder="Check-in (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Accuracy Rating</label>
          <input
            name="specificRatings.accuracy"
            type="number"
            step="0.1"
            value={formData.specificRatings.accuracy}
            onChange={handleChange}
            placeholder="Accuracy (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Location Rating</label>
          <input
            name="specificRatings.location"
            type="number"
            step="0.1"
            value={formData.specificRatings.location}
            onChange={handleChange}
            placeholder="Location (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Value Rating</label>
          <input
            name="specificRatings.value"
            type="number"
            step="0.1"
            value={formData.specificRatings.value}
            onChange={handleChange}
            placeholder="Value (0-5)"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;