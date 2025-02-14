import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ManagePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No token found in localStorage!");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPrescriptions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load prescriptions");
        console.error("❌ Error fetching prescriptions:", err);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/prescriptions/update-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPrescriptions((prev) =>
        prev.map((prescription) =>
          prescription._id === id
            ? { ...prescription, status: newStatus }
            : prescription
        )
      );
    } catch (err) {
      console.error("❌ Error updating prescription status:", err);
      toast.error("Failed to update status. Check console for errors.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
        Uploaded Prescriptions
      </h2>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500 text-center">
          No prescriptions uploaded yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              {/* User Info */}
              <div className="mb-2">
                <p className="text-lg font-semibold">
                  {prescription.userId?.name || "Unknown"}
                </p>
                <p className="text-gray-600 text-sm">
                  {prescription.userId?.phoneNumber || "N/A"}
                </p>
              </div>

              {/* Prescription Link */}
              <div className="mb-2">
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Prescription
                </a>
              </div>

              {/* Uploaded Date */}
              <p className="text-sm text-gray-600">
                <strong>Uploaded At:</strong>{" "}
                {new Date(prescription.uploadedAt).toLocaleDateString()}
              </p>

              {/* Delivery Address */}
              <div className="mt-2 text-sm text-gray-700">
                <strong>Address:</strong> <br />
                {prescription.deliveryAddress
                  ? `${prescription.deliveryAddress.street}, ${prescription.deliveryAddress.city}, 
                    ${prescription.deliveryAddress.state}, ${prescription.deliveryAddress.zipCode}, 
                    ${prescription.deliveryAddress.country}`
                  : "N/A"}
              </div>

              {/* Instructions with Wrapping */}
              <div className="mt-2 text-sm text-gray-700">
                <strong>Instructions:</strong>
                <p className="break-words">
                  {prescription.instructions || "N/A"}
                </p>
              </div>

              {/* Status Dropdown */}
              <div className="mt-4">
                <label className="text-sm font-semibold">Update Status:</label>
                <select
                  className="border p-2 rounded w-full mt-1 text-sm"
                  value={prescription.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(prescription._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManagePrescriptions;
