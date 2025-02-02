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
      console.log("Failed to add to cart:", err.response || err);
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
    <div className="mx-auto max-w-6xl mt-20 px-8 py-12">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Recommended Medicine
      </h2>

      <div className="flex gap-10">
        {/* 🔥 Highlighted Alternate Medicine */}
        {firstAlternate ? (
          <div className="flex-1 p-6 border border-green-400 bg-green-50 shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-green-700">Best Alternative</h3>
            <img
              src={firstAlternate.manufacturerUrl || "default-image.jpg"}
              alt={firstAlternate.name}
              className="w-56 h-56 object-cover rounded-lg mt-4 mx-auto"
            />
            <p className="text-xl font-semibold text-gray-800 mt-2">{firstAlternate.name}</p>
            <p className="text-gray-600">Manufacturer: {firstAlternate.manufacturer || "N/A"}</p>
            <p className="text-lg font-bold text-green-600 mt-2">₹{firstAlternate.price}</p>
            <button
              onClick={() => addToCart(medicine._id)}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-400 mt-4 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="text-center">No alternate medicines available.</p>
        )}

        {/* 🏥 General Medicine (Less Emphasis) */}
        <div className="flex-1 p-6 border border-gray-300 bg-white shadow-md rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-800">Original Medicine</h3>
          <img
            src={medicine.imageUrl || "default-image.jpg"}
            alt={medicine.drugName}
            className="w-48 h-48 object-cover rounded-md mt-4 mx-auto"
          />
          <p className="text-xl font-semibold text-gray-800 mt-2">{medicine.drugName}</p>
          <p className="text-gray-600">Manufacturer: {medicine.manufacturer}</p>
          <p className="text-lg font-bold text-gray-700 mt-2">₹{medicine.price}</p>
        </div>
      </div>

      {/* 📊 Comparison Table */}
      {firstAlternate && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Compare Medicines
          </h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Property</th>
                <th className="border p-3 text-left">Recommended Alternative</th>
                <th className="border p-3 text-left">Original Medicine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Name</td>
                <td className="border p-3">{firstAlternate.name}</td>
                <td className="border p-3">{medicine.drugName}</td>
              </tr>
              <tr>
                <td className="border p-3">Price</td>
                <td className="border p-3 text-green-600 font-bold">₹{firstAlternate.price}</td>
                <td className="border p-3">₹{medicine.price}</td>
              </tr>
              <tr>
                <td className="border p-3">Manufacturer</td>
                <td className="border p-3">{firstAlternate.manufacturer || "N/A"}</td>
                <td className="border p-3">{medicine.manufacturer}</td>
              </tr>
              <tr>
                <td className="border p-3">Salt Composition</td>
                <td className="border p-3">{medicine.salt}</td>
                <td className="border p-3">{medicine.salt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MedicineDetails;
