import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText } from "lucide-react";
import axios from "axios";
import { loginSuccess, logout } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isPrimary: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState("profileInfo");
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    if (token) {
      fetchPrescriptions();
    }
  }, [token]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        dispatch(logout());
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Authentication failed:", error);
        dispatch(logout());
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/order-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    verifyUser();
    fetchOrders();
  }, [token, dispatch]);

  const handleAddAddress = async () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zip ||
      !newAddress.country
    ) {
      toast.error("All fields are required to add an address.");
      return;
    }

    const addressData = {
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.zip,
      country: newAddress.country,
      isPrimary: newAddress.isPrimary,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/address`,
        {
          userId: user._id,
          address: addressData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
      setAddresses([...response.data.addresses]);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        isPrimary: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Error adding address.");
    }
    setShowAddressForm(false);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/address/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data);
      toast.success("Address deleted successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error deleting address.");
    }
  };

  const handleSetPrimaryAddress = async (addressId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/address/${addressId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure the primary address appears first
      const sortedAddresses = response.data
        .slice() // Create a copy to avoid modifying state directly
        .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)); // Sort: primary first

      setAddresses(sortedAddresses);

      toast.success("Default address set successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error setting primary address.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-36 flex flex-col md:flex-row mt-24 md:mt-0">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-200 p-4 md:p-6 rounded-lg mb-4 md:mb-0 md:mr-4">
        <div className="text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Hello! {user ? user.name : "Not Logged In"}
        </div>

        {/* Buttons - Updated for better wrapping on tablets */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4">
          <button
            onClick={() => setSelectedSection("profileInfo")}
            className={`w-full p-2 md:p-3 rounded-md transition ${
              selectedSection === "profileInfo"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setSelectedSection("manageAddress")}
            className={`w-full p-2 md:p-3 rounded-md transition ${
              selectedSection === "manageAddress"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Manage Address
          </button>
          <button
            onClick={() => setSelectedSection("salesProfile")}
            className={`w-full p-2 md:p-3 rounded-md transition ${
              selectedSection === "salesProfile"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Sales Profile
          </button>
          <button
            onClick={() => setSelectedSection("orderHistory")}
            className={`w-full p-2 md:p-3 rounded-md transition ${
              selectedSection === "orderHistory"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setSelectedSection("managePrescriptions")}
            className={`w-full p-2 md:p-3 rounded-md transition ${
              selectedSection === "managePrescriptions"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            My Prescriptions
          </button>
          {/* Logout Button - Visible only on desktop */}
          <button
            onClick={handleLogout}
            className="hidden md:block w-full p-2 md:p-3 rounded-md transition bg-red-500 text-white hover:bg-red-600 mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-4 md:p-6 rounded-lg">
        {selectedSection === "profileInfo" && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">User Profile</h2>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {user ? user.name : "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user ? user.email : "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong> {user ? user.phoneNumber : "N/A"}
              </p>

              {/* Display Primary Address */}
              {user?.addresses?.length > 0 ? (
                user.addresses.map((address) =>
                  address.isPrimary ? (
                    <p key={address._id}>
                      <strong>Default Address:</strong>{" "}
                      {`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
                    </p>
                  ) : null
                )
              ) : (
                <p>
                  <strong>Default Address:</strong> N/A
                </p>
              )}
            </div>
          </div>
        )}

        {selectedSection === "manageAddress" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
            <div className="space-y-4">
              {addresses
                .slice() // Create a copy to avoid mutating state directly
                .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)) // Sort to keep the primary address on top
                .map((address) => (
                  <div
                    key={address._id}
                    className="bg-gray-50 p-4 rounded-md shadow-md"
                  >
                    <p className="font-semibold">
                      {address.isPrimary ? "Default Address" : ""}
                    </p>
                    <p className="text-sm md:text-base my-2">
                      {address.street}, {address.city}, {address.state} -{" "}
                      {address.zipCode}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {!address.isPrimary && (
                        <button
                          onClick={() => handleSetPrimaryAddress(address._id)}
                          className="bg-blue-500 text-white py-1 px-4 rounded-md text-sm hover:bg-blue-600"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-md text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="w-44 bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>

            {showAddressForm && (
              <div className="mt-4 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Flat, House no., Building, Company, Apartment"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="border p-3 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="border p-3 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="border p-3 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  className="border p-3 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="border p-3 rounded-md w-full"
                />
                <div className="col-span-2 flex justify-center sm:justify-start">
                  <button
                    onClick={handleAddAddress}
                    className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedSection === "orderHistory" && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order History
            </h2>
            {orderHistory.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orderHistory.map((order) => (
                  <li
                    key={order._id}
                    className="py-4 border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
                  >
                    <p className="font-medium text-gray-900">
                      Order ID: {order._id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                      <strong>Status:</strong> {order.orderStatus}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {order.items.map((item) => (
                        <li key={item.productId._id} className="text-gray-600">
                          {item.productId.drugName} (Qty: {item.quantity}) - ₹
                          {item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedSection === "managePrescriptions" && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Prescriptions
            </h2>

            {prescriptions.length === 0 ? (
              <p className="text-gray-500">No prescriptions uploaded.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {prescriptions.map((prescription) => {
                  // Check if the file is an image
                  const isImage = prescription.fileUrl?.match(
                    /\.(jpeg|jpg|png|gif)$/
                  );
                  const isPdf = prescription.fileUrl?.endsWith(".pdf");

                  return (
                    <li
                      key={prescription._id}
                      className="py-4 border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm flex items-center space-x-4"
                    >
                      {/* Thumbnail Preview */}
                      {isImage ? (
                        <img
                          src={prescription.fileUrl}
                          alt="Prescription"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                        />
                      ) : isPdf ? (
                        <div className="w-16 h-16 flex items-center justify-center bg-red-500 text-white rounded-lg border">
                          <FileText className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg border">
                          ❓ Unknown
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-900">
                          <strong>Uploaded:</strong>{" "}
                          {prescription.uploadedAt
                            ? new Date(
                                prescription.uploadedAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <strong>Status:</strong>{" "}
                          {prescription.status || "Pending"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
