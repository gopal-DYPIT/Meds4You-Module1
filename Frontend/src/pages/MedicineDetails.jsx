import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import { Tab, Tabs, Box } from "@mui/material"; // Import Material-UI Tabs

const MedicineDetails = () => {
  const { id } = useParams(); // Get the medicine ID from the URL
  const [medicine, setMedicine] = useState(null);
  const [user, setUser] = useState(null); // User state to track authentication
  const [selectedTab, setSelectedTab] = useState(0); // Manage the selected tab
  const [cart, setCart] = useState([]); // Cart state to manage items in the cart

  useEffect(() => {
    // Check if the user is authenticated by verifying the token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Assuming a JWT token-based authentication, you could decode it here if needed.
    }

    // Fetch medicine details
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        setMedicine(response.data);
      })
      .catch((err) => console.error(err));

  }, [id]);

  const addToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to the cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    const token = localStorage.getItem('token'); // Get the token from localStorage
  
    if (!token) {
      toast.error("Please log in to add items to the cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    try {
      // Send a request to add the product to the cart with the Authorization header
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          userId: user.uid, // User ID from Firebase
          productId: medicine._id, // Product ID from medicine details
          quantity: 1, // Add 1 product to the cart (can be adjusted later)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token as Bearer token
          },
        }
      );
  
      // Add the item to the cart state
      setCart((prevCart) => [...prevCart, { productId: medicine._id, quantity: 1 }]);
  
      // Show toast notification when added to cart
      toast.success("Added to Cart!", {
        position: "top-right",
        autoClose: 3000, // Duration for the toast to stay visible (in ms)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.log("Failed to add to cart:", err);
      toast.error("Failed to Add to Cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); // Update the selected tab
  };

  if (!medicine) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="mx-auto max-w-7xl mt-20 px-8 p-24">
      <div className="flex">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-48 h-48 object-cover rounded-md"
        />
        <div className="ml-8">
          <h2 className="text-3xl font-semibold">{medicine.name}</h2>
          <p className="text-gray-700 mt-4">{medicine.description}</p>
          <p className="text-lg font-bold text-green-600 mt-2">₹{medicine.price}</p>
          {medicine.discount && (
            <span className="text-xs font-semibold text-white bg-green-600 px-1 py-1 rounded-md">
              {medicine.discount}% OFF
            </span>
          )}
          <div className="mt-4">
            <button
              onClick={addToCart}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-400"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Benefits, Side Effects, How to Use, etc. */}
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Medicine Details Tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Benefits" />
          <Tab label="Side Effects" />
          <Tab label="How to Use" />
          <Tab label="How It Works" />
          <Tab label="What if I forget to take it?" />
          <Tab label="Manufacturer Address" />
        </Tabs>
      </Box>

      <div className="mt-6">
        {selectedTab === 0 && <p>{medicine.benefits}</p>}
        {selectedTab === 1 && <p>{medicine.sideEffects}</p>}
        {selectedTab === 2 && <p>{medicine.howToUse}</p>}
        {selectedTab === 3 && <p>{medicine.howItWorks}</p>}
        {selectedTab === 4 && <p>{medicine.forgotToTake}</p>}
        {selectedTab === 5 && <p>{medicine.manufacturerAddress}</p>}
      </div>

      {/* Toast Container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default MedicineDetails;
