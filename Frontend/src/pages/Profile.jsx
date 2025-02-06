import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

    verifyUser();
  }, [token, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

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

      toast.success("Address added successfully!");
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
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/address/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data);
      toast.success("Address deleted successfully!");
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
      setAddresses(response.data);
      toast.success("Primary address set successfully!");
    } catch (error) {
      toast.error("Error setting primary address.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-36 flex flex-col md:flex-row mt-24 md:mt-0">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-200 p-4 md:p-6 rounded-lg mb-4 md:mb-0 md:mr-4">
        <div className="text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Hello! {user ? user.name : "Not Logged In"}
        </div>

        <div className="flex md:block space-x-2 md:space-x-0 md:space-y-4">
          <button
            onClick={() => setSelectedSection("profileInfo")}
            className={`flex-1 md:w-full text-center md:text-left p-2 md:p-3 rounded-md transition ${
              selectedSection === "profileInfo"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setSelectedSection("manageAddress")}
            className={`flex-1 md:w-full text-center md:text-left p-2 md:p-3 rounded-md transition ${
              selectedSection === "manageAddress"
                ? "bg-gray-400"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Manage Address
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 md:w-full text-center md:text-left p-2 md:p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-4 md:p-6 rounded-lg">
        {selectedSection === "profileInfo" && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Profile Info</h2>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {user ? user.name : "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user ? user.email : "N/A"}
              </p>
              <p>
                <strong>PhoneNumber:</strong> {user ? user.phoneNumber : "N/A"}
              </p>
            </div>
          </div>
        )}

        {selectedSection === "manageAddress" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Addresses</h2>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="bg-gray-50 p-4 rounded-md shadow-md"
                >
                  <p className="font-semibold">
                    {address.isPrimary ? "Primary Address" : "Address"}
                  </p>
                  <p className="text-sm md:text-base my-2">
                    {address.street}, {address.city}, {address.state} -{" "}
                    {address.zipCode}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSetPrimaryAddress(address._id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md text-sm hover:bg-blue-600"
                    >
                      Set as Primary
                    </button>
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
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>

            {showAddressForm && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                <button
                  onClick={handleAddAddress}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
