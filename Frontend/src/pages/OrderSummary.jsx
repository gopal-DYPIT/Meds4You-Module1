import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders/latest", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Order Response:", response.data);
        setOrder(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch order summary");
        console.error("Error fetching order summary:", err);
      });
  }, [token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-10 mt-32  max-w-2xl mx-auto bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      {/* <div>{console.log(order)}</div> */}
      <p className="text-gray-700"><strong>Order ID:</strong> {order._id}</p>
      <p className="text-gray-700"><strong>Total Amount:</strong> ${order.totalAmount}</p>
      <p className="text-gray-700"><strong>Payment Status:</strong> {order.paymentStatus}</p>
      <p className="text-gray-700"><strong>Order Status:</strong> {order.orderStatus}</p>
      <h3 className="text-lg font-semibold mt-4">Items:</h3>
      <ul className="list-disc pl-5">
        {order.items.map((item) => (
          <li key={item.productId} className="text-gray-700">
            {item.productName} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => navigate("/")}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSummary;
