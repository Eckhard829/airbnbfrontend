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
        // Fetch all listings and filter on frontend for this host
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, config);
        console.log('All listings response:', res.data);
        
        // Filter listings created by this host
        const hostListings = res.data.filter(listing => {
          // Check if listing has createdBy field and it matches current user
          if (listing.createdBy) {
            // Handle both object reference and string ID
            const createdById = typeof listing.createdBy === 'object' 
              ? listing.createdBy._id || listing.createdBy.id
              : listing.createdBy;
            return createdById === user.id;
          }
          return false;
        });
        
        setListings(hostListings);
      } catch (err) {
        console.error('Error fetching host listings:', err.response?.data || err.message);
        setError('Failed to fetch your listings');
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
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <Link
          to="/host/create-listing"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Create New Listing
        </Link>
      </div>
      
      {listings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold mb-2">No listings yet</h2>
          <p className="text-gray-600 mb-4">Create your first listing to start hosting guests.</p>
          <Link
            to="/host/create-listing"
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
          >
            Create Your First Listing
          </Link>
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

              {listing.status === 'rejected' && listing.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {listing.rejectionReason}
                  </p>
                </div>
              )}

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
          Total listings: {listings.length} | 
          Approved: {listings.filter(l => l.status === 'approved').length} | 
          Pending: {listings.filter(l => (l.status || 'pending') === 'pending').length} |
          Rejected: {listings.filter(l => l.status === 'rejected').length}
        </div>
      )}
    </div>
  );
};

export default HostManageListings;