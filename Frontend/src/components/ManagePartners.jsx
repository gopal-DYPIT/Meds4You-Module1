import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagePartners = () => {
  const [pendingPartners, setPendingPartners] = useState([]);

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const fetchPendingPartners = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        alert("Unauthorized access! Please log in again.");
        return;
      }
  
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/partners/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        }
      );
  
      setPendingPartners(response.data);
    } catch (error) {
      console.error("Error fetching pending partners:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized! Only admins can access this section.");
      }
    }
  };
  

  const approvePartner = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized access! Please log in again.");
        return;
      }
  
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/partners/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message);
      setPendingPartners((prev) => prev.filter((partner) => partner._id !== id));
    } catch (error) {
      console.error("Error approving partner:", error);
      alert("Failed to approve partner request.");
    }
  };
  

  const rejectPartner = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized access! Please log in again.");
        return;
      }
  
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/partners/${id}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message);
      setPendingPartners((prev) => prev.filter((partner) => partner._id !== id));
    } catch (error) {
      console.error("Error rejecting partner:", error);
      alert("Failed to reject partner request.");
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Partner Approvals</h2>
      {pendingPartners.length === 0 ? (
        <p className="text-gray-500">No pending partner requests.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Aadhar</th>
              <th className="px-4 py-2">PAN</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingPartners.map((partner) => (
              <tr key={partner._id} className="border-t">
                <td className="px-4 py-2">{partner.name}</td>
                <td className="px-4 py-2">{partner.email}</td>
                <td className="px-4 py-2">{partner.phone}</td>
                <td className="px-4 py-2">
                  <a
                    href={partner.aadharUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Aadhar
                  </a>
                </td>
                <td className="px-4 py-2">
                  <a
                    href={partner.panUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View PAN
                  </a>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => approvePartner(partner._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectPartner(partner._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagePartners;
