import { useEffect, useState } from "react";
import axios from "axios";

const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/admin`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Uploaded Prescriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="border p-4 rounded-lg shadow">
            <p><strong>User:</strong> {prescription.userId?.name || "Unknown"}</p>
            <p><strong>Email:</strong> {prescription.userId?.email || "Unknown"}</p>
            <p><strong>Uploaded:</strong> {new Date(prescription.uploadedAt).toLocaleString()}</p>
            <a href={prescription.fileUrl} target="_blank" rel="noopener noreferrer">
              <img src={prescription.fileUrl} alt="Prescription" className="w-full h-40 object-cover mt-2 rounded-lg" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPrescriptions;
