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

function Navbar() {
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For the mobile hamburger menu
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const searchResults = useSelector((state) => state.search.searchResults);
  const loading = useSelector((state) => state.search.loading);

  // ✅ Track auth state and update Navbar dynamically
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated); // Update when Redux state changes
  }, [isAuthenticated]);

  // ✅ Ensure multi-tab logout works
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
        {/* 🔹 Logo */}
        <Link to="/" className="mr-4">
          <img
            src={companyicon}
            alt="Icon"
            className="w-20 h-6 sm:w-24 sm:h-10 md:w-32 md:h-16"
          />
        </Link>

        {/* 🔹 Search Bar */}
        <div className="flex-grow mx-4 relative">
          {/* Search Bar for Desktop and Mobile */}
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
                className="w-full px-2 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out placeholder:text-sm"
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

        {/* 🔹 Hamburger for Mobile */}
        <div className=" pl-8 sm:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black text-2xl"
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* 🔹 Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-[#c8f4df] p-4 mt-2 z-50">
            <div className="flex flex-col items-start space-y-4">
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
        )}

        {/* 🔹 Desktop Menu (hidden on mobile) */}
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

          {/* 🔹 Auth Links */}
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
