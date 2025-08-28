// components/admin/AdminManageListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';

const AdminManageListings = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        // Use the standard listings endpoint
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, config);
        console.log('Admin listings response:', res.data);
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err.response?.data || err.message);
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllListings();
    }
  }, [token]);

  const handleApprove = async (listingId) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Find the current listing data
      const currentListing = listings.find(listing => listing._id === listingId);
      if (!currentListing) {
        alert('Listing not found');
        return;
      }

      // Send complete listing data with updated status
      const updateData = {
        title: currentListing.title,
        description: currentListing.description,
        price: currentListing.price,
        location: currentListing.location,
        guests: currentListing.guests,
        images: currentListing.images || [],
        specificRatings: currentListing.specificRatings || {
          cleanliness: 0,
          communication: 0,
          checkin: 0,
          accuracy: 0,
          location: 0,
          value: 0
        },
        status: 'approved',
        createdBy: currentListing.createdBy,
        // Remove rejection reason when approving
        rejectionReason: undefined
      };

      console.log('Approving listing with data:', updateData);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/listings/${listingId}`,
        updateData,
        config
      );
      
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, status: 'approved', rejectionReason: undefined }
          : listing
      ));
      
      alert('Listing approved successfully!');
    } catch (err) {
      console.error('Error approving listing:', err);
      alert('Failed to approve listing: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (listingId) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Find the current listing data
      const currentListing = listings.find(listing => listing._id === listingId);
      if (!currentListing) {
        alert('Listing not found');
        return;
      }

      // Send complete listing data with updated status and rejection reason
      const updateData = {
        title: currentListing.title,
        description: currentListing.description,
        price: currentListing.price,
        location: currentListing.location,
        guests: currentListing.guests,
        images: currentListing.images || [],
        specificRatings: currentListing.specificRatings || {
          cleanliness: 0,
          communication: 0,
          checkin: 0,
          accuracy: 0,
          location: 0,
          value: 0
        },
        status: 'rejected',
        rejectionReason: reason,
        createdBy: currentListing.createdBy
      };

      console.log('Rejecting listing with data:', updateData);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/listings/${listingId}`,
        updateData,
        config
      );
      
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, status: 'rejected', rejectionReason: reason }
          : listing
      ));
      
      alert('Listing rejected successfully!');
    } catch (err) {
      console.error('Error rejecting listing:', err);
      alert('Failed to reject listing: ' + (err.response?.data?.message || err.message));
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

  const getFilteredListings = () => {
    if (filter === 'all') return listings;
    return listings.filter(listing => (listing.status || 'pending') === filter);
  };

  const filteredListings = getFilteredListings();

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage All Listings</h1>
      
      {/* Filter buttons */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All ({listings.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          Pending ({listings.filter(l => (l.status || 'pending') === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Approved ({listings.filter(l => l.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
        >
          Rejected ({listings.filter(l => l.status === 'rejected').length})
        </button>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No listings found for the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(listing.status)}`}>
                  {listing.status || 'Pending'}
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
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-2 text-sm">{listing.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><strong>Price:</strong> ${listing.price}/night</p>
                  <p><strong>Location:</strong> {listing.location}</p>
                  <p><strong>Guests:</strong> {listing.guests}</p>
                </div>
                <div>
                  <p><strong>Host:</strong> {listing.createdBy?.name || listing.createdBy?.email || 'Unknown'}</p>
                  <p><strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {listing.specificRatings && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Ratings:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>Cleanliness: {listing.specificRatings.cleanliness || 'N/A'}</div>
                    <div>Communication: {listing.specificRatings.communication || 'N/A'}</div>
                    <div>Check-in: {listing.specificRatings.checkin || 'N/A'}</div>
                    <div>Accuracy: {listing.specificRatings.accuracy || 'N/A'}</div>
                    <div>Location: {listing.specificRatings.location || 'N/A'}</div>
                    <div>Value: {listing.specificRatings.value || 'N/A'}</div>
                  </div>
                </div>
              )}

              {listing.status === 'rejected' && listing.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm"><strong>Rejection Reason:</strong> {listing.rejectionReason}</p>
                </div>
              )}

              {(listing.status || 'pending') === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(listing._id)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(listing._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}

              {listing.status === 'approved' && (
                <div className="text-center">
                  <button
                    onClick={() => handleReject(listing._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Revoke Approval
                  </button>
                </div>
              )}

              {listing.status === 'rejected' && (
                <div className="text-center">
                  <button
                    onClick={() => handleApprove(listing._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve Listing
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageListings;