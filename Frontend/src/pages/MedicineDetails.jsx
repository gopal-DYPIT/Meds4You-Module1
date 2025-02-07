import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }

    const fetchMedicineDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );

        if (response.data) {
          setMedicine(response.data);
        } else {
          toast.error("Medicine not found.");
        }
      } catch (err) {
        console.error("Error fetching medicine details:", err);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  const addToCart = async (productId) => {
    if (!user) {
      toast.info("Please log in to add items to your cart.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        {
          userId: user.token,
          productId: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCart((prevCart) => [...prevCart, { productId, quantity: 1 }]);
      toast.success("Added to Cart!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to Add to Cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (!medicine) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const firstAlternate = medicine?.alternateMedicines?.[0];

  return (
    <div className="mx-auto max-w-6xl mt-10 sm:mt-20 px-4 sm:px-8 py-8 sm:py-12">
      <h2 className="text-3xl mt-8 sm:mt-0 sm:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
        Recommended Medicine
      </h2>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
        {/* 🏥 General Medicine (Less Emphasis) */}
        <div className="flex-1 p-4 sm:p-6 border border-gray-300 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Searched Medicine</h3>
          <img
            src={medicine.imageUrl || "default-image.jpg"}
            alt={medicine.drugName}
            className="w-32 sm:w-48 h-32 sm:h-48 object-cover rounded-md mt-4 mx-auto"
          />
          <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{medicine.drugName}</p>
          <p className="text-gray-600 text-sm sm:text-base">Manufacturer: {medicine.manufacturer}</p>
          <p className="text-lg sm:text-xl font-bold text-gray-700 mt-2">₹{medicine.price}</p>
        </div>

        {/* 🔥 Highlighted Alternate Medicine */}
        {firstAlternate ? (
          <div className="flex-1 p-4 sm:p-6 border border-green-400 bg-green-50 shadow-lg rounded-lg text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-green-700">Best Alternative</h3>
            <img
              src={firstAlternate.manufacturerUrl || "default-image.jpg"}
              alt={firstAlternate.name}
              className="w-38 sm:w-38 h-24 sm:h-32 mb-4 object-cover rounded-lg mt-4 mx-auto"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{firstAlternate.name}</p>
            <p className="text-gray-600 text-sm sm:text-base">
              Manufacturer: {firstAlternate.manufacturer || "N/A"}
            </p>
            <p className="text-lg sm:text-xl font-bold text-green-600 mt-2">₹{firstAlternate.price}</p>
            <button
              onClick={() => addToCart(medicine._id)}
              className="bg-green-600 text-white py-2 px-4 sm:px-6 rounded-md hover:bg-green-400 mt-4 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="text-center">No alternate medicines available.</p>
        )}
      </div>

      {/* 📊 Comparison Table */}
      {firstAlternate && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-4">
            Compare Medicines
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 sm:p-3 text-left">Property</th>
                  <th className="border p-2 sm:p-3 text-left">Original Medicine</th>
                  <th className="border p-2 sm:p-3 text-left">Recommended Alternative</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 sm:p-3">Name</td>
                  <td className="border p-2 sm:p-3">{medicine.drugName}</td>
                  <td className="border p-2 sm:p-3">{firstAlternate.name}</td>
                </tr>
                <tr>
                  <td className="border p-2 sm:p-3">Price</td>
                  <td className="border p-2 sm:p-3">₹{medicine.price}</td>
                  <td className="border p-2 sm:p-3 text-green-600 font-bold">₹{firstAlternate.price}</td>
                </tr>
                <tr>
                  <td className="border p-2 sm:p-3">Manufacturer</td>
                  <td className="border p-2 sm:p-3">{medicine.manufacturer}</td>
                  <td className="border p-2 sm:p-3">{firstAlternate.manufacturer || "N/A"}</td>
                </tr>
                <tr>
                  <td className="border p-2 sm:p-3">Salt Composition</td>
                  <td className="border p-2 sm:p-3">{medicine.salt}</td>
                  <td className="border p-2 sm:p-3">{medicine.salt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MedicineDetails;
