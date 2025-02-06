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
import { HiMenu, HiX } from "react-icons/hi"; // Mobile menu icons

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const searchResults = useSelector((state) => state.search.searchResults);
  const loading = useSelector((state) => state.search.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

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
      const delayDebounceFn = setTimeout(() => {
        fetchSearchResults();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(setSearchResults([]));
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
    <nav className="bg-[#c8f4df] p-3 sm:p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="mr-4">
          <img
            src={companyicon}
            alt="Icon"
            className="w-16 sm:w-24 h-8 sm:h-10"
          />
        </Link>
        {/* Search Bar */}
        {/* Search Bar - Always Visible */}
        <div className="flex flex-grow mx-2 sm:mx-8 relative w-full sm:w-auto">
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
              className="w-[220px] sm:w-[830px] px-6 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out"
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
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop Navigation */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col items-center bg-[#c8f4df] py-4 space-y-3">
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
                Cart
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
      )}
    </nav>
  );
}

export default Navbar;
