// components/host/HostManageListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const HostManageListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchHostListings = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        // Fetch all listings and filter by host on frontend
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, config);
        
        // Filter to only show APPROVED listings created by this host
        const hostListings = res.data.filter(listing => 
          listing.createdBy && 
          listing.createdBy._id === user.id &&
          listing.status === 'approved'  // Only show approved listings
        );
        
        console.log('Host approved listings response:', hostListings);
        setListings(hostListings);
      } catch (err) {
        console.error('Error fetching host listings:', err.response?.data || err.message);
        setError('Failed to fetch your approved listings');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchHostListings();
    }
  }, [user, token]);

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/listings/${listingId}`, config);
        setListings(listings.filter(listing => listing._id !== listingId));
        alert('Listing deleted successfully!');
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Failed to delete listing: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Published';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      default:
        return 'Under Review';
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Published Listings</h1>
        <Link
          to="/host/create-listing"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Create New Listing
        </Link>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This page shows only your approved and published listings. 
          To see all your listings (including pending and rejected), visit the "All My Listings" section.
        </p>
      </div>
      
      {listings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold mb-2">No published listings yet</h2>
          <p className="text-gray-600 mb-4">Your listings will appear here once they are approved by our admin team.</p>
          <div className="space-y-2">
            <Link
              to="/host/create-listing"
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 inline-block"
            >
              Create Your First Listing
            </Link>
            <br />
            <Link
              to="/host/all-listings"
              className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 inline-block"
            >
              View All My Listings
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(listing.status)}`}>
                  {getStatusText(listing.status)}
                </span>
                <span className="text-xs text-gray-500">
                  ID: {listing._id}
                </span>
              </div>

              <div className="mb-4">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-2 text-sm line-clamp-2">{listing.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><strong>Price:</strong> ${listing.price}/night</p>
                  <p><strong>Location:</strong> {listing.location}</p>
                </div>
                <div>
                  <p><strong>Max Guests:</strong> {listing.guests}</p>
                  <p><strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/host/update-listing/${listing._id}`}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {listings.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Total published listings: {listings.length}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link
          to="/host/all-listings"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View all my listings (including pending and rejected)
        </Link>
      </div>
    </div>
  );
};

export default HostManageListings;