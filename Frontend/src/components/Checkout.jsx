import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";  // For accessing Redux state
import { useDispatch } from "react-redux";  // For dispatching actions

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      // Fetch the cart if a token exists
      axios
        .get(`http://localhost:5000/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCart(response.data?.items || []);
        })
        .catch((err) => {
          setError("Failed to fetch cart");
          console.error("Failed to fetch cart:", err);
        });

      // Fetch user's addresses
      axios
        .get(`http://localhost:5000/api/users/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAddresses(response.data?.addresses || []);
          setLoading(false);  // Set loading to false after data is fetched
        })
        .catch((err) => {
          setError("Failed to fetch addresses");
          setLoading(false);
          console.error("Failed to fetch addresses:", err);
        });
    } else {
      setLoading(false);  // If no token, stop loading
      navigate("/login");  // Redirect to login if not authenticated
    }
  }, [token, navigate]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setError("Please select an address to proceed.");
      return;
    }
  
    axios
      .post(
        "http://localhost:5000/api/orders/create",
        { address: selectedAddress }, // Send required data in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("Order placed successfully!");
        navigate("/order-summary");
      })
      .catch((err) => {
        setError("Failed to place order");
        console.error("Failed to place order:", err);
      });
  };
  

  // Calculate the total price of the cart and format it to 2 decimal places
  const calculateTotal = () => {
    const total = cart.reduce((total, item) => {
      return total + (item?.productId?.price || 0) * (item?.quantity || 0);
    }, 0);
    return total.toFixed(2);  // Format to 2 decimal places
  };

  const totalAmount = calculateTotal();

  return (
    <div className="container min-h-screen mx-auto p-24">
      <h1 className="text-center text-3xl mb-6">Checkout</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Select Shipping Address</h2>
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500">You have no saved addresses.</p>
          ) : (
            <div>
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`flex items-center border p-4 rounded-md mb-4 cursor-pointer ${
                    selectedAddress?._id === address._id
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{address.street}</h3>
                    <p>{address.city}, {address.state}</p>
                    <p>{address.country}</p>
                    <p>{address.zipCode}</p>
                    {address.isPrimary && <span className="text-sm text-green-600">Primary Address</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div key={index} className="flex items-center border p-4 rounded-md">
                  <img
                    src={item?.productId?.image || "placeholder.jpg"}
                    alt={item?.productId?.name || "Unnamed product"}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">{item?.productId?.name || "Unknown Product"}</h2>
                    <p className="text-blue-600 font-semibold">
                      Price: Rs.{item?.productId?.price || "N/A"}
                    </p>
                    <p>Quantity: {item?.quantity || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Display the total amount */}
          <div className="flex justify-between items-center font-semibold text-lg mt-6">
            <span>Total:</span>
            <span>Rs.{totalAmount}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white p-2 rounded mt-6 block mx-auto transition transform duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
