// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartImage from '../assets/cart.png';
import companyicon from '../assets/CompanyLogo.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSearchResults, setLoading } from '../redux/slice/searchSlice';
import { logout } from '../redux/slice/authSlice';

function Navbar() {
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const searchResults = useSelector((state) => state.search.searchResults);
  const loading = useSelector((state) => state.search.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsTyping(true);
      const delayDebounceFn = setTimeout(() => {
        fetchSearchResults();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(setSearchResults([]));
      setIsTyping(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`http://localhost:5000/api/products?search=${searchQuery}`);
      dispatch(setSearchResults(response.data));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`${isScrolled ? 'bg-opacity-80 bg-[#c8f4df]' : 'bg-[#c8f4df]'} p-4 fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300 ease-in-out`}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="mr-4">
            <img src={companyicon} alt="Icon" className="w-18 h-10" />
          </Link>

          <div className="flex-grow mx-8 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) fetchSearchResults();
              }}
              className="flex items-center relative w-full"
            >
              <input
                type="text"
                placeholder="Search your Medicines"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="absolute right-1 pr-28 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                >
                  ×
                </button>
              )}

              <button
                type="submit"
                className="bg-[#4a8694] text-white px-6 py-2 rounded-r-full hover:bg-[#225f6a] transition duration-300 -ml-px whitespace-nowrap"
              >
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-[90%] bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto z-50 transition-all ease-in-out duration-300 max-h-[35vh]">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => {
                      dispatch(setSearchResults([]));
                      dispatch(setSearchQuery(''));
                      navigate(`/medicine/${result._id}`);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{result.name}</span>
                        <span className="text-xs text-gray-500 mt-1">{result.category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">MRP ₹{result.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="absolute top-full left-0 mt-2 w-[90%] text-center text-sm text-gray-500">
                Loading...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link to="/infoOrder" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out hidden sm:block">How to order</Link>
            <Link to="/contact" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out hidden sm:block">Contact</Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out">Profile</Link>
                <Link to="/cart" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out">
                  <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center shadow-md transform hover:scale-110 transition-transform duration-300 ease-in-out">
                    <img className="w-4 h-4" src={cartImage} alt="Cart" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out">Login</Link>
                <Link to="/register" className="text-black text-base font-lato hover:text-blue-600 transition duration-300 ease-in-out">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
