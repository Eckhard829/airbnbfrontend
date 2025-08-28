// components/host/HostReservations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';

const HostReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchHostReservations = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        // Fetch all reservations and filter for this host's listings
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reservations`, config);
        console.log('All reservations response:', res.data);
        
        // Filter reservations where the listing belongs to this host
        const hostReservations = res.data.filter(reservation => 
          reservation.listingId && 
          reservation.listingId.createdBy && 
          reservation.listingId.createdBy._id === user.id
        );
        
        setReservations(hostReservations);
      } catch (err) {
        console.error('Error fetching host reservations:', err.response?.data || err.message);
        setError('Failed to fetch reservations for your listings');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchHostReservations();
    }
  }, [user, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reservations for Your Properties</h1>
      
      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reservations found for your listings.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="border rounded-lg p-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {reservation.listingId?.title || 'Unknown Property'}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    📍 {reservation.listingId?.location || 'Unknown Location'}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Guest:</strong> {reservation.createdBy?.name || reservation.createdBy?.email || 'Unknown Guest'}</p>
                    <p><strong>Contact:</strong> {reservation.createdBy?.email || 'No email provided'}</p>
                    <p><strong>Guests:</strong> {reservation.guests} people</p>
                    <p><strong>Nights:</strong> {calculateNights(reservation.checkIn, reservation.checkOut)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Check-in:</strong> {formatDate(reservation.checkIn)}</p>
                    <p><strong>Check-out:</strong> {formatDate(reservation.checkOut)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p><strong>Total Cost:</strong> ${reservation.totalCost || 'N/A'}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Booked on: {new Date(reservation.createdAt).toLocaleDateString()}</p>
                    <p>Reservation ID: {reservation._id}</p>
                  </div>
                </div>
              </div>
              
              {reservation.listingId?.images && reservation.listingId.images.length > 0 && (
                <div className="mt-4">
                  <img
                    src={reservation.listingId.images[0]}
                    alt={reservation.listingId.title}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Property+Image'; }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {reservations.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Total reservations: {reservations.length}
        </div>
      )}
    </div>
  );
};

export default HostReservations;