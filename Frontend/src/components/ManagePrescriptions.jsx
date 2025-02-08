import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Uploaded Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">User</th>
                <th className="p-3 border border-gray-300">Phone</th>
                <th className="p-3 border border-gray-300">Prescription</th>
                <th className="p-3 border border-gray-300">Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{prescription.userId?.name || "Unknown"}</td>
                  <td className="p-3 border border-gray-300">{prescription.userId?.phoneNumber || "N/A"}</td>
                  <td className="p-3 border border-gray-300">
                    <a
                      href={prescription.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Prescription
                    </a>
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date(prescription.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePrescriptions;
