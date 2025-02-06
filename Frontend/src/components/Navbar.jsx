import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartImage from "../assets/cart.png";
import companyicon from "../assets/CompanyLogo.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  setSearchResults,
  setLoading,
} from "../redux/slice/searchSlice";
import { logout } from "../redux/slice/authSlice";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const searchResults = useSelector((state) => state.search.searchResults);
  const loading = useSelector((state) => state.search.loading);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && event.newValue === null) {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [dispatch]);

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
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?search=${searchQuery}`
      );
      dispatch(setSearchResults(response.data));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <nav className="bg-[#c8f4df] p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <img
            src={companyicon}
            alt="Icon"
            className="w-20 h-6 sm:w-24 sm:h-10"
          />
        </Link>

        <div className="flex-grow mx-4 relative">
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
              className="w-full px-8 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out placeholder:text-sm sm:placeholder:p-4 sm:placeholder:text-base"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => dispatch(setSearchQuery(""))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
              >
                ×
              </button>
            )}
          </form>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-[90%] bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto z-50 transition-all ease-in-out duration-300 max-h-[35vh]">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  onClick={() => {
                    dispatch(setSearchResults([]));
                    dispatch(setSearchQuery(""));
                    navigate(`/medicine/${result._id}`);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {result.drugName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.category}
                    </span>
                    {result.alternateMedicines?.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        <strong>Alternates:</strong>{" "}
                        {result.alternateMedicines.map((alt, index) => (
                          <span key={index} className="text-gray-800">
                            {alt.name}
                            {index !== result.alternateMedicines.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </div>
                    )}
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

        {/* Improved Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-[#b3dcc7] transition-colors duration-200 focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>

        {/* Improved Mobile Menu with Animation */}
        <div
          className={`mobile-menu-container sm:hidden fixed top-[4rem] right-0 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col py-4">
            <Link
              to="/infoOrder"
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              How to order
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {authState ? (
              <>
                <Link
                  to="/profile"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center shadow-md">
                      <img className="w-4 h-4" src={cartImage} alt="Cart" />
                    </div>
                    <span>Cart</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop Menu (unchanged) */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link
            to="/infoOrder"
            className="text-black text-base hover:text-blue-600"
          >
            How to order
          </Link>
          <Link
            to="/contact"
            className="text-black text-base hover:text-blue-600"
          >
            Contact
          </Link>

          {authState ? (
            <>
              <Link
                to="/profile"
                className="text-black text-base hover:text-blue-600"
              >
                Profile
              </Link>
              <Link
                to="/cart"
                className="text-black text-base hover:text-blue-600"
              >
                <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center shadow-md">
                  <img className="w-4 h-4" src={cartImage} alt="Cart" />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black text-base hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-black text-base hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;