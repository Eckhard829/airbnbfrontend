// components/host/HostManageListings.js - Enhanced Debug Version
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const HostManageListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchHostListings = async () => {
      console.log('=== FETCH STARTED ===');
      console.log('User:', user);
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('API URL:', process.env.REACT_APP_API_URL);

      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        console.log('Request config:', config);

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, config);
        
        console.log('=== API RESPONSE ===');
        console.log('Status:', res.status);
        console.log('Response data type:', typeof res.data);
        console.log('Response data length:', res.data?.length);
        console.log('Full response:', res.data);

        setDebugInfo({
          apiResponse: res.data,
          userInfo: user,
          tokenExists: !!token,
          responseLength: res.data?.length || 0
        });

        if (!res.data || !Array.isArray(res.data)) {
          console.error('Invalid response format:', res.data);
          setError('Invalid response format from server');
          return;
        }

        if (res.data.length === 0) {
          console.log('No listings returned from API');
          setListings([]);
          return;
        }

        // Debug each listing
        res.data.forEach((listing, index) => {
          console.log(`=== LISTING ${index} ===`);
          console.log('Full listing object:', listing);
          console.log('Listing ID:', listing._id);
          console.log('Title:', listing.title);
          console.log('CreatedBy raw:', listing.createdBy);
          console.log('CreatedBy type:', typeof listing.createdBy);
          console.log('Status:', listing.status);
          
          if (listing.createdBy) {
            const createdById = typeof listing.createdBy === 'object' 
              ? listing.createdBy._id || listing.createdBy.id
              : listing.createdBy;
            console.log('Extracted createdById:', createdById);
            console.log('Current user ID:', user?.id);
            console.log('Match?', createdById === user?.id);
            console.log('Strict match?', createdById.toString() === user?.id?.toString());
          }
        });

        // TEMPORARY: Show ALL listings to see if anything comes through
        console.log('=== SETTING ALL LISTINGS (TEMPORARY) ===');
        setListings(res.data);

        // Original filtering logic (commented out for debugging)
        /*
        const hostListings = res.data.filter(listing => {
          if (!listing.createdBy || !user?.id) {
            console.log('Filtering out: missing createdBy or user.id');
            return false;
          }
          
          const createdById = typeof listing.createdBy === 'object' 
            ? listing.createdBy._id || listing.createdBy.id
            : listing.createdBy;
          
          const match = createdById?.toString() === user.id?.toString();
          console.log(`Listing ${listing.title}: ${createdById} vs ${user.id} = ${match}`);
          return match;
        });
        
        console.log('Filtered host listings:', hostListings.length);
        setListings(hostListings);
        */
        
      } catch (err) {
        console.error('=== ERROR DETAILS ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response);
        console.error('Error response data:', err.response?.data);
        console.error('Error response status:', err.response?.status);
        console.error('Error response headers:', err.response?.headers);
        
        setError(`Failed to fetch listings: ${err.response?.data?.message || err.message}`);
        setDebugInfo({
          error: {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
          }
        });
      } finally {
        setLoading(false);
        console.log('=== FETCH COMPLETED ===');
      }
    };

    if (user && token) {
      fetchHostListings();
    } else {
      console.log('Skipping fetch - missing user or token');
      console.log('User exists:', !!user);
      console.log('Token exists:', !!token);
      setLoading(false);
      setError('Missing authentication. Please log in.');
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

  const isOwnListing = (listing) => {
    if (!listing.createdBy || !user?.id) return false;
    
    const createdById = typeof listing.createdBy === 'object' 
      ? listing.createdBy._id || listing.createdBy.id
      : listing.createdBy;
    
    return createdById?.toString() === user.id?.toString();
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="text-lg mb-4">Loading your listings...</div>
        <div className="text-sm text-gray-600">
          User: {user?.email || 'Not logged in'}<br/>
          Token: {token ? 'Present' : 'Missing'}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-red-500">
        <h2 className="text-xl font-bold mb-4">Error Loading Listings</h2>
        <p className="mb-4">{error}</p>
        {debugInfo && (
          <div className="text-left bg-gray-100 p-4 rounded max-w-2xl mx-auto">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug Panel */}
      {debugInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug Info (Remove in production)</h3>
          <div className="text-sm">
            <p><strong>API Response Length:</strong> {debugInfo.responseLength}</p>
            <p><strong>Current User ID:</strong> {debugInfo.userInfo?.id}</p>
            <p><strong>Token Present:</strong> {debugInfo.tokenExists ? 'Yes' : 'No'}</p>
            <p><strong>Showing:</strong> ALL listings (filtering temporarily disabled)</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Listings</h1>
          <p className="text-gray-600 mt-1">
            Showing {listings.length} listing{listings.length !== 1 ? 's' : ''}
            {debugInfo && ` (Total from API: ${debugInfo.responseLength})`}
          </p>
        </div>
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
          <h2 className="text-2xl font-semibold mb-2">No listings found</h2>
          <p className="text-gray-600 mb-4">
            {user ? (
              debugInfo?.responseLength > 0 
                ? 'API returned data but no listings match your user ID. Check the debug info above.'
                : 'The API returned no listings. This could be normal if no listings exist yet.'
            ) : (
              'Please log in to view your listings.'
            )}
          </p>
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
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(listing.status)}`}>
                    {getStatusText(listing.status)}
                  </span>
                  {!isOwnListing(listing) && (
                    <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                      Other Host
                    </span>
                  )}
                </div>
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

              <div className="mb-4 text-sm">
                <p><strong>Host:</strong> {
                  typeof listing.createdBy === 'object' 
                    ? (listing.createdBy.name || listing.createdBy.email || 'Unknown Host')
                    : listing.createdBy || 'Unknown Host'
                }</p>
              </div>

              {listing.status === 'rejected' && listing.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {listing.rejectionReason}
                  </p>
                </div>
              )}

              {/* Only show edit/delete buttons for own listings */}
              {isOwnListing(listing) && (
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
              )}
              
              {/* Show view details for other host listings */}
              {!isOwnListing(listing) && (
                <div className="text-center">
                  <Link
                    to={`/locations/${listing._id}`}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {listings.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Total listings: {listings.length}</p>
          <div className="flex justify-center gap-4 mt-2">
            <span>Your listings: {listings.filter(l => isOwnListing(l)).length}</span>
            <span>Approved: {listings.filter(l => l.status === 'approved').length}</span>
            <span>Pending: {listings.filter(l => (l.status || 'pending') === 'pending').length}</span>
            <span>Rejected: {listings.filter(l => l.status === 'rejected').length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostManageListings;