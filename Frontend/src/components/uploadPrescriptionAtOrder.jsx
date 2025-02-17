import React, { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import {toast} from "react-toastify";

const UploadPrescriptionAtUpload = ({ onUploadSuccess, token }) => {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [prescriptionUrl, setPrescriptionUrl] = useState(""); // Use a string instead of an array
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(true);
      setMessage("");
    }
  };

  const handleUploadPrescription = async () => {
    if (!file) {
      toast.error("Please select a prescription file to upload.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("prescription", file);

    setIsUploading(true); // Set uploading state to true

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/upload-prescription/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        }
      );

      if (response.data.success) {
        setPrescriptionUrl(response.data.fileUrl); // Save the file URL in the state
        toast.success("Prescription uploaded successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        onUploadSuccess(response.data.fileUrl); // If you want to use this callback to notify parent component
      }
    } catch (error) {
      toast.error("Error uploading prescription. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="w-full sm:max-w-4xl max-w-md mx-auto p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="prescription"
            className="block text-sm font-bold text-gray-700 sm:text-base"
          >
            Upload Prescription
          </label>
        </div>

        {/* Upload Area */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="w-full relative">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                <input
                  type="file"
                  id="prescription"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 focus:outline-none file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {fileUploaded && (
                  <span className="ml-2 text-green-600 font-semibold text-lg">✔</span>
                )}
              </div>
            </div>

            <button
              onClick={handleUploadPrescription}
              disabled={isUploading}
              className={`flex items-center justify-center w-full sm:w-auto text-white font-semibold text-sm px-4 py-2 rounded-lg shadow transition
                ${isUploading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-2">
            <p
              className={`text-sm sm:text-base font-medium text-center ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPrescriptionAtUpload;
