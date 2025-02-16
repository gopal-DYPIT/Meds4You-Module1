import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartImage from "../assets/cart.png";
import companyicon from "../assets/CompanyLogo.png";
import { ExternalLink } from "lucide-react";
import { Home, ShoppingCart } from "lucide-react";
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
      if (isMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/products/search?q=${searchQuery}` // ✅ Fixed route
      );

      dispatch(setSearchResults(response.data));
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  // Don't return null for the entire navbar
  const showSearchResults = searchResults.length > 0;

  return (
    <nav className="bg-[#c8f4df] p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-2 flex justify-between items-center">
        <Link to="/">
          <img
            src={companyicon}
            alt="Icon"
            className="w-24 ml-[-10px] sm:mr-2 h-8 sm:w-32 sm:h-12"
          />
        </Link>

        <div className="flex-grow mr-2 relative">
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
              className="w-full px-8 py-1 sm:py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out placeholder:text-xs sm:placeholder:p-4 sm:placeholder:text-base"
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

          {showSearchResults && (
            <div className="absolute top-full left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[500px] lg:min-w-[800px] z-50 mx-auto mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl transition-all ease-in-out duration-300 max-h-[50vh] sm:max-h-[35vh] overflow-hidden">
              {/* Header - Stick to the top */}
              <div className="sticky top-0 bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 border-b border-gray-100 z-10">
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "result" : "results"} found
                </p>
              </div>

              {/* Scrollable Search Results */}
              <div className="overflow-y-auto max-h-[40vh] sm:max-h-[30vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="group transition-all duration-200 ease-in-out hover:bg-blue-50/50"
                    onClick={() => {
                      dispatch(setSearchResults([]));
                      dispatch(setSearchQuery(""));
                      navigate(`/medicine/${result._id}`);
                    }}
                  >
                    <div className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200 last:border-0 flex items-center gap-1 sm:gap-4 cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {result.drugName}
                        </h4>

                        {/* Category Tag */}
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                          {result.category}
                        </span>

                        {/* Alternate Medicines */}
                        {result.alternateMedicines?.length > 0 && (
                          <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
                            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                              Alternates:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.alternateMedicines
                                .slice(0, 1)
                                .map((alt, index) => (
                                  <span
                                    key={index}
                                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 shadow-sm truncate max-w-[100px] sm:max-w-none"
                                  >
                                    {alt.name}
                                  </span>
                                ))}
                              {result.alternateMedicines.length > 1 && (
                                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                  +{result.alternateMedicines.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* External Link Icon */}
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Stick to the bottom */}
              <div className="sticky bottom-0 bg-gradient-to-t from-white to-transparent py-1 sm:py-2">
                <div className="text-center text-[10px] sm:text-xs text-gray-500">
                  Click any result to view details
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="absolute top-full left-0 mt-2 w-[90%] text-center text-sm text-gray-500">
              Loading...
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 ">
          {/* Home Icon */}
          <div className="flex items-center space-x-2">
            {/* Home Icon - Visible only on Small Screens (Mobile) */}
            <div className="sm:hidden">
              <Link to="/" className="text-[#d9337b] hover:text-blue-600">
                <Home className="w-6 h-6" />
              </Link>
            </div>

            {/* Home Text - Visible only on Medium Screens and Above */}
            <div className="hidden sm:block">
              <Link
                to="/"
                className="text-black text-base hover:text-blue-600 p-2 mr-3"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Cart Icon (Only if authenticated) */}
          {isAuthenticated && (
            <Link
              to="/cart"
              className="text-[#d9337b] sm:hidden mb-[-2px] hover:text-blue-600 transition-colors duration-200 p-1 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden rounded-md text-[#d9337b]  hover:text-blue-600 transition-colors duration-200 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Improved Hamburger Menu Button */}

        {/* Improved Mobile Menu with Animation */}
        <div
          className={`mobile-menu-container sm:hidden fixed top-[4rem] right-0 w-48 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col py-4">
            {/* <Link
              to="/"
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link> */}
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

                <div className="flex pl-4 pt-4">
                  <button
                    className="w-32 sm:w-auto px-8 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md shadow-md transition duration-200"
                    onClick={() => {
                      dispatch(logout());
                      localStorage.removeItem("token");
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
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
          {/* <Link
            to="/"
            className="text-black text-base hover:text-blue-600"
          >
            Home
          </Link> */}
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
