import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderMedicine = () => {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [instructions, setInstructions] = useState("");

  const { isAuthenticated, token } = useSelector((state) => state.auth);

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
        })
        .catch((err) => console.error("Failed to fetch addresses:", err));
    }
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(true); 
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      setMessage("Please log in to upload a prescription.");
      return;
    }
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    if (!selectedAddress) {
      setMessage("Please select a delivery address.");
      return;
    }

    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("address", JSON.stringify(selectedAddress));
    formData.append("instructions", instructions);

    setIsUploading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.status === 200
          ? "Prescription uploaded successfully!"
          : "Failed to upload prescription."
      );
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      setFile(null);
      setPreview(null);
      setInstructions("");
      document.getElementById("prescription").value = "";
    }
  };

  return (
    <div className="flex flex-col p-28 items-center justify-center min-h-screen bg-gradient-to-br bg-[#FFF0F5] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl space-y-6 p-6 sm:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          Order Medicine by Prescription
        </h1>
        <p className="text-gray-600 text-center text-sm sm:text-base">
          Follow these steps to place your order:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm sm:text-base">
          <li>Upload prescription.</li>
          <li>Select delivery address.</li>
          <li>Provide special instructions (if any).</li>
          <li>Receive confirmation call.</li>
          <li>Delivery at your doorstep.</li>
        </ul>

        <div className="relative">
          <label
            htmlFor="prescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload Prescription
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="file"
              id="prescription"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 focus:outline-none"
            />
            {fileUploaded && (
              <span className="ml-2 text-green-600 font-semibold text-lg">
                ✔
              </span>
            )}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4">
          Select Delivery Address
        </h2>

        {addresses.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-500">
            No saved addresses. Add from profile section.
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border p-3 rounded-lg cursor-pointer transition ${
                  selectedAddress?._id === address._id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <p className="font-semibold">
                  {address.street}, {address.city}, {address.state}
                </p>
                <p className="text-sm text-gray-600">
                  {address.zipCode}, {address.country}
                </p>
                {address.isPrimary && (
                  <span className="text-xs text-green-600 font-medium">
                    Default Address
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500">
          Manage address from profile section.
        </p>

        <label
          htmlFor="instructions"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Special Instructions (Optional)
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Preferred delivery time, medicine dosage details"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>

        {message && (
          <p
            className={`text-sm sm:text-base font-medium text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-lg shadow transition ${
            isUploading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        >
          {isUploading ? "Uploading..." : "Upload Prescription"}
        </button>
      </div>
    </div>
  );
};

export default OrderMedicine;
