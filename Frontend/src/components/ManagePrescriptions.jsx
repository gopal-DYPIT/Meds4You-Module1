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

      // ✅ Make sure the request is sending the right data
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

      // console.log("✅ Status update response:", response.data);

      // ✅ Update UI immediately after status change
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
      <h2 className="text-2xl font-bold mb-4">Uploaded Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
                <th className="px-6 py-3 border border-gray-300 w-1/5 text-center">
                  User
                </th>
                <th className="px-6 py-3 border border-gray-300 w-1/5 text-center">
                  Phone
                </th>
                <th className="px-6 py-3 border border-gray-300 w-1/5 text-center">
                  Prescription
                </th>
                <th className="px-6 py-3 border border-gray-300 w-1/5 text-center">
                  Uploaded At
                </th>
                <th className="px-6 py-3 border border-gray-300 w-1/5 text-center">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr
                  key={prescription._id}
                  className="hover:bg-gray-100 transition-all duration-300"
                >
                  <td className="px-6 py-4 border border-gray-300 text-center">
                    {prescription.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-center">
                    {prescription.userId?.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-center">
                    <a
                      href={prescription.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Prescription
                    </a>
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-center">
                    {new Date(prescription.uploadedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 text-center">
                    <select
                      className="border p-2 rounded w-full max-w-[150px]"
                      value={prescription.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(prescription._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManagePrescriptions;
