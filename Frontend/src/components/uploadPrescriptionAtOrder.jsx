import React, { useState } from "react";

const UploadPrescriptionAtUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null); // Track selected file
  const [fileUploaded, setFileUploaded] = useState(false); // Track if file is uploaded

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first file selected
    if (selectedFile) {
      setFile(selectedFile); // Set file in state
      setFileUploaded(true); // Mark file as uploaded
      onFileSelect(selectedFile); // Pass file to parent component
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
                  onChange={handleFileChange} // Handle file selection
                  className="block w-full text-sm text-gray-900 focus:outline-none file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {/* Display a checkmark if file is selected */}
                {fileUploaded && (
                  <span className="ml-2 text-green-600 font-semibold text-lg">✔</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message (optional) */}
        {/* Add message handling if needed in the future */}
      </div>
    </div>
  );
};

export default UploadPrescriptionAtUpload;
