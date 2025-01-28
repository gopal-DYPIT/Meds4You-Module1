import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const OrderMedicine = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const { isAuthenticated, token } = useSelector((state) => state.auth); // Getting authentication info from Redux
  const dispatch = useDispatch(); // Dispatch function

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Create preview
    setMessage(""); // Reset message
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

    const formData = new FormData();
    formData.append("prescription", file);

    setIsUploading(true);
    setMessage(""); // Reset previous message

    try {
      const response = await axios.post(
        "http://localhost:5000/api/prescriptions/upload", // Adjust URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Send token as Bearer token
          },
        }
      );

      if (response.status === 200) {
        setMessage("Prescription uploaded successfully!");
      } else {
        setMessage("Failed to upload the prescription. Please try again.");
      }

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred. Please try again.");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } finally {
      setIsUploading(false);
      setFile(null);
      setPreview(null);
      document.getElementById("prescription").value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Order Medicine by Prescription
        </h1>
        <p className="text-gray-600 text-center text-sm">
          Follow these steps to place your order:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
          <li>Upload prescription.</li>
          <li>Place the order.</li>
          <li>Estimation & approval on call.</li>
          <li>Free doctor consultation</li>
          <li>Delivery at your doorstep</li>
        </ul>

        <div>
          <label
            htmlFor="prescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload Prescription
          </label>
          <input
            type="file"
            id="prescription"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Prescription Preview"
              className="w-full h-auto rounded-lg shadow border"
              onError={() => setPreview(null)} // Handle non-image files
            />
          </div>
        )}

        {message && (
          <p
            className={`text-sm font-medium mb-4 text-center ${
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
          className={`w-full text-white font-semibold text-sm px-4 py-2 rounded-lg shadow ${
            isUploading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition`}
        >
          {isUploading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-2 border-t-2 border-red-600 rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            "Upload Prescription"
          )}
        </button>

        <p className="text-gray-500 text-xs text-center mt-4">
          *Only images (.jpg, .jpeg, .png) and PDFs are accepted.
        </p>
      </div>
    </div>
  );
};

export default OrderMedicine;
