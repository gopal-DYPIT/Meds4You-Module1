import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCart(response.data?.items || []);
        })
        .catch((err) => {
          setError("Failed to fetch cart");
          console.error("Failed to fetch cart:", err);
        });

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const sortedAddresses = response.data?.addresses
            ? [...response.data.addresses].sort(
                (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
              )
            : [];

          setAddresses(sortedAddresses);
          setSelectedAddress(
            sortedAddresses.find((addr) => addr.isPrimary) ||
              sortedAddresses[0] ||
              null
          );
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch addresses");
          setLoading(false);
          console.error("Failed to fetch addresses:", err);
        });
    } else {
      setLoading(false);
      navigate("/login");
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
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create`,
        { address: selectedAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Order placed successfully!", {
          position: "top-center",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/order-summary");
        }, 3000);
      })
      .catch((err) => {
        setError("Failed to place order");
        toast.error("Failed to place order", { position: "top-center" });
        console.error("Failed to place order:", err);
      });
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const alternatePrice =
          item?.productId?.alternateMedicines?.[0]?.price ||
          item?.productId?.price;
        return total + alternatePrice * (item?.quantity || 0);
      }, 0)
      .toFixed(2);
  };

  const totalAmount = calculateTotal();

  return (
    <div className="container pt-16 min-h-screen mx-auto p-4 sm:p-12">
      <h1 className="text-center font-semibold text-2xl sm:text-3xl mb-6">
        Checkout
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* Address Selection */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Select Shipping Address
          </h2>
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500">
              You have no saved addresses.
            </p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`flex items-center border p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedAddress?._id === address._id
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => handleAddressSelect(address)}
                    className="w-5 h-5 text-green-500 focus:ring-green-500"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">{address.street}</h3>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>
                      {address.country}, {address.zipCode}
                    </p>
                    {address.isPrimary && (
                      <span className="text-sm text-green-600 font-medium">
                        Default Address
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <h2 className="text-sm sm:text-lg font-semibold font-lato text-gray-800 p-2 pl-2 sm:pl-2 ">
                Manage Address from Profile Section
              </h2>
            </div>
          )}

          {/* Order Summary */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => {
                const alternateMedicine =
                  item?.productId?.alternateMedicines?.[0] || null;
                return (
                  <div
                    key={index}
                    className="flex items-center border p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={
                        alternateMedicine?.manufacturerUrl || "placeholder.jpg"
                      }
                      alt={alternateMedicine?.name || "Unnamed product"}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">
                        {alternateMedicine?.name || "Unknown Product"}
                      </h2>
                      <p className="text-blue-600 font-semibold">
                        Price: Rs.{alternateMedicine?.price || "N/A"}
                      </p>
                      <p>Quantity: {item?.quantity || 0}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total Amount */}
          <div className="flex justify-between items-center font-bold text-lg sm:text-xl border-t border-gray-300 pt-4">
            <span>Total:</span>
            <span className="text-green-600 text-xl sm:text-2xl font-extrabold">
              Rs.{totalAmount}
            </span>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold mt-4 block mx-auto transition-all duration-300 ease-in-out hover:bg-green-600 hover:scale-105 shadow-md"
          >
            Place Order
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
