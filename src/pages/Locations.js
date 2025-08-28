// pages/Locations.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Locations = () => {
  const [listings, setListings] = useState([]);
  const [sortOption, setSortOption] = useState('price-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchApprovedListings = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const query = {
          location: params.get('location') || '',
          checkIn: params.get('checkIn') || '',
          checkOut: params.get('checkOut') || '',
          guests: params.get('guests') || '',
          status: 'approved' // Only fetch approved listings
        };
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, { params: query });
        console.log('Approved listings response:', res.data);
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err.response?.data || err.message);
        setError('Failed to load listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedListings();
  }, [location.search]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    let sortedListings = [...listings];
    
    switch (e.target.value) {
      case 'price-asc':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sortedListings.sort((a, b) => {
          const avgA = calculateAverageRating(a.specificRatings);
          const avgB = calculateAverageRating(b.specificRatings);
          return avgB - avgA;
        });
        break;
      case 'guests-desc':
        sortedListings.sort((a, b) => b.guests - a.guests);
        break;
      default:
        break;
    }
    setListings(sortedListings);
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings) return 0;
    const values = Object.values(ratings).filter(rating => rating > 0);
    if (values.length === 0) return 0;
    return values.reduce((sum, rating) => sum + rating, 0) / values.length;
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i - 0.5 <= roundedRating) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Approved Listings</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">{listings.length} properties available</p>
        <div>
          <label htmlFor="sort" className="mr-2 text-sm font-medium">Sort by:</label>
          <select 
            id="sort" 
            value={sortOption} 
            onChange={handleSortChange} 
            className="p-2 border rounded-md bg-white"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="guests-desc">Guests: Most to Least</option>
          </select>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold mb-2">No listings found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later for new listings.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
          >
            Back to Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const averageRating = calculateAverageRating(listing.specificRatings);
            return (
              <div key={listing._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'; }}
                  />
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      +{listing.images.length - 1} more
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-1">{listing.title}</h2>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <span className="mr-1">📍</span>
                    {listing.location}
                  </p>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <span className="mr-1">👥</span>
                    Up to {listing.guests} guests
                  </p>
                  
                  {averageRating > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(averageRating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-red-500">
                        ${listing.price}
                        <span className="text-sm font-normal text-gray-600">/night</span>
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/locations/${listing._id}`)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Locations;