import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const ReservationCard = ({ reservation }) => {
  // Sample data structure based on your existing code
  const sampleReservation = {
    _id: '68af915949f11f6ed454640',
    listingId: {
      title: 'Backup-Powered Balcony Apartment',
      location: 'Bordeaux',
      guests: 6,
      price: 325,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
      specificRatings: {
        cleanliness: 5.0,
        communication: 5.0,
        checkin: 5.0,
        accuracy: 5.0,
        location: 5.0,
        value: 5.0
      }
    },
    checkIn: '2025-08-28T00:00:00Z',
    checkOut: '2025-09-07T00:00:00Z',
    guests: 2,
    totalCost: 2460,
    createdBy: {
      email: 'user@gmail.com'
    },
    createdAt: '2025-08-28T01:13:25Z'
  };

  // Use sample data for demonstration, fallback to prop data
  const data = reservation || sampleReservation;
  
  // Calculate average rating from specificRatings
  const calculateAverageRating = (ratings) => {
    if (!ratings) return 0;
    
    const ratingsArray = Object.values(ratings);
    const validRatings = ratingsArray.filter(rating => rating > 0);
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return (sum / validRatings.length).toFixed(1);
  };

  // Get review count (placeholder - replace with actual review count)
  const getReviewCount = (ratings) => {
    if (!ratings) return 0;
    const validRatings = Object.values(ratings).filter(rating => rating > 0);
    return validRatings.length > 0 ? 318 : 0; // Using 318 as shown in the design
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const averageRating = calculateAverageRating(data.listingId?.specificRatings);
  const reviewCount = getReviewCount(data.listingId?.specificRatings);
  const nights = calculateNights(data.checkIn, data.checkOut);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-2xl mx-auto">
      {/* Content Section - Centered */}
      <div className="p-8">
        {/* Header Section - Centered */}
        <div className="text-center mb-6">
          {/* Location and Title */}
          <p className="text-sm text-gray-600 mb-2">
            Entire home in {data.listingId?.location || 'Unknown Location'}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {data.listingId?.title || 'Property Title'}
          </h3>

          {/* Property Details */}
          <div className="text-gray-600 text-sm mb-2">
            <div className="flex items-center justify-center flex-wrap">
              <span className="mr-2">{data.listingId?.guests || 'N/A'} guests</span>
              <span className="text-gray-400 mr-2">•</span>
              <span className="mr-2">Entire Home</span>
              <span className="text-gray-400 mr-2">•</span>
              <span className="mr-2">{data.listingId?.guests > 4 ? Math.ceil(data.listingId.guests / 2) : 2} beds</span>
              <span className="text-gray-400 mr-2">•</span>
              <span>{data.listingId?.guests > 4 ? 2 : 1} bath</span>
            </div>
            
            {/* Amenities */}
            <div className="mt-2 flex items-center justify-center flex-wrap text-gray-600">
              <span>WiFi</span>
              <span className="text-gray-400 mx-2">•</span>
              <span>Kitchen</span>
              <span className="text-gray-400 mx-2">•</span>
              <span>Free Parking</span>
            </div>
          </div>
        </div>

        {/* Reservation Details - Centered */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-6 text-sm max-w-md mx-auto">
            <div className="text-center">
              <p className="text-gray-600 mb-1">Check-in:</p>
              <p className="font-medium">{formatDate(data.checkIn)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-1">Check-out:</p>
              <p className="font-medium">{formatDate(data.checkOut)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-1">Guests:</p>
              <p className="font-medium">{data.guests} people</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-1">Nights:</p>
              <p className="font-medium">{nights} nights</p>
            </div>
          </div>
        </div>

        {/* Rating - Centered */}
        <div className="flex justify-center mb-4">
          {averageRating > 0 ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-black mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-black font-medium mr-1">{averageRating}</span>
              <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">No reviews yet</span>
          )}
        </div>

        {/* Price - Centered */}
        <div className="text-center mb-6">
          <span className="text-3xl font-semibold text-gray-900">
            ${data.listingId?.price || 'N/A'}
          </span>
          <span className="text-gray-600 text-lg ml-1">/night</span>
        </div>

        {/* Reservation Info - Centered */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600 max-w-md mx-auto">
            <span>Reservation ID: {data._id.substring(0, 8)}...</span>
            <span className="font-semibold text-xl text-green-600">
              Total: ${data.totalCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Reservations component that fetches actual data
const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reservations`, config);
        console.log('Reservations response:', res.data);
        
        // Filter reservations for current user
        const userReservations = res.data.filter(reservation => 
          reservation.createdBy && reservation.createdBy._id === user?.id
        );
        
        setReservations(userReservations);
      } catch (err) {
        console.error('Error fetching reservations:', err.response?.data || err.message);
        setError('Failed to fetch your reservations');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchReservations();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
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
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Reservations</h1>
      
      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold mb-2">No reservations yet</h2>
          <p className="text-gray-600 mb-4">Start planning your next adventure by booking a stay.</p>
          <button 
            onClick={() => window.location.href = '/locations'} 
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
          >
            Explore Listings
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="flex justify-center">
              <ReservationCard reservation={reservation} />
            </div>
          ))}
        </div>
      )}
      
      {reservations.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Total reservations: {reservations.length}
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
              Manage Reservations
            </button>
            <button 
              onClick={() => window.location.href = '/locations'} 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Book Another Stay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;