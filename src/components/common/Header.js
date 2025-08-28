import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBecomeHost = () => {
    if (user) {
      navigate('/admin/create-listing');
    } else {
      navigate('/login');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-black text-white">
      <nav className="flex justify-between items-center px-5 py-3 w-full">
        <div className="logo flex items-center">
          <Link to="/">
            <img src="/images/airbnblogo.png" alt="Airbnb Logo" className="h-8" />
          </Link>
        </div>
        <ul className="flex gap-5 list-none m-0 p-0 max-md:flex-col max-md:items-center max-md:gap-2">
          <li><Link to="/locations" className="text-white no-underline">Places To Stay</Link></li>
          <li><Link to="#" className="text-white no-underline">Experiences</Link></li>
          <li><Link to="#" className="text-white no-underline">Online Experiences</Link></li>
        </ul>
        <div className="auth-buttons flex items-center gap-3 relative">
          <button
            onClick={handleBecomeHost}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Become a Host
          </button>
          <button
            onClick={toggleDropdown}
            className="text-white bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
            title="User Menu"
          >
            <AccountCircleIcon fontSize="medium" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-10 bg-white text-gray-900 rounded-lg shadow-lg w-48 z-10">
              <ul className="list-none m-0 p-0">
                {user && user.role === 'user' && (
                  <li>
                    <Link
                      to="/reservations"
                      className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Reservations
                    </Link>
                  </li>
                )}
                {user && user.role === 'host' && (
                  <li>
                    <Link
                      to="/host"
                      className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Host Dashboard
                    </Link>
                  </li>
                )}
                {user && user.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user ? (
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 no-underline text-gray-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;