import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch all listings and extract unique locations
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('Listings response:', res.data);
        
        // Extract unique locations from all listings
        const uniqueLocations = [...new Set(res.data.map(listing => listing.location))].filter(Boolean);
        setLocations(uniqueLocations);
      } catch (err) {
        console.error('Error fetching locations:', err.response?.data || err.message);
        // Set some default locations if API call fails
        setLocations(['New York, NY', 'Los Angeles, CA', 'Miami, FL', 'San Francisco, CA']);
      }
    };
    fetchLocations();
  }, [token]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting search query:', search);
    const query = new URLSearchParams({
      location: search.location,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: search.guests,
    }).toString();
    navigate(`/locations?${query}`);
  };

  return (
    <div className="space-y-12">
      {/* Banner Section - Full Width against Header */}
      <div className="relative w-full h-[640px]">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Search Bar Overlay */}
        <form
          onSubmit={handleSearchSubmit}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 flex items-center w-full max-w-3xl h-16 bg-white rounded-full p-2 pl-8 gap-4 shadow-md z-20"
        >
          <div className="search-option flex flex-col flex-1 max-md:w-full">
            <strong className="font-bold mb-1">Location</strong>
            <select
              name="location"
              value={search.location}
              onChange={handleSearchChange}
              className="border-none outline-none text-sm text-gray-600 w-full"
            >
              <option value="">Any Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="search-option flex flex-col flex-1 max-md:w-full">
            <strong className="font-bold mb-1">Check in</strong>
            <input
              type="date"
              name="checkIn"
              value={search.checkIn}
              onChange={handleSearchChange}
              className="border-none outline-none text-sm text-gray-600 w-full"
            />
          </div>
          <div className="search-option flex flex-col flex-1 max-md:w-full">
            <strong className="font-bold mb-1">Check out</strong>
            <input
              type="date"
              name="checkOut"
              value={search.checkOut}
              onChange={handleSearchChange}
              className="border-none outline-none text-sm text-gray-600 w-full"
            />
          </div>
          <div className="search-option flex flex-col flex-1 max-md:w-full">
            <strong className="font-bold mb-1">Guests</strong>
            <input
              type="number"
              name="guests"
              value={search.guests}
              onChange={handleSearchChange}
              min="1"
              className="border-none outline-none text-sm text-gray-600 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-600 max-md:w-12 max-md:h-12"
          >
            <SearchIcon fontSize="small" />
          </button>
        </form>
      </div>

      {/* Inspiration Section */}
      <section className="w-[1280px] h-[444px] mx-auto">
        <h2 className="text-3xl font-bold mb-6">Inspiration for your next trip</h2>
        <div className="grid grid-cols-4 gap-[10px] h-full">
          {[
            { city: 'Cape Town', image: 'https://a0.muscache.com/im/pictures/INTERNAL/INTERNAL-ImageByPlaceId-ChIJ1-4miA9QzB0Rh6ooKPzhf2g-large_background/original/24f948ca-81eb-4c42-9098-4f72e2df6611.jpeg?im_w=720&width=720&quality=70&auto=webp' },
            { city: 'Paris', image: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-18115633/original/a388ff5a-a071-4ffb-80c1-560fa8186a3c.jpeg?im_w=720' },
            { city: 'Thailand', image: 'https://a0.muscache.com/im/pictures/7d84d55f-d441-47f9-aa73-045a3cefaff5.jpg?im_w=720' },
            { city: 'China', image: 'https://images.fastcompany.com/image/upload/f_webp,q_auto,c_fit/wp-cms/uploads/2018/03/poster-p-1-airbnb-cancels-bookings-in-china-during-the-national-peoples-congress.jpg' },
          ].map(({ city, image }) => (
            <div key={city} className="w-[310px] h-[444px] relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`${city} Airbnb`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[50px] bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">{city}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: '30px' }}></div>

      {/* Experiences Section */}
      <section className="w-[1280px] h-[628px] mx-auto">
        <h2 className="text-3xl font-bold mb-6">Discover Airbnb Experiences</h2>
        <div className="grid grid-cols-2 gap-0 h-full">
          {[
            { image: 'https://a0.muscache.com/pictures/7975522/e379266e_original.jpg', text: 'Things to do on your trip' },
            { image: 'https://cdn1.matadornetwork.com/blogs/1/2021/09/nick-wallace-culinary-southern-food-airbnb-experiences-940x625.jpg', text: 'Things to do from home' },
          ].map(({ image, text }, index) => (
            <div key={index} className="w-[628px] h-[628px] overflow-hidden relative">
              <img
                src={image}
                alt={`Experience ${index + 1}`}
                className="w-[628px] h-[580px] object-cover"
              />
              {/* Text overlay centered horizontally, 40px from top */}
              <div className="absolute top-[40px] left-0 right-0 flex justify-center z-10">
                <h3 className="text-black text-4xl font-bold leading-tight drop-shadow-2xl text-center max-w-[400px]">
                  {text}
                </h3>
              </div>
              <div className="h-[48px] p-2 bg-white">
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: '30px' }}></div>

      {/* Gift Cards Section - Text and button on left, photo on right */}
      <section className="w-[1280px] h-[320px] mx-auto">
        <div className="flex items-center h-full">
          <div className="w-1/2 h-full flex flex-col justify-center items-start px-8">
            <h2 className="text-3xl font-bold mb-6">Shop Airbnb gift cards</h2>
            <Link
              to="#"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 inline-block"
            >
              Shop now
            </Link>
          </div>
          <div className="w-1/2 h-full">
            <img
              src="https://cdn.images.express.co.uk/img/dynamic/25/590x/secondary/Airbnb-3906241.jpg?r=1644406120862"
              alt="Gift Cards"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <div style={{ height: '30px' }}></div>

      <section className="w-[1280px] h-[640px] mx-auto relative">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="People discussing hosting"
          className="w-[1280px] h-[640px] object-cover"
        />
        <div
          className="absolute top-[30px] left-[30px] text-white text-4xl font-bold"
          style={{ lineHeight: '1.2' }}
        >
          Questions<br />about<br />hosting?
        </div>
      </section>

      <div style={{ height: '35px' }}></div>
      {user && <p className="text-center">Logged in as: {user.role}</p>}
    </div>
  );
};

export default Home;