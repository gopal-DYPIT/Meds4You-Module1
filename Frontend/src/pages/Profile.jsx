  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import axios from "axios";
  import { loginSuccess, logout } from "../redux/slice/authSlice";
  import { useNavigate } from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

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

    // State for selected section (Profile Info or Manage Address)
    const [selectedSection, setSelectedSection] = useState("profileInfo");

    useEffect(() => {
      const verifyUser = async () => {
        if (!token) {
          dispatch(logout());
          navigate("/login");
          return;
        }

        try {
          const response = await axios.get("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
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
      // Validate the address data before sending
      if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip || !newAddress.country) {
        toast.error("All fields are required to add an address.");
        return;
      }

      const addressData = { 
        street: newAddress.street, 
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zip,
        country: newAddress.country,
        isPrimary: newAddress.isPrimary
      };

      try {
        const response = await axios.post("http://localhost:5000/api/users/address", {
          userId: user._id, // Assuming user._id is available
          address: addressData
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token if needed for authentication
          },
        });

        toast.success("Address added successfully!");
        setAddresses([...response.data.addresses]); // Properly add to the state
        setNewAddress({
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          isPrimary: false
        }); // Reset the form fields
      } catch (error) {
        console.error("Error adding address:", error);
        toast.error("Error adding address.");
      }
    };

    const handleDeleteAddress = async (addressId) => {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/users/address/${addressId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(response.data); // Update the addresses list
        toast.success("Address deleted successfully!");
      } catch (error) {
        toast.error("Error deleting address.");
      }
    };

    const handleSetPrimaryAddress = async (addressId) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/users/address/${addressId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(response.data); // Update the addresses list
        toast.success("Primary address set successfully!");
      } catch (error) {
        toast.error("Error setting primary address.");
      }
    };

    return (
      <div className="min-h-screen p-36 bg-gray-100 flex">
        <div className="w-1/4 bg-gray-200 p-6">
          <div className="text-xl font-semibold text-gray-800 mb-6">
            Hello! {user ? user.name : "Not Logged In"}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedSection("profileInfo")}
              className="w-full text-left p-3 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Profile Info
            </button>
            <button
              onClick={() => setSelectedSection("manageAddress")}
              className="w-full text-left p-3 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Manage Address
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {selectedSection === "profileInfo" && (
            <div>
              <h2 className="text-2xl font-bold">Profile Info</h2>
              <div className="space-y-4 mt-4">
                <p><strong>Name:</strong> {user ? user.name : "N/A"}</p>
                <p><strong>Email:</strong> {user ? user.email : "N/A"}</p>
                <p><strong>PhoneNumber:</strong> {user ? user.phoneNumber : "N/A"}</p>
              </div>
            </div>
          )}

          {selectedSection === "manageAddress" && (
            <div>
              <h2 className="text-xl font-bold">Manage Addresses</h2>
              {addresses.map((address) => (
                <div key={address._id} className="bg-white p-4 rounded-md shadow-md mb-4">
                  <p>{address.isPrimary ? "Primary Address" : "Address"}</p>
                  <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                  <button
                    onClick={() => handleSetPrimaryAddress(address._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-md mt-2"
                  >
                    Set as Primary
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-md mt-2 ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
              >
                {showAddressForm ? "Cancel" : "Add New Address"}
              </button>

              {/* Address Form */}
              {showAddressForm && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="border p-2 rounded-md mb-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="border p-2 rounded-md mb-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="border p-2 rounded-md mb-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    className="border p-2 rounded-md mb-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="border p-2 rounded-md mb-2 w-full"
                  />
                  <button
                    onClick={handleAddAddress}
                    className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
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
