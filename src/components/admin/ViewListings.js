import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`);
        console.log('Listings response:', res.data);
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err.response?.data || err.message);
        setError('Failed to fetch listings');
      }
    };
    fetchListings();
  }, []);

  if (error) return <div className="container mx-auto px-4 py-8 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>
      <Link to="/admin/create-listing" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6 inline-block">Create New Listing</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <p className="text-gray-600">{listing.description}</p>
            <p className="mt-2">Price: ${listing.price}/night</p>
            <p>Location: {listing.location}</p>
            <p>Guests: {listing.guests}</p>
            <div className="mt-2">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <p className="mt-2">Ratings:</p>
            <ul className="list-disc pl-5">
              <li>Cleanliness: {listing.specificRatings.cleanliness || 0}</li>
              <li>Communication: {listing.specificRatings.communication || 0}</li>
              <li>Check-in: {listing.specificRatings.checkin || 0}</li>
              <li>Accuracy: {listing.specificRatings.accuracy || 0}</li>
              <li>Location: {listing.specificRatings.location || 0}</li>
              <li>Value: {listing.specificRatings.value || 0}</li>
            </ul>
            <Link to={`/admin/update-listing/${listing._id}`} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewListings;