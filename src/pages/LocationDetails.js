import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const LocationDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings/${id}`);
        console.log('Listing response:', res.data);
        setListing(res.data);
      } catch (err) {
        console.error('Error fetching listing:', err.response?.data || err.message);
        setError('Listing not found');
      }
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing && checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        setError('Check-out date must be after check-in date');
        setTotalCost(0);
        return;
      }
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      if (guests > listing.guests) {
        setError(`Maximum guests exceeded. Limit is ${listing.guests}`);
        setTotalCost(0);
        return;
      }
      const cost = nights * listing.price * guests;
      setTotalCost(cost);
      setError(null);
    }
  }, [checkIn, checkOut, guests, listing]);

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || !totalCost || guests < 1) {
      setError('Please fill all fields correctly');
      return;
    }
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored here
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      console.log('Creating reservation with payload:', { listingId: id, checkIn, checkOut, guests, totalCost, createdBy: user.id });
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reservations`,
        { listingId: id, checkIn, checkOut, guests, totalCost, createdBy: user.id },
        config
      );
      console.log('Reservation created:', res.data);
      alert('Reservation created!');
      navigate('/reservations');
    } catch (err) {
      console.error('Error creating reservation:', err.response?.data || err.message);
      setError('Failed to create reservation: ' + (err.response?.data?.message || err.message));
    }
  };

  if (error) return <div className="text-center py-8">{error}</div>;
  if (!listing) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-6">{listing.location}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/400'}
          alt={listing.title}
          className="w-full h-96 object-cover rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          {listing.images && listing.images.length > 1 ? (
            listing.images.slice(1, 5).map((img, idx) => (
              <img key={idx} src={img} alt="Gallery" className="w-full h-48 object-cover rounded" />
            ))
          ) : (
            Array.from({ length: 4 }, (_, idx) => (
              <div key={idx} className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                <span>No Image</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p>{listing.description}</p>
      </div>
      <div className="mt-8 border p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Reserve your stay</h2>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          min="1"
          className="p-2 border rounded mb-4 w-full"
        />
        <p className="text-xl font-semibold mb-4">Total: ${totalCost}</p>
        <button
          onClick={handleReserve}
          className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
          disabled={!totalCost || error}
        >
          Reserve
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <ul className="list-disc pl-5">
          <li>Wi-Fi</li>
          <li>Pool</li>
          <li>Kitchen</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationDetails;