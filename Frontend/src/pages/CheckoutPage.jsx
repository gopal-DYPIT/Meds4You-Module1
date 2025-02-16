import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const selectedProducts = location.state?.selectedProducts || [];
  // console.log(selectedProducts);
  const totalAmount = location.state?.total || "0.00";

  useEffect(() => {
    if (token) {
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
      toast.error("Please select an address.", { position: "top-center" });
      return;
    }

    if (selectedProducts.length === 0) {
      setError("No products selected.");
      toast.error("No products selected.", { position: "top-center" });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create`,
        {
          address: selectedAddress,
          products: selectedProducts, // ✅ Ensure this contains valid products
          totalAmount: totalAmount, // ✅ Ensure correct total amount
        },
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
          navigate("/order-summary"); // ✅ Redirect user to their profile/orders page
        }, 3000);
      })
      .catch((err) => {
        setError("Failed to place order");
        toast.error("Failed to place order", { position: "top-center" });
        console.error("Failed to place order:", err);
      });
  };

  // Mobile Order Summary Card Component
  const MobileOrderSummaryCard = ({ item, index }) => {
    const product = item?.productId;
    const alternate = product?.alternateMedicines?.[0];
    const selection = item.selection || "original";
    const isRecommended = selection === "recommended";

    const medicineToShow =
      isRecommended && alternate
        ? {
            name: alternate.name,
            manufacturer: alternate.manufacturer,
            price: alternate.price,
            isImage: true,
          }
        : {
            name: product?.drugName,
            manufacturer: product?.manufacturer,
            price: product?.price,
            isImage: false,
          };

    return (
      <div className="bg-white p-3 rounded-md shadow-sm mb-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">#{index + 1}</span>
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              isRecommended
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isRecommended ? "Recommended" : "Selected"}
          </span>
        </div>

        <h3 className="font-semibold">{medicineToShow.name}</h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-500">{medicineToShow.manufacturer}</span>
          <div className="text-right">
            <p className="text-gray-600">
              ₹{medicineToShow.price} x {item.quantity}
            </p>
            <p className="font-semibold text-lg">
              ₹{(medicineToShow.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DesktopOrderTable = () => (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left border-b">No.</th>
            <th className="py-3 px-4 text-left border-b">Medicine Name</th>
            <th className="py-3 px-4 text-left border-b">Manufacturer</th>
            <th className="py-3 px-4 text-left border-b">Type</th>
            <th className="py-3 px-4 text-left border-b">Price/Unit (Rs.)</th>
            <th className="py-3 px-4 text-left border-b">Quantity</th>
            <th className="py-3 px-4 text-left border-b">Total (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((item, index) => {
            const product = item?.productId;
            const alternate = product?.alternateMedicines?.[0];
            const selection = item.selection || "original";
            const isRecommended = selection === "recommended";

            const medicineToShow =
              isRecommended && alternate
                ? {
                    name: alternate.name,
                    manufacturer: alternate.manufacturer,
                    price: alternate.price,
                    isImage: true,
                  }
                : {
                    name: product?.drugName,
                    manufacturer: product?.manufacturer,
                    price: product?.price,
                    isImage: false,
                  };

            return (
              <tr key={index} className="border-b">
                <td className="py-4 px-4">{index + 1}</td>
                <td className="py-4 px-4">{medicineToShow.name}</td>
                <td className="py-4 px-4">{medicineToShow.manufacturer}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      isRecommended
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isRecommended ? "Recommended" : "Selected"}
                  </span>
                </td>
                <td className="py-4 px-4">{medicineToShow.price}</td>
                <td className="py-4 px-4">{item.quantity}</td>
                <td className="py-4 px-4">
                  {(medicineToShow.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            );
          })}
          <tr className="bg-gray-50 font-semibold">
            <td colSpan="6" className="py-4 px-4 text-right">
              Total Amount:
            </td>
            <td className="py-4 px-4 text-green-600 font-bold">
              ₹ {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading checkout details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-6 sm:px-12 pt-28">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
          Checkout
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Address Selection Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Select Shipping Address
          </h2>

          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                    selectedAddress?._id === address._id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex items-start sm:items-center">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => handleAddressSelect(address)}
                      className="w-4 h-4 mt-1 sm:mt-0 text-green-600"
                    />
                    <div className="ml-3 sm:ml-4">
                      <h3 className="font-semibold">{address.street}</h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        {address.country}, {address.zipCode}
                      </p>
                      {address.isPrimary && (
                        <span className="text-xs sm:text-sm text-green-600 font-medium">
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Warning message when no addresses are available
            <div className="text-center p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-600 font-semibold">
                No shipping address found. Please add an address from your
                profile.
              </p>
              <button
                onClick={() => (window.location.href = "/profile")} // Change URL as needed
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Go to Profile
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <h2 className="text-lg sm:text-xl font-bold p-4 sm:p-6 border-b">
            Order Summary
          </h2>

          {/* Mobile View */}
          <div className="block lg:hidden p-4">
            {selectedProducts.map((item, index) => (
              <MobileOrderSummaryCard key={index} item={item} index={index} />
            ))}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">₹ {totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <DesktopOrderTable />
        </div>

        {/* Place Order Button */}
        <div className="flex justify-center px-4 sm:px-0">
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedAddress}
            className={`
              w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg text-white text-base sm:text-lg font-semibold
              transition-all duration-300
              ${
                selectedAddress
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Place Order: ₹ {totalAmount}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
